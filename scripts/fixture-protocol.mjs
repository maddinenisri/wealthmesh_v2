import { readFile, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { waitUntil } from './commands.mjs';

export async function fixtureCommand(directory, command) {
  const id = randomUUID();
  const target = join(directory, 'commands', `${id}.json`);
  await writeFile(`${target}.tmp`, JSON.stringify({ command }), { mode: 0o600 });
  await rename(`${target}.tmp`, target);
  let response;
  await waitUntil(
    async () => {
      response = JSON.parse(
        await readFile(join(directory, 'responses', `${id}.json`), 'utf8').catch(() => 'null'),
      );
      return response !== null;
    },
    `fixture command ${command}`,
    20000,
  );
  if (!response.ok) throw new Error(`Fixture ${command} failed: ${response.error}`);
  return response;
}
export async function readFixtureReady(directory) {
  return JSON.parse(await readFile(join(directory, 'ready.json'), 'utf8').catch(() => 'null'));
}
