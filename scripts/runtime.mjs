import { backendArguments } from './application-configuration.mjs';
import { mkdir, rmdir } from 'node:fs/promises';
import { join } from 'node:path';
import { command, waitUntil } from './commands.mjs';
import { root, runtime, prepareRuntime, javaEnvironment } from './paths.mjs';
import {
  aliveRecords,
  assertPortFree,
  launchOwned,
  readManifest,
  saveManifest,
  stopOwned,
  validatePort,
} from './processes.mjs';
import { localDatabaseConfig, startDatabase, stopDatabase, databaseState } from './database.mjs';
import { preflight } from './preflight.mjs';

const ports = {
  frontend: validatePort(process.env.WM_FRONTEND_PORT ?? '5173', 'frontend'),
  backend: validatePort(process.env.WM_BACKEND_PORT ?? '8080', 'backend'),
  docs: validatePort(process.env.WM_DOCS_PORT ?? '5174', 'documentation'),
};
const url = (port) => `http://127.0.0.1:${port}`;
const vite = join(root, 'frontend/node_modules/vite/bin/vite.js');
const vitepress = join(root, 'node_modules/vitepress/bin/vitepress.js');
async function httpHealthy(address) {
  try {
    return (await fetch(address, { signal: AbortSignal.timeout(1000) })).ok;
  } catch {
    return false;
  }
}
async function docsLaunch(records, retained = []) {
  if (records.some((record) => record.label === 'docs')) return;
  await assertPortFree(ports.docs, 'documentation');
  records.push(
    await launchOwned(
      'docs',
      process.execPath,
      [
        vitepress,
        'dev',
        'docs',
        '--host',
        '127.0.0.1',
        '--port',
        String(ports.docs),
        '--strictPort',
      ],
      { ...process.env, WM_DOCS_PORT: String(ports.docs) },
    ),
  );
  await saveManifest([...retained, ...records]);
  await waitUntil(() => httpHealthy(url(ports.docs)), 'documentation reader', 30000);
}
async function start() {
  const existing = await aliveRecords();
  if (existing.some((record) => record.label !== 'docs'))
    throw new Error(
      'WealthMesh is already running. Use npm run status or npm run stop; duplicate processes were not started.',
    );
  await preflight();
  await Promise.all([
    assertPortFree(ports.frontend, 'frontend'),
    assertPortFree(ports.backend, 'backend'),
  ]);
  if (!existing.length) await assertPortFree(ports.docs, 'documentation');
  await command(join(root, 'backend/gradlew'), ['--no-daemon', 'bootJar'], {
    cwd: join(root, 'backend'),
    env: await javaEnvironment(),
    timeout: 600000,
  });
  const created = [];
  let databaseCreated = false;
  try {
    databaseCreated = await startDatabase();
    await applicationLaunch(created, existing);
    if (!existing.some((record) => record.label === 'docs')) await docsLaunch(created, existing);
    await saveManifest([...existing, ...created]);
    console.log(
      `App ${url(ports.frontend)}\nAPI ${url(ports.backend)}/api/system/status\nDocs ${url(ports.docs)}\nLogs .runtime/{backend,frontend,docs}.log`,
    );
  } catch (error) {
    for (const record of created.reverse()) await stopOwned(record);
    if (databaseCreated) await stopDatabase();
    await saveManifest(existing);
    throw error;
  }
}
async function backendLaunch(created, existing) {
  const database = await localDatabaseConfig();
  const env = {
    ...(await javaEnvironment()),
    WM_BACKEND_PORT: String(ports.backend),
    WM_DB_URL: `jdbc:postgresql://127.0.0.1:${database.port}/wealthmesh_v2`,
    WM_DB_USERNAME: 'wealthmesh',
    WM_DB_PASSWORD: database.password,
  };
  created.push(
    await launchOwned(
      'backend',
      join(env.JAVA_HOME, 'bin/java'),
      backendArguments(join(root, 'backend/build/libs/wealthmesh-backend-0.0.1-SNAPSHOT.jar')),
      env,
    ),
  );
  await saveManifest([...existing, ...created]);
  await waitUntil(
    () => httpHealthy(`${url(ports.backend)}/api/system/status`),
    'backend readiness',
    60000,
  );
}
async function applicationLaunch(created, existing) {
  await backendLaunch(created, existing);
  created.push(
    await launchOwned(
      'frontend',
      process.execPath,
      [
        vite,
        join(root, 'frontend'),
        '--host',
        '127.0.0.1',
        '--port',
        String(ports.frontend),
        '--strictPort',
      ],
      {
        ...process.env,
        WM_BACKEND_URL: url(ports.backend),
        WM_FRONTEND_PORT: String(ports.frontend),
      },
    ),
  );
  await saveManifest([...existing, ...created]);
  await waitUntil(() => httpHealthy(url(ports.frontend)), 'frontend readiness', 30000);
}
async function stop() {
  for (const record of (await readManifest()).reverse()) await stopOwned(record);
  await saveManifest([]);
  await stopDatabase();
  console.log('Project processes stopped. PostgreSQL volume preserved.');
}
async function status() {
  for (const record of await aliveRecords())
    console.log(`${record.label}: PID ${record.pid}; ${record.logPath}`);
  console.log(`Database ${JSON.stringify(await databaseState())}`);
}
const operations = {
  preflight,
  start,
  stop,
  status,
  'db-up': startDatabase,
  'db-stop': stopDatabase,
  docs: async () => {
    await preflight({ backend: false, database: false });
    const records = await aliveRecords();
    await docsLaunch(records);
    console.log(`Docs ${url(ports.docs)}`);
  },
};
async function main() {
  await prepareRuntime();
  const operation = operations[process.argv[2]];
  if (!operation) throw new Error('Use preflight, start, stop, status, db-up, db-stop or docs.');
  const lock = join(runtime, 'lifecycle.lock');
  await mkdir(lock).catch(() => {
    throw new Error(
      'Another lifecycle operation is running, or .runtime/lifecycle.lock is stale. Check active commands before removing only that empty lock directory.',
    );
  });
  try {
    await operation();
  } finally {
    await rmdir(lock);
  }
}
await main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
