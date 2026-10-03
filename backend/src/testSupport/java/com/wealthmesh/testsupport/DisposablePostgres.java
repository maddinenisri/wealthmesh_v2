package com.wealthmesh.testsupport;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.UUID;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

public final class DisposablePostgres {
    private DisposablePostgres() {
    }

    public static PostgreSQLContainer create() throws IOException {
        String record = System.getProperty("wealthmesh.imageFile");
        if (record == null) {
            throw new IllegalStateException("Explicit test PostgreSQL image record is required");
        }
        String image = Files.readString(Path.of(record)).strip();
        if (!image.matches("postgres:17\\.\\d+@sha256:[a-f0-9]{64}")) {
            throw new IllegalStateException("Test image must pin PostgreSQL 17 patch and digest");
        }
        return new PostgreSQLContainer(DockerImageName.parse(image).asCompatibleSubstituteFor("postgres"))
                .withDatabaseName("wm_test_" + UUID.randomUUID().toString().replace("-", ""))
                .withUsername("wm_synthetic_test")
                .withPassword(UUID.randomUUID().toString())
                .withReuse(false)
                .withStartupTimeout(Duration.ofSeconds(90));
    }
}
