package com.wealthmesh.testsupport;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import tools.jackson.databind.ObjectMapper;

/** A bounded file protocol lets Playwright control only this fixture's synthetic database. */
public final class E2eFixture {
    private static final ObjectMapper JSON = new ObjectMapper();

    private E2eFixture() {
    }

    public static void main(String[] args) throws Exception {
        requireArguments(args);
        Path directory = validateDirectory(Path.of(args[0]));
        int backendPort = Integer.parseInt(args[1]);
        long fixturePid = ProcessHandle.current().pid();
        writeJson(directory.resolve("owner.json"), Map.of("pid", fixturePid));
        try (BackendFixture fixture = new BackendFixture()) {
            Runtime.getRuntime().addShutdownHook(new Thread(fixture::close, "wm-e2e-cleanup"));
            fixture.start(backendPort);
            String cleanupId = ContainerBindings.verifyDatabaseAndCleanupHelper(fixture.database().getContainerId());
            writeJson(directory.resolve("owner.json"), Map.of(
                    "pid", fixturePid,
                    "containerId", fixture.database().getContainerId(),
                    "cleanupContainerId", cleanupId));
            if (Boolean.getBoolean("wealthmesh.fixtureStartupFailure")) {
                throw new IllegalStateException("Controlled test fixture startup failure");
            }
            writeJson(directory.resolve("ready.json"), Map.of(
                    "backendUrl", fixture.backendUrl(),
                    "pid", fixturePid,
                    "containerId", fixture.database().getContainerId(),
                    "cleanupContainerId", cleanupId,
                    "databaseHost", "127.0.0.1",
                    "databasePort", fixture.database().getMappedPort(5432),
                    "databaseName", fixture.database().getDatabaseName()));
            serveCommands(directory, fixture);
        }
    }

    private static void requireArguments(String[] args) {
        if (args.length != 2 || args[0].isBlank()) {
            throw new IllegalArgumentException("Explicit fixture directory and backend port are required");
        }
    }

    private static Path validateDirectory(Path directory) throws Exception {
        if (!directory.isAbsolute() || Files.isSymbolicLink(directory) || directory.getParent() == null) {
            throw new IllegalArgumentException("Fixture directory must be a dedicated absolute nonsymlink path");
        }
        if (Files.exists(directory.resolve("ready.json")) || Files.exists(directory.resolve("owner.json"))) {
            throw new IllegalStateException("Fixture directory already belongs to a run");
        }
        Files.createDirectories(directory.resolve("commands"));
        Files.createDirectories(directory.resolve("responses"));
        return directory;
    }

    private static void serveCommands(Path directory, BackendFixture fixture) throws Exception {
        Instant deadline = Instant.now().plus(Duration.ofMinutes(10));
        boolean running = true;
        while (running && Instant.now().isBefore(deadline)) {
            running = processPendingCommands(directory, fixture);
            Thread.sleep(100);
        }
        if (running) {
            throw new IllegalStateException("Fixture maximum lifetime expired");
        }
    }

    private static boolean processPendingCommands(Path directory, BackendFixture fixture) throws Exception {
        try (var files = Files.list(directory.resolve("commands"))) {
            var requests = files.filter(path -> path.getFileName().toString()
                    .matches("[A-Za-z0-9_-]+\\.json")).sorted().toList();
            for (Path request : requests) {
                if (!handleRequest(directory, fixture, request)) {
                    return false;
                }
            }
        }
        return true;
    }

    private static boolean handleRequest(Path directory, BackendFixture fixture, Path request) throws Exception {
        Path response = directory.resolve("responses").resolve(request.getFileName());
        try {
            if (Files.isSymbolicLink(request)) {
                throw new IllegalArgumentException("Command symlinks are disallowed");
            }
            String command = JSON.readTree(Files.readString(request)).path("command").asString();
            boolean running = applyCommand(fixture, command);
            writeJson(response, Map.of("ok", true, "command", command));
            return running;
        } catch (RuntimeException failure) {
            writeJson(response, Map.of("ok", false, "error", failure.getClass().getSimpleName()));
            return true;
        } finally {
            Files.delete(request);
        }
    }

    private static boolean applyCommand(BackendFixture fixture, String command) {
        switch (command) {
            case "version2" -> fixture.jdbc().update(
                    "UPDATE installation_metadata SET value = ? WHERE key = ?", "2", "setup_version");
            case "missing" -> fixture.jdbc().update(
                    "DELETE FROM installation_metadata WHERE key = ?", "setup_version");
            case "restore" -> fixture.jdbc().update("INSERT INTO installation_metadata(key, value) VALUES (?, ?) "
                    + "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", "setup_version", "1");
            case "financeReset" -> fixture.financeReset();
            case "databaseStop" -> fixture.database().stop();
            case "stop" -> {
                return false;
            }
            default -> throw new IllegalArgumentException("Unknown fixture command");
        }
        return true;
    }

    private static void writeJson(Path target, Map<String, ?> value) throws Exception {
        Path temporary = target.resolveSibling(target.getFileName() + ".tmp");
        Files.writeString(temporary, JSON.writeValueAsString(value));
        Files.move(temporary, target, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
    }
}
