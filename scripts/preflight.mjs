import { command } from './commands.mjs';
import { javaEnvironment } from './paths.mjs';

export async function preflight({ database = true, backend = true } = {}) {
  if (Number(process.versions.node.split('.')[0]) !== 26)
    throw new Error('Node 26 is required; use the project .node-version.');
  const npmVersion = await command('npm', ['--version'], { capture: true });
  if (!npmVersion.startsWith('11.'))
    throw new Error('npm 11 is required. The lockfile was generated with npm 11.17.0.');
  console.log(`Node ${process.versions.node}; npm ${npmVersion}`);
  if (backend) {
    const env = await javaEnvironment();
    const version = await command(`${env.JAVA_HOME}/bin/java`, ['--version'], {
      env,
      capture: true,
    });
    if (!/25\./.test(version))
      throw new Error(
        'The project-local runtime must be Java 25. Run bash backend/install-java.sh.',
      );
    console.log(version.split('\n')[0]);
  }
  if (database) {
    await command('docker', ['version', '--format', '{{.Server.Version}}'], {
      capture: true,
    }).catch(() => {
      throw new Error(
        'Docker daemon unavailable. Start Docker Desktop and allow Docker socket access.',
      );
    });
    console.log(
      `Docker Compose ${await command('docker', ['compose', 'version', '--short'], { capture: true })}`,
    );
  }
}
