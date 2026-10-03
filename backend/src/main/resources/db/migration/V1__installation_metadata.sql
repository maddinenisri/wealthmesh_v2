CREATE TABLE installation_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

INSERT INTO installation_metadata(key, value) VALUES ('setup_version', '1');
