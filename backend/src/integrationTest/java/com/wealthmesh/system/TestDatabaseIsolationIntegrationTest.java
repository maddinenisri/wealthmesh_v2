package com.wealthmesh.system;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.wealthmesh.testsupport.DisposablePostgres;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;

class TestDatabaseIsolationIntegrationTest {
    @Test
    void absentExplicitTestImageConfigurationFailsBeforeConnectingOrWriting() {
        String configured = System.getProperty("wealthmesh.imageFile");
        System.clearProperty("wealthmesh.imageFile");
        try {
            assertThatThrownBy(DisposablePostgres::create).isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Explicit test");
        } finally {
            System.setProperty("wealthmesh.imageFile", configured);
        }
    }

    @Test
    void unpinnedImageConfigurationIsRejectedBeforeConnectingOrWriting() throws Exception {
        String configured = System.getProperty("wealthmesh.imageFile");
        Path invalid = Files.createTempFile("wm-setup-invalid-image-", ".txt");
        Files.writeString(invalid, "postgres:latest");
        System.setProperty("wealthmesh.imageFile", invalid.toString());
        try {
            assertThatThrownBy(DisposablePostgres::create).isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("pin PostgreSQL 17");
        } finally {
            System.setProperty("wealthmesh.imageFile", configured);
            Files.delete(invalid);
        }
    }

    @Test
    void imageComesFromTheSharedNonsecretRecordAndIdentityIsTestOwned() throws Exception {
        try (var database = DisposablePostgres.create()) {
            String expected = Files.readString(Path.of(System.getProperty("wealthmesh.imageFile"))).strip();
            assertThat(database.getDockerImageName()).isEqualTo(expected);
            assertThat(database.getDatabaseName()).startsWith("wm_test_");
            assertThat(database.getUsername()).isEqualTo("wm_synthetic_test");
            assertThat(database.isShouldBeReused()).isFalse();
        }
    }
}
