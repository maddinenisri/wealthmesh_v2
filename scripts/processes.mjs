import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { randomUUID } from 'node:crypto';
import { open, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { command, waitUntil } from './commands.mjs';
import { root, runtime, manifestPath } from './paths.mjs';

export function validatePort(value, label) {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error(`${label} port must be an integer between 1024 and 65535.`);
  }
  return port;
}
export async function assertPortFree(port, label) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', () =>
      reject(
        new Error(
          `${label} port ${port} is already in use or cannot be bound. Stop its owner or choose an explicit WM_*_PORT override.`,
        ),
      ),
    );
    server.listen(port, '127.0.0.1', () => server.close(resolve));
  });
}
export async function processIdentity(pid) {
  return command('ps', ['-p', String(pid), '-o', 'lstart=', '-o', 'command='], {
    capture: true,
  }).catch(() => '');
}
export async function isOwnedProcess(record) {
  const identity = await processIdentity(record.pid);
  return (
    identity.includes(join(root, 'scripts/owned-process.mjs')) &&
    identity.includes(record.token) &&
    identity.startsWith(record.started)
  );
}
export async function readManifest() {
  return JSON.parse(await readFile(manifestPath, 'utf8').catch(() => '[]'));
}
export async function saveManifest(records) {
  await writeFile(manifestPath, JSON.stringify(records, null, 2), { mode: 0o600 });
}
export async function launchOwned(label, executable, args, env = process.env) {
  const token = randomUUID();
  const logPath = join(runtime, `${label}.log`);
  const log = await open(logPath, 'a', 0o600);
  const child = spawn(
    process.execPath,
    [join(root, 'scripts/owned-process.mjs'), token, executable, ...args],
    {
      cwd: root,
      env,
      detached: true,
      stdio: ['ignore', log.fd, log.fd],
    },
  );
  child.unref();
  await log.close();
  await waitUntil(
    async () => (await processIdentity(child.pid)).includes(token),
    `${label} process`,
    5000,
  );
  const identity = await processIdentity(child.pid);
  return { label, pid: child.pid, token, started: identity.slice(0, 24), logPath };
}
export async function stopOwned(record) {
  if (!(await isOwnedProcess(record))) return;
  process.kill(record.pid, 'SIGTERM');
  await waitUntil(async () => !(await isOwnedProcess(record)), `${record.label} shutdown`, 20000);
}
export async function aliveRecords() {
  const records = await readManifest();
  const checks = await Promise.all(
    records.map(async (record) => ({ record, alive: await isOwnedProcess(record) })),
  );
  return checks.filter(({ alive }) => alive).map(({ record }) => record);
}
