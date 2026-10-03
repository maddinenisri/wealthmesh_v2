package com.wealthmesh.system;

import static org.assertj.core.api.Assertions.assertThat;

import com.github.dockerjava.api.model.Container;
import com.github.dockerjava.api.model.Ports;
import com.wealthmesh.testsupport.BackendFixture;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.Map;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.testcontainers.DockerClientFactory;

class SystemStatusIntegrationTest {
    private static BackendFixture fixture;

    @BeforeAll
    static void startIsolatedRealSystem() throws Exception {
        fixture = new BackendFixture();
        fixture.start(0);
    }

    @AfterAll
    static void stopOwnedResources() {
        if (fixture != null) {
            fixture.close();
        }
    }

    @BeforeEach
    void restoreOnlySyntheticMetadata() {
        fixture.jdbc().update("INSERT INTO installation_metadata(key, value) VALUES (?, ?) "
                + "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", "setup_version", "1");
    }

    @Test
    void migrationHistoryIsNotReappliedAndChangedDataIsPreserved() throws Exception {
        JdbcTemplate jdbc = fixture.jdbc();
        String installedOn = jdbc.queryForObject("SELECT installed_on::text FROM flyway_schema_history "
                + "WHERE version = '1'", String.class);
        jdbc.update("UPDATE installation_metadata SET value = ? WHERE key = ?", "2", "setup_version");
        Flyway flyway = Flyway.configure().dataSource(fixture.database().getJdbcUrl(),
                fixture.database().getUsername(), fixture.database().getPassword()).load();

        assertThat(flyway.migrate().migrationsExecuted).isZero();
        assertThat(jdbc.queryForObject("SELECT count(*) FROM flyway_schema_history WHERE success", Integer.class))
                .isEqualTo(1);
        assertThat(jdbc.queryForObject("SELECT installed_on::text FROM flyway_schema_history "
                + "WHERE version = '1'", String.class)).isEqualTo(installedOn);
        assertThat(fixture.status().body()).contains("\"installationVersion\":\"2\"");
    }

    @Test
    void returnsTheStoredVersionThroughTheRealHttpServer() throws Exception {
        HttpResponse<String> initial = fixture.status();
        assertThat(initial.statusCode()).isEqualTo(200);
        assertThat(initial.body()).isEqualTo("{\"status\":\"ready\",\"installationVersion\":\"1\"}");
        fixture.jdbc().update("UPDATE installation_metadata SET value = ? WHERE key = ?", "2", "setup_version");

        assertThat(fixture.status().body()).isEqualTo("{\"status\":\"ready\",\"installationVersion\":\"2\"}");
    }

    @Test
    void missingMetadataIsUnavailableAndGetDoesNotRepairIt() throws Exception {
        fixture.jdbc().update("DELETE FROM installation_metadata WHERE key = ?", "setup_version");

        assertUnavailable(fixture.status());
        assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM installation_metadata", Integer.class)).isZero();
    }

    @Test
    void databaseQueryFailureIsUnavailableWithoutLeakingDetails() throws Exception {
        fixture.jdbc().execute("ALTER TABLE installation_metadata RENAME TO temporarily_hidden_metadata");
        try {
            assertUnavailable(fixture.status());
        } finally {
            fixture.jdbc().execute("ALTER TABLE temporarily_hidden_metadata RENAME TO installation_metadata");
        }
    }

    @Test
    void databaseAndCleanupHelperPublishOnlyLoopbackPorts() {
        assertLoopback(fixture.database().getContainerId());
        var client = DockerClientFactory.instance().client();
        Container ryuk = client.listContainersCmd().exec().stream()
                .filter(container -> Arrays.stream(container.getNames()).anyMatch(name -> name.equals(
                        "/testcontainers-ryuk-" + DockerClientFactory.SESSION_ID)))
                .findFirst().orElseThrow();

        assertLoopback(ryuk.getId());
        assertThat(fixture.database().getDatabaseName()).startsWith("wm_test_");
        assertThat(fixture.database().isShouldBeReused()).isFalse();
    }

    @Test
    void databaseConnectionFailureHasABoundedSafeResponse() throws Exception {
        try (BackendFixture stoppedDatabase = new BackendFixture()) {
            stoppedDatabase.start(0);
            stoppedDatabase.database().stop();
            Instant started = Instant.now();

            assertUnavailable(stoppedDatabase.status());
            assertThat(Duration.between(started, Instant.now())).isLessThan(Duration.ofSeconds(8));
        }
    }

    private static void assertUnavailable(HttpResponse<String> response) {
        assertThat(response.statusCode()).isEqualTo(503);
        assertThat(response.body()).isEqualTo("{\"code\":\"SYSTEM_UNAVAILABLE\","
                + "\"message\":\"Setup status is unavailable.\"}");
    }

    private static void assertLoopback(String containerId) {
        Map<com.github.dockerjava.api.model.ExposedPort, Ports.Binding[]> bindings =
                DockerClientFactory.instance().client().inspectContainerCmd(containerId).exec()
                        .getNetworkSettings().getPorts().getBindings();
        assertThat(bindings).isNotEmpty();
        bindings.values().forEach(values -> assertThat(values).allSatisfy(binding -> {
            assertThat(binding.getHostIp()).isEqualTo("127.0.0.1");
            assertThat(Integer.parseInt(binding.getHostPortSpec())).isPositive();
        }));
    }
}
