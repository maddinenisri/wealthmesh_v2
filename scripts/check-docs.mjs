import { markdownFiles } from './authored-documents.mjs';
import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { root } from './paths.mjs';

async function checkLinks(path, text) {
  const links = [...text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]);
  const problems = [];
  for (const link of links) {
    if (/^(https?:|mailto:|#)/.test(link)) continue;
    const target = link.replace(/^<|>$/g, '').split('#')[0];
    const resolved = resolve(dirname(path), decodeURIComponent(target));
    if (!(await stat(resolved).catch(() => null))) problems.push(`${path}: missing ${link}`);
  }
  return problems;
}
async function checkMarkdown(path) {
  const text = await readFile(path, 'utf8');
  const problems = await checkLinks(path, text);
  const fences = text.match(/^\s*```/gm) ?? [];
  if (fences.length % 2) problems.push(`${path}: unbalanced code fence`);
  return problems;
}
const files = await markdownFiles(join(root, 'docs'));
const problems = (await Promise.all(files.map(checkMarkdown))).flat();
if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Documentation file links and fences passed across ${files.length} authored Markdown files.`,
  );
