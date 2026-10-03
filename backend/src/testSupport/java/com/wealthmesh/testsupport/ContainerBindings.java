package com.wealthmesh.testsupport;

import com.github.dockerjava.api.model.Ports;
import java.util.Arrays;
import org.testcontainers.DockerClientFactory;

public final class ContainerBindings {
    private ContainerBindings() {
    }

    public static String verifyDatabaseAndCleanupHelper(String databaseId) {
        verifyLoopback(databaseId);
        String cleanupId = DockerClientFactory.instance().client().listContainersCmd().exec().stream()
                .filter(container -> Arrays.stream(container.getNames()).anyMatch(name -> name.equals(
                        "/testcontainers-ryuk-" + DockerClientFactory.SESSION_ID)))
                .findFirst().orElseThrow(() -> new IllegalStateException("Required cleanup helper not found")).getId();
        verifyLoopback(cleanupId);
        return cleanupId;
    }

    private static void verifyLoopback(String containerId) {
        var bindings = DockerClientFactory.instance().client().inspectContainerCmd(containerId).exec()
                .getNetworkSettings().getPorts().getBindings();
        if (bindings.isEmpty()) {
            throw new IllegalStateException("Expected published test container ports");
        }
        bindings.values().forEach(values -> Arrays.stream(values).forEach(ContainerBindings::verifyBinding));
    }

    private static void verifyBinding(Ports.Binding binding) {
        if (!"127.0.0.1".equals(binding.getHostIp()) || Integer.parseInt(binding.getHostPortSpec()) <= 0) {
            throw new IllegalStateException("Test container port is not published on ephemeral loopback");
        }
    }
}
