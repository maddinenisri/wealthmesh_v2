import { lint } from 'markdownlint/promise';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root } from './paths.mjs';
import { markdownFiles } from './authored-documents.mjs';

const files = await markdownFiles(join(root, 'docs'));
const config = JSON.parse(await readFile(join(root, '.markdownlint.json'), 'utf8'));
const result = await lint({ files, config });
const output = Object.entries(result)
  .flatMap(([path, errors]) =>
    errors.map(
      (error) =>
        `${path}:${error.lineNumber} ${error.ruleNames.join('/')} ${error.ruleDescription}`,
    ),
  )
  .join('\n');
if (output) {
  console.error(output);
  process.exitCode = 1;
} else
  console.log(
    `Markdown lint passed across ${files.length} authored files; immutable originals excluded.`,
  );
