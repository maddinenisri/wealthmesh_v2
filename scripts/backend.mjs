import { join } from 'node:path';
import { command } from './commands.mjs';
import { javaEnvironment, root } from './paths.mjs';

const tasks = process.argv.slice(2);
if (tasks.length === 0) throw new Error('Supply backend Gradle task names.');
try {
  await command(join(root, 'backend/gradlew'), ['--no-daemon', ...tasks], {
    cwd: join(root, 'backend'),
    env: await javaEnvironment(),
    timeout: 600000,
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
