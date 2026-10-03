import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MarkdownIt } from './provider-dependencies.mjs';
import { documentationMarkdown } from './markdown.mjs';

const example = '```mermaid\nflowchart LR\nA[Markdown] --> B[Browser]\n```\n';

const markdown = new MarkdownIt();
documentationMarkdown(markdown);

test('Mermaid fences become client-rendered diagrams with original source and canonical path', () => {
  const result = markdown.render(example, { relativePath: 'features/setup/index.md' });
  assert.match(result, /<MermaidDiagram/);
  assert.match(result, /flowchart LR/);
  assert.match(result, /docs\/features\/setup\/index\.md/);
});

test('ordinary code fences remain readable code', () => {
  const result = markdown.render('```java\nclass Example {}\n```');
  assert.match(result, /<pre>/);
  assert.doesNotMatch(result, /MermaidDiagram/);
});

test('local code links become clearly labeled copyable paths, never arbitrary file-server links', () => {
  const result = markdown.render('[Agent instructions](../../../AGENTS.md)', {
    relativePath: 'features/setup/ux-design.md',
  });
  assert.match(result, /Local source path/);
  assert.match(result, /AGENTS\.md/);
  assert.doesNotMatch(result, /href=/);
});

test('Markdown page links keep browser navigation', () => {
  const result = markdown.render('[Decisions](../../decisions.md)', {
    relativePath: 'features/setup/index.md',
  });
  assert.match(result, /href="\.\.\/\.\.\/decisions\.md"/);
});

test('Mermaid source cannot escape its Vue property into markup', () => {
  const result = markdown.render('```mermaid\n</MermaidDiagram><script>alert(1)</script>\n```', {
    relativePath: 'index.md',
  });
  assert.doesNotMatch(result, /<script>/);
  assert.match(result, /&lt;script&gt;/);
});
