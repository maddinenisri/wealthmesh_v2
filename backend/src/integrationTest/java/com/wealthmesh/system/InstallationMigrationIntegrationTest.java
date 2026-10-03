package com.wealthmesh.system;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.wealthmesh.testsupport.BackendFixture;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;

class InstallationMigrationIntegrationTest {
    @Test
    void freshDatabaseHasExactlyOneSeedRowAndSuccessfulMigration() throws Exception {
        try (BackendFixture fixture = new BackendFixture()) {
            fixture.start(0);

            assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM installation_metadata", Integer.class))
                    .isEqualTo(1);
            assertThat(fixture.jdbc().queryForObject("SELECT value FROM installation_metadata WHERE key = ?",
                    String.class, "setup_version")).isEqualTo("1");
            assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM flyway_schema_history "
                    + "WHERE success AND version IN ('1', '2')",
                    Integer.class)).isEqualTo(2);
            assertThatThrownBy(() -> fixture.jdbc().update(
                    "INSERT INTO installation_metadata(key, value) VALUES (?, ?)", "setup_version", "2"))
                    .isInstanceOf(DuplicateKeyException.class);
            assertThatThrownBy(() -> fixture.jdbc().update(
                    "INSERT INTO installation_metadata(key, value) VALUES (?, ?)", "synthetic_null", null))
                    .isInstanceOf(DataIntegrityViolationException.class);
        }
    }
}
