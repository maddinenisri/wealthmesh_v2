import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function serverConfiguration(port) {
  const env = { ...process.env };
  delete env.WM_DOCS_PORT;
  if (port !== undefined) env.WM_DOCS_PORT = port;
  const source =
    "import config from './config.mjs'; console.log(JSON.stringify(config.vite.server));";
  return JSON.parse(
    execFileSync(process.execPath, ['--input-type=module', '-e', source], {
      cwd: fileURLToPath(new URL('./', import.meta.url)),
      env,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }),
  );
}

test('reader defaults to approved loopback address and port with strict conflicts', () => {
  const server = serverConfiguration(undefined);
  assert.equal(server.port, 5174);
  assert.equal(server.host, '127.0.0.1');
  assert.equal(server.strictPort, true);
});

test('explicit docs port overrides work for the actual VitePress configuration', () => {
  const server = serverConfiguration('43123');
  assert.equal(server.port, 43123);
  assert.equal(server.host, '127.0.0.1');
  assert.equal(server.strictPort, true);
});

test('invalid explicit docs port values fail before starting a reader', () => {
  for (const port of ['', 'not-a-port', '1023', '65536', '-1', '5174.5']) {
    assert.throws(
      () => serverConfiguration(port),
      /WM_DOCS_PORT must be an integer from 1024 through 65535/,
    );
  }
});
