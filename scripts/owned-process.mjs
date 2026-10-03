import { spawn } from 'node:child_process';

const [, , token, executable, ...args] = process.argv;
if (!token || !executable) throw new Error('An ownership token and executable are required.');
const child = spawn(executable, args, { stdio: 'inherit' });
let stopping = false;
const terminate = () => {
  if (stopping) return;
  stopping = true;
  child.kill('SIGTERM');
  setTimeout(() => child.kill('SIGKILL'), 10000).unref();
};
process.on('SIGTERM', terminate);
process.on('SIGINT', terminate);
child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on('exit', (code) => process.exit(code ?? (stopping ? 0 : 1)));
