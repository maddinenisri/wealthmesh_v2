import { spawn } from 'node:child_process';
import { mkdir, open, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { localDatabaseConfig, databaseState } from './database.mjs';
import { runtime } from './paths.mjs';

async function backup() {
  await localDatabaseConfig();
  const database = await databaseState();
  if (!database.running || !database.healthy)
    throw new Error('Start the project database with npm run db:up before backup.');
  const directory = join(runtime, 'backups');
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const path = join(directory, `wealthmesh-${new Date().toISOString().replaceAll(':', '-')}.dump`);
  const output = await open(path, 'wx', 0o600);
  const child = spawn(
    'docker',
    ['exec', database.id, 'pg_dump', '-U', 'wealthmesh', '-d', 'wealthmesh_v2', '-Fc'],
    { stdio: ['ignore', output.fd, 'inherit'] },
  );
  try {
    await new Promise((resolve, reject) => {
      child.on('error', reject);
      child.on('exit', (code) =>
        code === 0 ? resolve() : reject(new Error(`Backup failed with exit ${code}`)),
      );
    });
    console.log(`Private database archive: ${path}`);
  } catch (error) {
    await unlink(path);
    throw error;
  } finally {
    await output.close();
  }
}
await backup().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
