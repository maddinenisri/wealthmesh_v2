import { createRequire } from 'node:module';

// Resolve the locked provider's own dependencies, independent of npm hoisting.
const requireFromVitePress = createRequire(import.meta.resolve('vitepress/package.json'));
export const MarkdownIt = requireFromVitePress('markdown-it');
export const MiniSearch = requireFromVitePress('minisearch');
