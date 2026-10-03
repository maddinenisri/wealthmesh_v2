import { spawn } from 'node:child_process';
import { open, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { command, waitUntil } from './commands.mjs';
import { processIdentity } from './processes.mjs';
import { fixtureCommand, readFixtureReady } from './fixture-protocol.mjs';
import { javaEnvironment, root } from './paths.mjs';

export async function freePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}
export async function startFixture(directory, port) {
  const log = await open(join(directory, 'backend.log'), 'a', 0o600);
  const args = ['--no-daemon', 'e2eFixture', `-PfixtureDir=${directory}`, `-PbackendPort=${port}`];
  if (process.env.WM_E2E_FORCE_STARTUP_FAILURE === '1') args.push('-PfixtureStartupFailure=true');
  const child = spawn(join(root, 'backend/gradlew'), args, {
    cwd: join(root, 'backend'),
    env: await javaEnvironment(),
    stdio: ['ignore', log.fd, log.fd],
  });
  await log.close();
  child.on('error', (error) => {
    console.error(error.message);
  });
  return child;
}
export async function waitForFixture(directory, child) {
  let ready;
  await waitUntil(
    async () => {
      if (child.exitCode !== null)
        throw new Error(`Backend fixture exited ${child.exitCode}. See ${directory}/backend.log`);
      ready = await readFixtureReady(directory);
      return ready !== null;
    },
    'isolated backend fixture',
    120000,
  );
  if (ready.databaseHost !== '127.0.0.1' || !ready.backendUrl.startsWith('http://127.0.0.1:')) {
    throw new Error('Fixture violated loopback isolation.');
  }
  return ready;
}
async function interruptOwnedFixture(directory) {
  const owner = JSON.parse(
    await readFile(join(directory, 'owner.json'), 'utf8').catch(() => 'null'),
  );
  if (!owner) return;
  const identity = await processIdentity(owner.pid);
  if (identity.includes('com.wealthmesh.testsupport.E2eFixture') && identity.includes(directory)) {
    process.kill(owner.pid, 'SIGTERM');
    await waitUntil(
      async () => !(await processIdentity(owner.pid)).includes(directory),
      'fixture JVM termination',
      20000,
    );
  }
}
export async function stopFixture(directory, child) {
  const ready = await readFixtureReady(directory);
  if (child.exitCode === null && ready)
    await fixtureCommand(directory, 'stop').catch(() => interruptOwnedFixture(directory));
  if (child.exitCode === null && !ready) await interruptOwnedFixture(directory);
  await waitUntil(
    () => child.exitCode !== null || child.signalCode !== null,
    'Gradle fixture exit',
    30000,
  );
  return inspectCleanup(directory, ready);
}
async function inspectCleanup(directory, ready) {
  const owner = JSON.parse(
    await readFile(join(directory, 'owner.json'), 'utf8').catch(() => 'null'),
  );
  const ids = [
    ready?.containerId ?? owner?.containerId,
    ready?.cleanupContainerId ?? owner?.cleanupContainerId,
  ].filter(Boolean);
  for (const id of ids) {
    await waitUntil(
      async () => {
        const remaining = await command('docker', ['ps', '-a', '-q', '--filter', `id=${id}`], {
          capture: true,
        });
        return remaining === '';
      },
      `owned disposable container ${id} removal`,
      30000,
    );
  }
  return ids;
}
