package com.wealthmesh.system;

import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class InstallationMetadataRepository {
    private final JdbcTemplate jdbc;

    public InstallationMetadataRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Optional<String> findSetupVersion() {
        return jdbc.query("SELECT value FROM installation_metadata WHERE key = ?",
                (row, number) -> row.getString("value"), "setup_version").stream().findFirst();
    }
}
