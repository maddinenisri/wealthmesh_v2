package com.wealthmesh.testsupport;

import com.wealthmesh.WealthMeshApplication;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.web.server.context.WebServerApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.testcontainers.postgresql.PostgreSQLContainer;

/** The application and its disposable database belong to this one test invocation. */
public final class BackendFixture implements AutoCloseable {
    private final PostgreSQLContainer database;
    private ConfigurableApplicationContext application;

    public BackendFixture() throws IOException {
        database = DisposablePostgres.create();
    }

    public void start(int port) {
        database.start();
        SpringApplication launcher = new SpringApplication(WealthMeshApplication.class);
        launcher.setEnvironment(ownedEnvironment(port));
        application = launcher.run();
    }

    private StandardEnvironment ownedEnvironment(int port) {
        StandardEnvironment environment = new StandardEnvironment();
        environment.getPropertySources().remove(StandardEnvironment.SYSTEM_PROPERTIES_PROPERTY_SOURCE_NAME);
        environment.getPropertySources().remove(StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME);
        environment.getPropertySources().addFirst(new MapPropertySource("owned-fixture", Map.of(
                "spring.config.location", "classpath:/application.yaml",
                "server.address", "127.0.0.1",
                "server.port", port,
                "spring.datasource.url", database.getJdbcUrl(),
                "spring.datasource.username", database.getUsername(),
                "spring.datasource.password", database.getPassword(),
                "spring.main.banner-mode", "off")));
        return environment;
    }

    public PostgreSQLContainer database() {
        return database;
    }

    public JdbcTemplate jdbc() {
        return application.getBean(JdbcTemplate.class);
    }

    public String effectiveServerAddress() {
        return application.getEnvironment().getProperty("server.address");
    }

    public String effectiveDatabaseUrl() {
        return application.getEnvironment().getProperty("spring.datasource.url");
    }

    public boolean flywayUsesOwnedDataSource() {
        return application.getBean(Flyway.class).getConfiguration().getDataSource()
                == application.getBean(DataSource.class);
    }

    public String backendUrl() {
        int port = ((WebServerApplicationContext) application).getWebServer().getPort();
        return "http://127.0.0.1:" + port;
    }

    public HttpResponse<String> status() throws IOException, InterruptedException {
        try (HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build()) {
            return client.send(HttpRequest.newBuilder(URI.create(backendUrl() + "/api/system/status"))
                    .timeout(Duration.ofSeconds(8)).GET().build(), HttpResponse.BodyHandlers.ofString());
        }
    }

    @Override
    public synchronized void close() {
        if (application != null) {
            application.close();
            application = null;
        }
        database.close();
    }
}
