import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
export async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => !['.vitepress', 'snapshots'].includes(entry.name))
      .map(async (entry) => {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) return markdownFiles(path);
        return entry.name.endsWith('.md') ? [path] : [];
      }),
  );
  return files.flat();
}
