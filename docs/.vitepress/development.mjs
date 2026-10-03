import { realpathSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { createMarkdownRenderer, resolvePages } from 'vitepress';
import { MiniSearch } from './provider-dependencies.mjs';

const searchId = '/@localSearchIndex';

export function docsFilesystem(docsRoot, dependencies) {
  return {
    name: 'wealthmesh:docs-filesystem',
    enforce: 'post',
    configResolved(config) {
      config.server.fs.allow = [realpathSync(docsRoot), realpathSync(dependencies)];
    },
  };
}

function authoredPage(file, root) {
  const page = relative(root, file).replaceAll('\\', '/');
  return (
    page.endsWith('.md') &&
    !page.startsWith('../') &&
    !page.startsWith('requirements/snapshots/') &&
    !page.startsWith('.vitepress/')
  );
}

function sections(html) {
  const chunks = html.split(/<h(\d).*?>(.*?<a.*? href="#.*?".*?>.*?<\/a>)<\/h\1>/gi);
  const entries = [];
  const parents = [];
  for (let index = 1; index < chunks.length; index += 3) {
    const heading = /(.*?)<a.*? href="#(.*?)"/.exec(chunks[index + 1]);
    if (!heading) continue;
    const level = Number(chunks[index]) - 1;
    const title = heading[1].replace(/<[^>]*>/g, '').trim();
    const titles = parents.slice(0, level);
    titles[level] = title;
    entries.push({
      anchor: heading[2],
      titles: titles.filter(Boolean),
      text: chunks[index + 2].replace(/<[^>]*>/g, ''),
    });
    parents[level] = title;
    parents.length = level + 1;
  }
  return entries;
}

async function indexPages(site) {
  const markdown = await createMarkdownRenderer(
    site.srcDir,
    site.markdown,
    site.site.base,
    site.logger,
  );
  const index = new MiniSearch({
    fields: ['title', 'titles', 'text'],
    storeFields: ['title', 'titles'],
  });
  const { pages } = await resolvePages(site.srcDir, site.userConfig, site.logger);
  for (const page of pages) {
    const env = { relativePath: page, path: resolve(site.srcDir, page), cleanUrls: site.cleanUrls };
    const html = markdown.render(await readFile(env.path, 'utf8'), env);
    if (env.frontmatter?.search === false) continue;
    const fileId = `${site.site.base}${page}`
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, site.cleanUrls ? '' : '.html');
    for (const section of sections(html)) {
      index.add({
        id: `${fileId}#${section.anchor}`,
        text: section.text,
        title: section.titles.at(-1),
        titles: section.titles.slice(0, -1),
      });
    }
  }
  return JSON.stringify(index);
}

// The pinned VitePress 1.6.4 development hook passes absolute paths into a
// relative-page indexer. Preserve its built search and UI; repair development
// virtual modules using the same renderer and locked MiniSearch dependency.
export function developmentSearch() {
  let site;
  let index;
  let revision = 0;
  return {
    name: 'wealthmesh:development-search',
    apply: 'serve',
    enforce: 'pre',
    configResolved(config) {
      site = config.vitepress;
    },
    resolveId(id) {
      if (id.startsWith('@localSearchIndex')) return `/${id}`;
      if (id.startsWith(searchId)) return id;
    },
    async load(id) {
      if (id === searchId)
        return `export default {root: () => import('@localSearchIndexroot?revision=${revision}')}`;
      if (!id.startsWith(`${searchId}root`)) return;
      index ??= indexPages(site);
      return `export default ${JSON.stringify(await index)}`;
    },
    handleHotUpdate({ file, server }) {
      if (!authoredPage(file, site.srcDir)) return;
      index = undefined;
      revision++;
      server.moduleGraph.onFileChange(file);
      for (const [id, module] of server.moduleGraph.idToModuleMap) {
        if (id.startsWith(searchId)) server.moduleGraph.invalidateModule(module);
      }
      server.ws.send({ type: 'full-reload' });
    },
  };
}
