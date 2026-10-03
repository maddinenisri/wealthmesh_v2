import assert from 'node:assert/strict';
import { test, before, after } from 'node:test';
import { cp, mkdir, mkdtemp, realpath, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vitepress';
import { MiniSearch } from './provider-dependencies.mjs';
import { createServer as createHttpServer } from 'node:http';

let fixture;
let server;
let docs;
const dependencies = await realpath(fileURLToPath(new URL('../../node_modules/', import.meta.url)));

before(async () => {
  fixture = await realpath(await mkdtemp(join(tmpdir(), 'wm2-docs-unit-')));
  docs = join(fixture, 'docs');
  await mkdir(join(docs, 'operations'), { recursive: true });
  await cp(fileURLToPath(new URL('./', import.meta.url)), join(docs, '.vitepress'), {
    recursive: true,
    filter: (path) => !/\/(dist|cache)(\/|$)/.test(path),
  });
  await symlink(dependencies, join(fixture, 'node_modules'));
  await rename(join(docs, '.vitepress/config.mjs'), join(docs, '.vitepress/reader-config.mjs'));
  await writeFile(
    join(docs, '.vitepress/config.mjs'),
    "import reader from './reader-config.mjs';\nexport default {...reader, vite: {...reader.vite, plugins: [...reader.vite.plugins, {name: 'unit-no-optimizer', configResolved(config) { config.optimizeDeps.include = []; config.optimizeDeps.noDiscovery = true; }}]}};\n",
  );
  await writeFile(
    join(docs, 'index.md'),
    '# Test reader\n\n## OriginalSearchTerm\n\nOriginal excerpt.\n',
  );
  server = await createServer(docs, { middlewareMode: true, hmr: { server: createHttpServer() } });
});

after(async () => {
  await server?.close();
  if (fixture) await rm(fixture, { recursive: true });
});

test('resolved VitePress filesystem roots exclude ambient repository and fixture roots', () => {
  assert.deepEqual(server.config.server.fs.allow.sort(), [docs, dependencies].sort());
});

function searchPlugin() {
  return (
    server.config.plugins.find((plugin) => plugin.name === 'wealthmesh:development-search') ??
    server.config.plugins.find((plugin) => plugin.name === 'vitepress:local-search')
  );
}

async function search(term) {
  const plugin = searchPlugin();
  const moduleSource = await plugin.load.call({}, '/@localSearchIndexroot');
  const json = JSON.parse(moduleSource.replace(/^export default /, ''));
  return MiniSearch.loadJSON(json, {
    fields: ['title', 'titles', 'text'],
    storeFields: ['title', 'titles'],
  }).search(term);
}

test('saving an existing Markdown page adds new searchable content and removes replaced content', async () => {
  assert.equal((await search('OriginalSearchTerm')).length, 1);
  const file = join(docs, 'index.md');
  await writeFile(file, '# Test reader\n\n## UpdatedSearchTerm\n\nUpdated excerpt.\n');
  await searchPlugin().handleHotUpdate({ file, server });
  assert.equal((await search('UpdatedSearchTerm')).length, 1);
  assert.equal((await search('OriginalSearchTerm')).length, 0);
});

test('a newly saved handoff is searchable without a server restart or a stale page list', async () => {
  const file = join(docs, 'handoff.md');
  await writeFile(file, '# NewHandoffTerm\n\nSynthetic role handoff.\n');
  await searchPlugin().handleHotUpdate({ file, server });
  assert.equal((await search('NewHandoffTerm')).length, 1);
});
