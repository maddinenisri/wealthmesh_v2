package com.wealthmesh.system;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.wealthmesh.testsupport.E2eFixture;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.testcontainers.DockerClientFactory;
import tools.jackson.databind.ObjectMapper;

class FixtureResourceIdentityIntegrationTest {
    @Test
    void controlledStartupFailurePublishesExactResourceIdentitiesBeforeClosingOwnedDatabase() throws Exception {
        Path directory = Files.createTempDirectory("wm-fixture-identity-").toRealPath();
        String previous = System.setProperty("wealthmesh.fixtureStartupFailure", "true");
        try {
            assertThatThrownBy(() -> E2eFixture.main(new String[]{directory.toString(), "0"}))
                    .isInstanceOf(IllegalStateException.class).hasMessage("Controlled test fixture startup failure");
            var owner = new ObjectMapper().readTree(Files.readString(directory.resolve("owner.json")));

            assertThat(owner.path("pid").asLong()).isEqualTo(ProcessHandle.current().pid());
            assertThat(owner.path("containerId").asString()).matches("[a-f0-9]{64}");
            assertThat(owner.path("cleanupContainerId").asString()).matches("[a-f0-9]{64}");
            assertThat(DockerClientFactory.instance().client()
                    .inspectContainerCmd(owner.path("cleanupContainerId").asString()).exec().getName())
                    .isEqualTo("/testcontainers-ryuk-" + DockerClientFactory.SESSION_ID);
            assertThat(directory.resolve("ready.json")).doesNotExist();
            assertThat(DockerClientFactory.instance().client().listContainersCmd().withShowAll(true)
                    .withIdFilter(List.of(owner.path("containerId").asString())).exec()).isEmpty();
        } finally {
            if (previous == null) {
                System.clearProperty("wealthmesh.fixtureStartupFailure");
            } else {
                System.setProperty("wealthmesh.fixtureStartupFailure", previous);
            }
        }
    }
}
