// Spring and JVM option sources can override owned datasource and binding boundaries.
const conflicting =
  /^(SPRING_|SERVER_|JAVA_TOOL_OPTIONS$|JDK_JAVA_OPTIONS$|_JAVA_OPTIONS$|JAVA_OPTS$|GRADLE_OPTS$|CLASSPATH$)/;
export function sanitizeJavaEnvironment(source) {
  return Object.fromEntries(Object.entries(source).filter(([name]) => !conflicting.test(name)));
}
