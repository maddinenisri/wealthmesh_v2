import { spawn } from 'node:child_process';
import { root } from './paths.mjs';

export async function command(executable, args, options = {}) {
  const { env = process.env, cwd = root, timeout = 120000, capture = false } = options;
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd,
      env,
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    });
    let output = '';
    let errorOutput = '';
    child.stdout?.on('data', (data) => {
      output += data;
    });
    child.stderr?.on('data', (data) => {
      errorOutput += data;
    });
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`${executable} timed out after ${timeout}ms`));
    }, timeout);
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('exit', (code) => {
      clearTimeout(timer);
      if (code !== 0)
        return reject(
          new Error(
            `${executable} exited ${code}. ${capture ? errorOutput : 'See command output/log.'}`,
          ),
        );
      resolve(output.trim());
    });
  });
}
export async function waitUntil(check, description, timeout = 60000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await check()) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Timed out waiting for ${description}. Check .runtime/ logs.`);
}
