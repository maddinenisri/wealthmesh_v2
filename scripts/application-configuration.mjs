export function backendArguments(jarPath) {
  return [
    '-jar',
    jarPath,
    '--spring.config.location=classpath:/application.yaml',
    '--server.address=127.0.0.1',
  ];
}
