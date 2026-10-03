package com.wealthmesh.testsupport;

import com.github.dockerjava.api.command.CreateContainerCmd;
import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.Ports;
import org.testcontainers.core.CreateContainerCmdModifier;

/** Keeps every published test container port, including Ryuk, on loopback. */
public class LoopbackContainerModifier implements CreateContainerCmdModifier {
    @Override
    public CreateContainerCmd modify(CreateContainerCmd command) {
        Ports bindings = new Ports();
        for (ExposedPort port : command.getExposedPorts()) {
            bindings.bind(port, Ports.Binding.bindIp("127.0.0.1"));
        }
        command.getHostConfig().withPublishAllPorts(false).withPortBindings(bindings);
        return command;
    }
}
