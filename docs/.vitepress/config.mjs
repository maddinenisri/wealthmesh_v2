import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';
import { documentationMarkdown } from './markdown.mjs';
import { docsFilesystem, developmentSearch } from './development.mjs';

const docsRoot = fileURLToPath(new URL('../', import.meta.url));
const dependencies = fileURLToPath(new URL('../../node_modules/', import.meta.url));

function documentationPort(value = '5174') {
  const port = Number(value);
  if (!/^\d+$/.test(value) || !Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error('WM_DOCS_PORT must be an integer from 1024 through 65535.');
  }
  return port;
}

const operations = readdirSync(new URL('../operations/', import.meta.url))
  .filter((file) => file.endsWith('.md'))
  .map((file) => ({
    text: file === 'index.md' ? 'Operating guide' : file.replace(/\.md$/, '').replaceAll('-', ' '),
    link: file === 'index.md' ? '/operations/' : `/operations/${file.replace(/\.md$/, '')}`,
  }));

export default defineConfig({
  title: 'WealthMesh documentation',
  description:
    'Feature designs, agent work, decisions and operating guidance for household finances.',
  lang: 'en-US',
  srcExclude: ['requirements/snapshots/**'],
  markdown: { config: documentationMarkdown },
  vite: {
    plugins: [docsFilesystem(docsRoot, dependencies), developmentSearch()],
    server: {
      host: '127.0.0.1',
      port: documentationPort(process.env.WM_DOCS_PORT),
      strictPort: true,
      fs: {
        strict: true,
        allow: [docsRoot, dependencies],
        deny: [
          '**/.env',
          '**/.env.*',
          '**/*.{crt,pem}',
          '**/.runtime/**',
          '**/.tools/**',
          '**/.git/**',
          '**/.aws/**',
        ],
      },
    },
  },
  themeConfig: {
    nav: [
      { text: 'Start here', link: '/' },
      { text: 'Current feature', link: '/features/setup/' },
      { text: 'Questions', link: '/questions' },
      { text: 'Decisions', link: '/decisions' },
      { text: 'Features', link: '/features/' },
    ],
    sidebar: [
      {
        text: 'Read the project',
        items: [
          { text: 'Start here', link: '/' },
          { text: 'Feature index', link: '/features/' },
          { text: 'Questions', link: '/questions' },
          { text: 'Human decisions', link: '/decisions' },
          { text: 'Requirements inventory', link: '/requirements/' },
        ],
      },
      {
        text: 'Project setup',
        items: [
          { text: 'Review packet', link: '/features/setup/' },
          { text: 'Canonical status', link: '/features/setup/status' },
          { text: 'Architecture', link: '/features/setup/architecture' },
          { text: 'Annotated screens', link: '/features/setup/ux-design' },
          { text: 'Acceptance test plan', link: '/features/setup/acceptance-test-plan' },
          { text: 'Design review', link: '/features/setup/design-review' },
          { text: 'What changed and final evidence', link: '/features/setup/implementation' },
          { text: 'Working demo', link: '/features/setup/demo' },
        ],
      },
      {
        text: 'Agent work',
        items: [
          { text: 'Roles and responsibilities', link: '/agent-roles' },
          { text: 'Tasks and handoffs', link: '/features/setup/agent-protocol' },
          { text: 'Backend handoff', link: '/features/setup/backend-implementation' },
          { text: 'Platform handoff', link: '/features/setup/platform-implementation' },
          { text: 'Documentation handoff', link: '/features/setup/docs-implementation' },
        ],
      },
      {
        text: 'Operations',
        items: operations.length
          ? operations
          : [
              {
                text: 'Operating guidance readiness',
                link: '/features/setup/platform-implementation',
              },
            ],
      },
      {
        text: 'Engineering reference',
        items: [
          { text: 'Delivery workflow', link: '/workflow' },
          { text: 'Coding standards', link: '/coding-standards' },
          { text: 'Setup design', link: '/bootstrap-design' },
        ],
      },
    ],
    outline: [2, 3],
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        translations: {
          button: { buttonText: 'Search documentation', buttonAriaLabel: 'Search documentation' },
          modal: {
            noResultsText:
              'No matching documentation pages. Try broader terms or use navigation. Search term:',
          },
        },
      },
    },
    notFound: {
      title: 'Document not found',
      quote:
        'This document may not exist yet or its address has changed. Start here to find the feature index and current work.',
      linkLabel: 'Return to the project overview',
      linkText: 'Start here',
    },
    footer: { message: 'Read-only local documentation. Human decisions are recorded from chat.' },
  },
});
