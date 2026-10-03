import { posix } from 'node:path';

function attribute(markdown, value) {
  return markdown.utils.escapeHtml(JSON.stringify(value));
}

function sourceReference(href, page) {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(href)) return null;
  const path = posix.normalize(posix.join('docs', posix.dirname(page ?? 'index.md'), href));
  const file = path.split('#')[0];
  const insideDocs = file.startsWith('docs/');
  const displayAsset = /\.(?:png|jpe?g|gif|svg|webp|pdf)$/i.test(file);
  if (insideDocs && (/\.md$/.test(file) || displayAsset)) return null;
  return path;
}

function installSourceLinks(markdown) {
  const original = markdown.renderer.rules.link_open;
  markdown.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
    const reference = sourceReference(tokens[index].attrGet('href') ?? '', env.relativePath);
    if (!reference)
      return (
        original?.(tokens, index, options, env, renderer) ??
        renderer.renderToken(tokens, index, options)
      );
    const close = tokens.findIndex(
      (token, position) => position > index && token.type === 'link_close',
    );
    tokens[close].type = 'html_inline';
    tokens[close].content =
      ` <span class="source-path">(Local source path: <code>${markdown.utils.escapeHtml(reference)}</code>)</span></span>`;
    return '<span class="source-reference">';
  };
}

export function documentationMarkdown(markdown) {
  const fence = markdown.renderer.rules.fence;
  markdown.renderer.rules.fence = (tokens, index, options, env, renderer) => {
    const token = tokens[index];
    if (token.info.trim() !== 'mermaid') return fence(tokens, index, options, env, renderer);
    const sourcePath = `docs/${env.relativePath ?? 'index.md'}`;
    return `<MermaidDiagram :source="${attribute(markdown, token.content)}" :source-path="${attribute(markdown, sourcePath)}" diagram-id="diagram-${index}" />\n`;
  };
  installSourceLinks(markdown);
  markdown.core.ruler.push('canonical-source', (state) => {
    if (!state.env.relativePath) return;
    const token = new state.Token('html_block', '', 0);
    token.content = `<aside class="markdown-source" aria-label="Markdown source">Markdown source: <code>${markdown.utils.escapeHtml(`docs/${state.env.relativePath}`)}</code></aside>`;
    state.tokens.push(token);
  });
}
