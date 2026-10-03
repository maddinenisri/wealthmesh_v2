import assert from 'node:assert/strict';
import { writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { command } from './commands.mjs';
import { root } from './paths.mjs';

const name = `UnexpectedTraffic-${randomUUID()}.test.tsx`;
const path = join(root, 'frontend/src/test', name);
await writeFile(
  path,
  `import { render, screen } from '@testing-library/react';\nimport { it, expect } from 'vitest';\nimport { SetupStatus } from '../features/system/SetupStatus';\nit('unexpected network traffic cannot hide behind a caught error', async () => { render(<SetupStatus />); expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the local server'); });\n`,
  { flag: 'wx' },
);
try {
  await assert.rejects(
    command('npm', ['run', 'test', '--workspace', 'frontend', '--', `src/test/${name}`], {
      capture: true,
      timeout: 15000,
    }),
    /Every test request needs an explicit MSW handler/,
  );
  console.log(
    'Deliberately unmatched MSW traffic caused the required nonzero test result even though the UI caught the network error. Synthetic fixture removed.',
  );
} finally {
  await unlink(path);
}
