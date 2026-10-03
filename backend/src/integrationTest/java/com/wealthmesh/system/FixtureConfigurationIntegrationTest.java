package com.wealthmesh.system;

import static org.assertj.core.api.Assertions.assertThat;

import com.wealthmesh.testsupport.BackendFixture;
import java.util.LinkedHashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;

class FixtureConfigurationIntegrationTest {
    @Test
    void staleSpringPropertiesCannotRedirectFixtureMigrationBindingOrConfiguration() throws Exception {
        Map<String, String> hostile = Map.of(
                "spring.datasource.url", "jdbc:postgresql://127.0.0.1:1/synthetic_unowned",
                "spring.flyway.url", "jdbc:postgresql://127.0.0.1:1/synthetic_unowned_migration",
                "spring.flyway.user", "synthetic_unowned_user",
                "server.address", "0.0.0.0",
                "spring.config.location", "file:/synthetic-nonexistent-configuration.yaml",
                "spring.config.import", "file:/synthetic-nonexistent-import.yaml");
        Map<String, String> previous = installProperties(hostile);
        try (BackendFixture fixture = new BackendFixture()) {
            fixture.start(0);

            assertThat(fixture.status().statusCode()).isEqualTo(200);
            assertThat(fixture.effectiveServerAddress()).isEqualTo("127.0.0.1");
            assertThat(fixture.flywayUsesOwnedDataSource()).isTrue();
            assertThat(fixture.effectiveDatabaseUrl()).isEqualTo(fixture.database().getJdbcUrl());
        } finally {
            restoreProperties(previous);
        }
    }

    private static Map<String, String> installProperties(Map<String, String> overrides) {
        Map<String, String> previous = new LinkedHashMap<>();
        overrides.forEach((key, value) -> previous.put(key, System.setProperty(key, value)));
        return previous;
    }

    private static void restoreProperties(Map<String, String> previous) {
        previous.forEach((key, value) -> {
            if (value == null) {
                System.clearProperty(key);
            } else {
                System.setProperty(key, value);
            }
        });
    }
}
