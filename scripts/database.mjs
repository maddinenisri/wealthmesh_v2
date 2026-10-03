import { randomBytes } from 'node:crypto';
import { readFile, writeFile, chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { command, waitUntil } from './commands.mjs';
import { root, runtime, prepareRuntime } from './paths.mjs';
import { assertPortFree, validatePort } from './processes.mjs';

export async function localDatabaseConfig() {
  await prepareRuntime();
  const path = join(runtime, 'local.env');
  let text = await readFile(path, 'utf8').catch(() => '');
  if (!text) {
    text = `POSTGRES_PASSWORD=${randomBytes(32).toString('hex')}\n`;
    await writeFile(path, text, { flag: 'wx', mode: 0o600 });
  }
  await chmod(path, 0o600);
  const password = /^POSTGRES_PASSWORD=([a-f0-9]{64})$/m.exec(text)?.[1];
  if (!password)
    throw new Error(
      'Invalid .runtime/local.env. Restore the original local configuration; do not change credentials on an existing volume.',
    );
  const image = (await readFile(join(root, 'config/postgres-image.txt'), 'utf8')).trim();
  return { password, image, port: validatePort(process.env.WM_DB_PORT ?? '5433', 'database') };
}
export async function compose(args, capture = false) {
  const config = await localDatabaseConfig();
  return command(
    'docker',
    ['compose', '--project-directory', root, '-f', join(root, 'compose.yaml'), ...args],
    {
      env: {
        ...process.env,
        POSTGRES_IMAGE: config.image,
        POSTGRES_PASSWORD: config.password,
        WM_DB_PORT: String(config.port),
      },
      capture,
    },
  );
}
export async function databaseState() {
  const id = await compose(['ps', '-q', 'postgres'], true);
  if (!id) return { running: false };
  const inspection = await command(
    'docker',
    ['inspect', '--format', '{{json .State}}|{{json .HostConfig.PortBindings}}', id],
    { capture: true },
  );
  const [stateText, bindingText] = inspection.split('|');
  const state = JSON.parse(stateText);
  const bindings = JSON.parse(bindingText);
  const ports = Object.values(bindings).flat();
  if (ports.some((binding) => binding.HostIp !== '127.0.0.1'))
    throw new Error(
      'Database has a non-loopback published port. Stop this project and inspect Compose configuration.',
    );
  return { running: state.Running, healthy: state.Health?.Status === 'healthy', id };
}
export async function startDatabase() {
  const before = await databaseState();
  if (!before.running) {
    const config = await localDatabaseConfig();
    await assertPortFree(config.port, 'database');
    try {
      await compose(['up', '-d', '--wait', '--wait-timeout', '90', 'postgres']);
    } catch (error) {
      await stopDatabase();
      throw error;
    }
  }
  await waitUntil(async () => (await databaseState()).healthy, 'PostgreSQL readiness', 95000);
  return !before.running;
}
export async function stopDatabase() {
  await compose(['stop', '--timeout', '20', 'postgres']);
}
