import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { backendArguments } from './application-configuration.mjs';
import { javaEnvironment, root } from './paths.mjs';

async function probe(directory, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      join(env.JAVA_HOME, 'bin/java'),
      backendArguments(join(root, 'backend/build/libs/wealthmesh-backend-0.0.1-SNAPSHOT.jar')),
      { cwd: directory, env, stdio: ['ignore', 'pipe', 'pipe'] },
    );
    let output = '';
    child.stdout.on('data', (data) => {
      output += data;
    });
    child.stderr.on('data', (data) => {
      output += data;
    });
    child.on('error', reject);
    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('Launcher probe exceeded 20 seconds.'));
    }, 20000);
    child.on('exit', (code) => {
      clearTimeout(timeout);
      resolve({ code, output });
    });
  });
}
async function check() {
  const directory = await mkdtemp(join(tmpdir(), 'wealthmesh-launcher-'));
  const external =
    'spring:\n  config:\n    import: file:/synthetic-external-launcher-probe-does-not-exist.yaml\nserver:\n  address: 0.0.0.0\n';
  await mkdir(join(directory, 'config'));
  await writeFile(join(directory, 'application.yaml'), external);
  await writeFile(join(directory, 'config/application.yaml'), external);
  try {
    const env = {
      ...(await javaEnvironment()),
      WM_DB_URL: 'jdbc:postgresql://127.0.0.1:1/synthetic_owned',
      WM_DB_USERNAME: 'synthetic',
      WM_DB_PASSWORD: 'synthetic',
      WM_BACKEND_PORT: '0',
    };
    const result = await probe(directory, env);
    assert.notEqual(
      result.code,
      0,
      'The deliberately absent synthetic database must prevent startup',
    );
    assert.match(result.output, /Connection to 127\.0\.0\.1:1 refused/);
    assert.doesNotMatch(result.output, /synthetic-external-launcher-probe/);
    console.log(
      'Development JAR ignored both external configuration probes and reached only its explicit synthetic loopback database target. No development connection used.',
    );
  } finally {
    await rm(directory, { recursive: true });
  }
}
await check().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
