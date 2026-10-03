import { sanitizeJavaEnvironment } from './java-environment.mjs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { mkdir, readdir } from 'node:fs/promises';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const runtime = join(root, '.runtime');
export const manifestPath = join(runtime, 'processes.json');
export async function prepareRuntime() {
  await mkdir(runtime, { recursive: true, mode: 0o700 });
}
export async function javaHome() {
  const base = join(root, '.tools/java');
  const entries = await readdir(base).catch(() => []);
  const directory = entries.find((entry) => entry.startsWith('jdk-25.'));
  if (!directory) throw new Error('Java 25 is missing. Run bash backend/install-java.sh.');
  return join(base, directory, 'Contents/Home');
}
export async function javaEnvironment() {
  return {
    ...sanitizeJavaEnvironment(process.env),
    JAVA_HOME: await javaHome(),
    GRADLE_USER_HOME: join(root, '.tools/gradle-cache'),
  };
}
