package com.wealthmesh.system;

import org.springframework.stereotype.Service;

@Service
public class SystemStatusService {
    private final InstallationMetadataRepository metadata;

    public SystemStatusService(InstallationMetadataRepository metadata) {
        this.metadata = metadata;
    }

    public SystemStatus readStatus() {
        String version = metadata.findSetupVersion().orElseThrow(MetadataMissingException::new);
        return new SystemStatus("ready", version);
    }
}
