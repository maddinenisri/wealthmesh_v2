import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { command } from './commands.mjs';
import { freePort } from './e2e-support.mjs';
import { root } from './paths.mjs';
import { join } from 'node:path';

const server = createServer();
const port = await freePort();
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(port, '127.0.0.1', resolve);
});
try {
  await assert.rejects(
    command(process.execPath, [join(root, 'scripts/runtime.mjs'), 'start'], {
      env: { ...process.env, WM_FRONTEND_PORT: String(port) },
      capture: true,
    }),
    /already in use/,
  );
  assert.equal(server.listening, true);
  console.log(
    `Startup rejected unrelated synthetic port ${port}; that listener remained owned and listening.`,
  );
} finally {
  await new Promise((resolve) => server.close(resolve));
}
