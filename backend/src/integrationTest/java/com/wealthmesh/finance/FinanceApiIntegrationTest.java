package com.wealthmesh.finance;

import static org.assertj.core.api.Assertions.assertThat;

import com.wealthmesh.testsupport.BackendFixture;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

class FinanceApiIntegrationTest {
    private static BackendFixture fixture;
    private static final JsonMapper JSON = JsonMapper.builder().build();
    private static final String MAYA = "11111111-1111-4111-8111-111111111111";
    private static final String SAM = "22222222-2222-4222-8222-222222222222";

    @BeforeAll
    static void start() throws Exception {
        fixture = new BackendFixture();
        fixture.start(0);
    }

    @AfterAll
    static void stop() {
        if (fixture != null) {
            fixture.close();
        }
    }

    @BeforeEach
    void clearDisposableFinanceOnlyIfMigrationExists() {
        String table = fixture.jdbc().queryForObject("SELECT to_regclass('household')::text", String.class);
        if (table != null) {
            fixture.jdbc().update("DELETE FROM checking_account_owner");
            fixture.jdbc().update("DELETE FROM checking_account");
            fixture.jdbc().update("DELETE FROM household_member");
            fixture.jdbc().update("DELETE FROM household");
        }
    }

    @Test
    void jointCheckingPersistsOnceAndTextCorrectionsNeverMoveMoney() throws Exception {
        assertThat(request("GET", "/api/household", null).statusCode()).isEqualTo(200);
        seedMembers();
        String accountId = UUID.randomUUID().toString();
        JsonNode account = body(request("POST", "/api/accounts/checking", account(accountId, "$5,000.00")));
        assertThat(account.get("balance").asString()).isEqualTo("5000.00");
        assertThat(account.get("owners").size()).isEqualTo(2);
        JsonNode overview = body(request("GET", "/api/household", null));
        assertThat(overview.get("accounts").size()).isEqualTo(1);
        assertThat(overview.get("checkingTotal").get("amount").asString()).isEqualTo("5000.00");
        request("PUT", "/api/household", Map.of("name", "Our Household"));
        request("PUT", "/api/household/members/" + MAYA, Map.of("name", "Maya Patel"));
        JsonNode corrected = body(request("GET", "/api/accounts/" + accountId, null));
        assertThat(corrected.get("owners").get(0).get("id").asString()).isEqualTo(MAYA);
        assertThat(corrected.get("owners").get(0).get("name").asString()).isEqualTo("Maya Patel");
        request("PUT", "/api/accounts/" + accountId + "/details", Map.of(
                "name", "Household Checking", "bank", "Harbor Credit Union", "ownerIds", List.of(SAM)));
        JsonNode edited = body(request("GET", "/api/accounts/" + accountId, null));
        assertThat(edited.get("owners").size()).isEqualTo(1);
        assertThat(edited.get("balance").asString()).isEqualTo("5000.00");
        assertThat(edited.get("balanceDate").asString()).isEqualTo("2026-09-01");
        assertThat(edited.get("name").asString()).isEqualTo("Household Checking");
        assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM installation_metadata", Integer.class))
                .isEqualTo(1);
    }

    @Test
    void createRetriesAndDuplicateLabelsProtectIdentity() throws Exception {
        seedMembers();
        Map<String, Object> member = Map.of("id", UUID.randomUUID().toString(), "name", " sam ", "label", "Parent");
        assertThat(request("POST", "/api/household/members", member).statusCode()).isEqualTo(201);
        assertThat(request("POST", "/api/household/members", member).statusCode()).isEqualTo(200);
        assertThat(request("POST", "/api/household/members", Map.of("id", UUID.randomUUID().toString(),
                "name", "SAM", "label", " parent ")).statusCode()).isEqualTo(409);
        String id = UUID.randomUUID().toString();
        assertThat(request("POST", "/api/accounts/checking", account(id, "-125.50")).statusCode()).isEqualTo(201);
        assertThat(request("POST", "/api/accounts/checking", account(id, "-$125.50")).statusCode()).isEqualTo(200);
        assertThat(request("POST", "/api/accounts/checking", account(id, "-125.51")).statusCode()).isEqualTo(409);
        assertThat(body(request("GET", "/api/household", null)).get("checkingTotal").get("amount").asString())
                .isEqualTo("-125.50");
    }

    @Test
    void invalidCommandsRejectUnknownTypesAndPreserveSavedState() throws Exception {
        seedMembers();
        var invalid = new java.util.HashMap<>(account(UUID.randomUUID().toString(), "1.000"));
        HttpResponse<String> precision = request("POST", "/api/accounts/checking", invalid);
        assertThat(precision.statusCode()).isEqualTo(400);
        assertThat(body(precision).get("fieldErrors").get("openingAmount").asString())
                .isEqualTo("Enter a valid amount");
        assertThat(precision.headers().firstValue("X-Request-Id")).isPresent();
        invalid.put("openingAmount", 5000);
        assertThat(request("POST", "/api/accounts/checking", invalid).statusCode()).isEqualTo(400);
        invalid.put("openingAmount", "5000");
        invalid.put("ownerIds", List.of(MAYA, MAYA));
        assertThat(request("POST", "/api/accounts/checking", invalid).statusCode()).isEqualTo(400);
        invalid.put("ownerIds", List.of(UUID.randomUUID().toString()));
        assertThat(request("POST", "/api/accounts/checking", invalid).statusCode()).isEqualTo(400);
        invalid.put("ownerIds", List.of(MAYA));
        invalid.put("balanceDate", "9999-12-31");
        assertThat(request("POST", "/api/accounts/checking", invalid).statusCode()).isEqualTo(400);
        assertThat(body(request("GET", "/api/household", null)).get("accounts").size()).isZero();
        String id = UUID.randomUUID().toString();
        request("POST", "/api/accounts/checking", account(id, "0.00"));
        assertThat(request("PUT", "/api/accounts/" + id + "/details", Map.of(
                "name", "Changed", "bank", "", "ownerIds", List.of(MAYA), "balance", "1.00"))
                .statusCode()).isEqualTo(400);
        assertThat(body(request("GET", "/api/accounts/" + id, null)).get("name").asString())
                .isEqualTo("Everyday Checking");
    }

    @Test
    void financeResetPreservesSchemaMetadataAndRollsBackFailures() throws Exception {
        seedMembers();
        String id = UUID.randomUUID().toString();
        request("POST", "/api/accounts/checking", account(id, "5000"));
        installOwnerFailure("checking_account", "DELETE");
        try {
            org.assertj.core.api.Assertions.assertThatThrownBy(fixture::financeReset)
                    .isInstanceOf(RuntimeException.class);
            assertThat(body(request("GET", "/api/accounts/" + id, null)).get("owners").size()).isEqualTo(2);
        } finally {
            removeOwnerFailure("checking_account");
        }
        fixture.financeReset();
        assertThat(body(request("GET", "/api/household", null)).get("household").isNull()).isTrue();
        assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM installation_metadata", Integer.class))
                .isEqualTo(1);
        assertThat(fixture.jdbc().queryForList("SELECT version FROM flyway_schema_history WHERE success", String.class))
                .containsExactly("1", "2");
    }

    @Test
    void ownerInsertAndReplacementFailuresRollBackEveryFinancialMutation() throws Exception {
        seedMembers();
        installOwnerFailure("checking_account_owner", "INSERT");
        String id = UUID.randomUUID().toString();
        try {
            assertThat(request("POST", "/api/accounts/checking", account(id, "5000")).statusCode()).isEqualTo(503);
            assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM checking_account", Integer.class)).isZero();
        } finally {
            removeOwnerFailure("checking_account_owner");
        }
        request("POST", "/api/accounts/checking", account(id, "5000"));
        installOwnerFailure("checking_account_owner", "INSERT");
        try {
            assertThat(request("PUT", "/api/accounts/" + id + "/details", Map.of(
                    "name", "Changed", "bank", "Other", "ownerIds", List.of(MAYA))).statusCode()).isEqualTo(503);
            JsonNode saved = body(request("GET", "/api/accounts/" + id, null));
            assertThat(saved.get("name").asString()).isEqualTo("Everyday Checking");
            assertThat(saved.get("owners").size()).isEqualTo(2);
            assertThat(saved.get("balance").asString()).isEqualTo("5000.00");
        } finally {
            removeOwnerFailure("checking_account_owner");
        }
    }

    @Test
    void resetRejectsAChangedDatasourceBeforeConnectingOrDeleting() throws Exception {
        seedMembers();
        javax.sql.DataSource original = fixture.jdbc().getDataSource();
        try {
            fixture.jdbc().setDataSource(new org.springframework.jdbc.datasource.DriverManagerDataSource(
                    "jdbc:postgresql://127.0.0.1:1/synthetic_unowned"));
            org.assertj.core.api.Assertions.assertThatThrownBy(fixture::financeReset)
                    .isInstanceOf(IllegalStateException.class).hasMessageContaining("owned disposable");
        } finally {
            fixture.jdbc().setDataSource(original);
        }
        assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM household", Integer.class)).isEqualTo(1);
    }

    @Test
    void concurrentCreatesConvergeAndLaterDetailsReplaceTheCompleteOwnerSet() throws Exception {
        seedMembers();
        String id = UUID.randomUUID().toString();
        try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
            var first = executor.submit(() -> request("POST", "/api/accounts/checking", account(id, "5000")));
            var second = executor.submit(() -> request("POST", "/api/accounts/checking", account(id, "5000")));
            assertThat(List.of(first.get().statusCode(), second.get().statusCode()))
                    .containsExactlyInAnyOrder(201, 200);
        }
        request("PUT", "/api/accounts/" + id + "/details", Map.of(
                "name", "First tab", "bank", "First bank", "ownerIds", List.of(MAYA)));
        request("PUT", "/api/accounts/" + id + "/details", Map.of(
                "name", "Second tab", "bank", "Second bank", "ownerIds", List.of(SAM)));
        JsonNode saved = body(request("GET", "/api/accounts/" + id, null));
        assertThat(saved.get("name").asString()).isEqualTo("Second tab");
        assertThat(saved.get("owners").size()).isEqualTo(1);
        assertThat(saved.get("owners").get(0).get("id").asString()).isEqualTo(SAM);
        assertThat(saved.get("balance").asString()).isEqualTo("5000.00");
        assertThat(saved.get("balanceDate").asString()).isEqualTo("2026-09-01");
    }

    @Test
    void memberPairCorrectionsAndBlankZeroCentsTotalsRemainExact() throws Exception {
        seedMembers();
        assertThat(request("PUT", "/api/household/members/" + SAM, Map.of("name", "maya"))
                .statusCode()).isEqualTo(409);
        assertThat(request("PUT", "/api/household/members/" + SAM, Map.of("name", "Maya", "label", "Child"))
                .statusCode()).isEqualTo(200);
        assertThat(request("PUT", "/api/household/members/" + SAM, Map.of("name", "Maya", "label", ""))
                .statusCode()).isEqualTo(409);
        for (String amount : List.of("", "$0.00", "0.10", "0.20", "999999999999.99", "999999999999.99")) {
            var saved = request("POST", "/api/accounts/checking", account(UUID.randomUUID().toString(), amount));
            assertThat(saved.statusCode()).isEqualTo(201);
        }
        JsonNode overview = body(request("GET", "/api/household", null));
        assertThat(overview.get("accounts").size()).isEqualTo(6);
        assertThat(overview.get("checkingTotal").get("amount").asString()).isEqualTo("2000000000000.28");
        assertThat(fixture.jdbc().queryForList("SELECT table_name FROM information_schema.tables "
                + "WHERE table_schema = 'public'", String.class)).containsExactlyInAnyOrder(
                        "flyway_schema_history", "installation_metadata", "household", "household_member",
                        "checking_account", "checking_account_owner");
    }

    @Test
    void singletonAndMemberPairConstraintsRejectConcurrentConflictingIdentities() throws Exception {
        try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
            var first = executor.submit(() -> request("POST", "/api/household", Map.of(
                    "id", UUID.randomUUID().toString(), "name", "First Household")));
            var second = executor.submit(() -> request("POST", "/api/household", Map.of(
                    "id", UUID.randomUUID().toString(), "name", "Second Household")));
            assertThat(List.of(first.get().statusCode(), second.get().statusCode()))
                    .containsExactlyInAnyOrder(201, 409);
            var memberOne = executor.submit(() -> request("POST", "/api/household/members", Map.of(
                    "id", UUID.randomUUID().toString(), "name", "Sam", "label", "Parent")));
            var memberTwo = executor.submit(() -> request("POST", "/api/household/members", Map.of(
                    "id", UUID.randomUUID().toString(), "name", " SAM ", "label", "parent")));
            assertThat(List.of(memberOne.get().statusCode(), memberTwo.get().statusCode()))
                    .containsExactlyInAnyOrder(201, 409);
        }
        assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM household", Integer.class)).isEqualTo(1);
        assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM household_member", Integer.class)).isEqualTo(1);
    }

    @Test
    void ordinaryReadsSeeCompleteAccountOwnersAndAnExactlyMatchingTotalDuringAnEdit() throws Exception {
        seedMembers();
        String id = UUID.randomUUID().toString();
        request("POST", "/api/accounts/checking", account(id, "5000"));
        fixture.jdbc().execute("CREATE FUNCTION finance_wait() RETURNS trigger LANGUAGE plpgsql AS "
                + "$$ BEGIN PERFORM pg_advisory_xact_lock(617001); RETURN NEW; END $$");
        fixture.jdbc().execute("CREATE TRIGGER finance_wait BEFORE INSERT ON checking_account_owner "
                + "FOR EACH ROW EXECUTE FUNCTION finance_wait()");
        try (var connection = fixture.jdbc().getDataSource().getConnection();
                var statement = connection.createStatement();
                var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
            statement.execute("SELECT pg_advisory_lock(617001)");
            var update = executor.submit(() -> request("PUT", "/api/accounts/" + id + "/details", Map.of(
                    "name", "Changed", "bank", "Other", "ownerIds", List.of(MAYA))));
            awaitWaitingOwnerTransaction();
            JsonNode during = body(request("GET", "/api/household", null));
            assertThat(during.get("accounts").get(0).get("name").asString()).isEqualTo("Everyday Checking");
            assertThat(during.get("accounts").get(0).get("owners").size()).isEqualTo(2);
            assertThat(during.get("checkingTotal").get("amount").asString()).isEqualTo("5000.00");
            statement.execute("SELECT pg_advisory_unlock(617001)");
            assertThat(update.get().statusCode()).isEqualTo(200);
        } finally {
            fixture.jdbc().execute("DROP TRIGGER finance_wait ON checking_account_owner");
            fixture.jdbc().execute("DROP FUNCTION finance_wait()");
        }
        JsonNode after = body(request("GET", "/api/household", null));
        assertThat(after.get("accounts").get(0).get("owners").size()).isEqualTo(1);
        assertThat(after.get("accounts").get(0).get("name").asString()).isEqualTo("Changed");
        assertThat(after.get("checkingTotal").get("amount").asString()).isEqualTo("5000.00");
    }

    private void awaitWaitingOwnerTransaction() {
        java.time.Instant deadline = java.time.Instant.now().plusSeconds(2);
        while (java.time.Instant.now().isBefore(deadline)) {
            Integer waiting = fixture.jdbc().queryForObject(
                    "SELECT count(*) FROM pg_locks WHERE locktype = 'advisory' AND NOT granted", Integer.class);
            if (waiting != null && waiting > 0) {
                return;
            }
        }
        throw new AssertionError("The controlled owner replacement did not reach its database lock");
    }

    @Test
    void assignedUuidJpaCreatesMustInsertWithoutMergingAnExistingHousehold() throws Exception {
        seedMembers();
        var saved = body(request("GET", "/api/household", null)).get("household");
        UUID id = UUID.fromString(saved.get("id").asString());
        var repository = fixture.bean(com.wealthmesh.finance.persistence.HouseholdJpaRepository.class);
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> repository.saveAndFlush(
                new com.wealthmesh.finance.persistence.HouseholdEntity(id, "Must never overwrite")))
                .isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class);
        assertThat(fixture.jdbc().queryForObject("SELECT name FROM household WHERE id = ?", String.class, id))
                .isEqualTo("Maya and Sam");
    }

    @Test
    void financeApiUsesBoundedJpaReadsAndSerializesDtosWithoutLazySql() throws Exception {
        seedMembers();
        request("POST", "/api/accounts/checking", account(UUID.randomUUID().toString(), "5000"));
        var factory = fixture.bean(jakarta.persistence.EntityManagerFactory.class)
                .unwrap(org.hibernate.SessionFactory.class);
        var statistics = factory.getStatistics();
        statistics.setStatisticsEnabled(true);
        for (int count = 0; count < 8; count++) {
            request("POST", "/api/accounts/checking", account(UUID.randomUUID().toString(), "0.10"));
        }
        statistics.clear();
        JsonNode result = body(request("GET", "/api/household", null));
        assertThat(result.get("checkingTotal").get("amount").asString()).isEqualTo("5000.80");
        assertThat(result.get("accounts").size()).isEqualTo(9);
        assertThat(statistics.getPrepareStatementCount()).isEqualTo(3L);
        assertThat(statistics.getEntityFetchCount()).isZero();
        assertThat(statistics.getCollectionFetchCount()).isZero();
        assertThat(fixture.property("spring.jpa.hibernate.ddl-auto")).isEqualTo("validate");
        assertThat(fixture.property("spring.jpa.open-in-view")).isEqualTo("false");
        assertThat(fixture.bean(org.springframework.transaction.PlatformTransactionManager.class))
                .isInstanceOf(org.springframework.orm.jpa.JpaTransactionManager.class);
        statistics.setStatisticsEnabled(false);
    }

    @Test
    void anUnexpectedOwnerlessAccountIsAnIntegrityFailureInsteadOfAnOmittedBalance() throws Exception {
        seedMembers();
        UUID householdId = fixture.jdbc().queryForObject("SELECT id FROM household", UUID.class);
        fixture.jdbc().update("INSERT INTO checking_account(id, household_id, name, opening_amount, balance_date) "
                + "VALUES (?, ?, ?, ?, DATE '2026-09-01')", UUID.randomUUID(), householdId,
                "Synthetic incomplete account", new java.math.BigDecimal("5000.00"));
        HttpResponse<String> response = request("GET", "/api/household", null);
        assertThat(response.statusCode()).isEqualTo(503);
        assertThat(JSON.readTree(response.body()).get("code").asString()).isEqualTo("FINANCE_INTEGRITY");
        assertThat(response.body()).doesNotContain("checkingTotal", "5000.00", "Synthetic incomplete account");
    }

    @Test
    void savedMoneyOwnersAndDatesSurviveANewApplicationAndPersistenceContext() throws Exception {
        seedMembers();
        String id = UUID.randomUUID().toString();
        JsonNode before = body(request("POST", "/api/accounts/checking", account(id, "5000")));
        fixture.restartApplication();
        assertThat(body(request("GET", "/api/accounts/" + id, null))).isEqualTo(before);
        assertThat(fixture.status().statusCode()).isEqualTo(200);
        assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM checking_account", Integer.class)).isEqualTo(1);
        request("GET", "/api/household", null);
        assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM checking_account", Integer.class)).isEqualTo(1);
    }

    @Test
    void incompatibleDisposableSchemaFailsHibernateValidationWithoutRepair() throws Exception {
        try (BackendFixture incompatible = new BackendFixture()) {
            incompatible.start(0);
            var database = incompatible.database();
            var direct = new org.springframework.jdbc.core.JdbcTemplate(
                    new org.springframework.jdbc.datasource.DriverManagerDataSource(
                            database.getJdbcUrl(), database.getUsername(), database.getPassword()));
            direct.execute("ALTER TABLE checking_account RENAME COLUMN bank TO incompatible_bank");
            org.assertj.core.api.Assertions.assertThatThrownBy(incompatible::restartApplication)
                    .hasRootCauseInstanceOf(org.hibernate.tool.schema.spi.SchemaManagementException.class);
            assertThat(direct.queryForList("SELECT column_name FROM information_schema.columns "
                    + "WHERE table_name = 'checking_account'", String.class))
                    .contains("incompatible_bank").doesNotContain("bank");
            assertThat(direct.queryForObject("SELECT count(*) FROM flyway_schema_history WHERE success", Integer.class))
                    .isEqualTo(2);
        }
    }

    @Test
    void databaseConstraintsPreventCrossHouseholdLinksAndDeletionOfReferencedMembers() throws Exception {
        seedMembers();
        String id = UUID.randomUUID().toString();
        request("POST", "/api/accounts/checking", account(id, "5000"));
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> fixture.jdbc().update(
                "UPDATE checking_account_owner SET household_id = ? WHERE account_id = ?",
                UUID.randomUUID(), UUID.fromString(id)))
                .isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class);
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> fixture.jdbc().update(
                "DELETE FROM household_member WHERE id = ?", UUID.fromString(MAYA)))
                .isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class);
        assertThat(body(request("GET", "/api/accounts/" + id, null)).get("owners").size()).isEqualTo(2);
    }

    @Test
    void deferredOwnerFailureAtCommitRollsBackThenAllowsANormalFreshRetry() throws Exception {
        seedMembers();
        String id = UUID.randomUUID().toString();
        fixture.jdbc().execute("CREATE FUNCTION finance_commit_fail() RETURNS trigger LANGUAGE plpgsql AS "
                + "$$ BEGIN RAISE EXCEPTION 'synthetic commit failure'; END $$");
        fixture.jdbc().execute("CREATE CONSTRAINT TRIGGER finance_commit_fail AFTER INSERT ON checking_account_owner "
                + "DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION finance_commit_fail()");
        try {
            assertThat(request("POST", "/api/accounts/checking", account(id, "5000")).statusCode()).isEqualTo(503);
            assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM checking_account", Integer.class)).isZero();
            assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM checking_account_owner", Integer.class))
                    .isZero();
        } finally {
            fixture.jdbc().execute("DROP TRIGGER finance_commit_fail ON checking_account_owner");
            fixture.jdbc().execute("DROP FUNCTION finance_commit_fail()");
        }
        assertThat(request("POST", "/api/accounts/checking", account(id, "5000")).statusCode()).isEqualTo(201);
        assertThat(request("POST", "/api/accounts/checking", account(id, "5000")).statusCode()).isEqualTo(200);
        assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM checking_account", Integer.class)).isEqualTo(1);
    }

    @Test
    void concurrentMemberCorrectionsAllowOnlyOneNormalizedPair() throws Exception {
        seedMembers();
        try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
            var first = executor.submit(() -> request("PUT", "/api/household/members/" + MAYA,
                    Map.of("name", "New Member", "label", "Parent")));
            var second = executor.submit(() -> request("PUT", "/api/household/members/" + SAM,
                    Map.of("name", "new member", "label", "parent")));
            assertThat(List.of(first.get().statusCode(), second.get().statusCode()))
                    .containsExactlyInAnyOrder(200, 409);
        }
        assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM household_member "
                + "WHERE name_key = 'new member' AND label_key = 'parent'", Integer.class)).isEqualTo(1);
        assertThat(fixture.jdbc().queryForObject("SELECT count(*) FROM household_member", Integer.class)).isEqualTo(2);
    }

    @ParameterizedTest
    @CsvSource(delimiter = '|', textBlock = """
            1582-10-10 | 5000.00 | 5000.00
            0001-01-01 | -$999,999,999,999.99 | -999999999999.99
            2000-02-29 | -0.00 | 0.00
            """)
    void gregorianDatesAndNegativeBoundariesSurviveJpaSqlAndRestart(
            String date, String inputAmount, String expectedAmount) throws Exception {
        seedMembers();
        String id = UUID.randomUUID().toString();
        var payload = new java.util.HashMap<>(account(id, inputAmount));
        payload.put("balanceDate", date);
        var created = request("POST", "/api/accounts/checking", payload);
        assertThat(created.statusCode()).isEqualTo(201);
        assertThat(body(created).get("balanceDate").asString()).isEqualTo(date);
        assertThat(body(created).get("balance").asString()).isEqualTo(expectedAmount);
        assertBoundaryRoundTrip(id, date, expectedAmount);
        fixture.restartApplication();
        assertBoundaryRoundTrip(id, date, expectedAmount);
    }

    private void assertBoundaryRoundTrip(String id, String date, String amount) throws Exception {
        var stored = fixture.jdbc().queryForMap("SELECT balance_date::text AS date, "
                + "opening_amount::text AS amount FROM checking_account WHERE id = ?", UUID.fromString(id));
        assertThat(stored.get("date")).isEqualTo(date);
        assertThat(stored.get("amount")).isEqualTo(amount);
        var detail = request("GET", "/api/accounts/" + id, null);
        assertThat(detail.statusCode()).isEqualTo(200);
        assertThat(body(detail).get("balanceDate").asString()).isEqualTo(date);
        assertThat(body(detail).get("balance").asString()).isEqualTo(amount);
        var state = body(request("GET", "/api/household", null));
        assertThat(state.get("accounts").size()).isEqualTo(1);
        assertThat(state.get("accounts").get(0).get("balanceDate").asString()).isEqualTo(date);
        assertThat(state.get("accounts").get(0).get("balance").asString()).isEqualTo(amount);
        assertThat(state.get("checkingTotal").get("amount").asString()).isEqualTo(amount);
    }

    private void installOwnerFailure(String table, String operation) {
        fixture.jdbc().execute("CREATE FUNCTION finance_test_fail() RETURNS trigger LANGUAGE plpgsql AS "
                + "$$ BEGIN RAISE EXCEPTION 'synthetic transaction failure'; END $$");
        fixture.jdbc().execute("CREATE TRIGGER finance_test_failure BEFORE " + operation + " ON " + table
                + " FOR EACH ROW EXECUTE FUNCTION finance_test_fail()");
    }

    private void removeOwnerFailure(String table) {
        fixture.jdbc().execute("DROP TRIGGER finance_test_failure ON " + table);
        fixture.jdbc().execute("DROP FUNCTION finance_test_fail()");
    }

    private void seedMembers() throws Exception {
        assertThat(request("POST", "/api/household", Map.of("id", UUID.randomUUID().toString(),
                "name", "Maya and Sam")).statusCode()).isEqualTo(201);
        assertThat(request("POST", "/api/household/members", Map.of("id", MAYA, "name", "Maya"))
                .statusCode()).isEqualTo(201);
        assertThat(request("POST", "/api/household/members", Map.of("id", SAM, "name", "Sam"))
                .statusCode()).isEqualTo(201);
    }

    private Map<String, Object> account(String id, String amount) {
        return Map.of("id", id, "name", "Everyday Checking", "bank", "Harbor Bank",
                "ownerIds", List.of(MAYA, SAM), "openingAmount", amount, "balanceDate", "2026-09-01");
    }

    private HttpResponse<String> request(String method, String path, Object payload) throws Exception {
        var publisher = payload == null ? HttpRequest.BodyPublishers.noBody()
                : HttpRequest.BodyPublishers.ofString(JSON.writeValueAsString(payload));
        try (HttpClient client = HttpClient.newHttpClient()) {
            return client.send(HttpRequest.newBuilder(URI.create(fixture.backendUrl() + path))
                    .header("Content-Type", "application/json").timeout(Duration.ofSeconds(8))
                    .method(method, publisher).build(), HttpResponse.BodyHandlers.ofString());
        }
    }

    private JsonNode body(HttpResponse<String> response) {
        assertThat(response.statusCode()).isBetween(200, 409);
        return JSON.readTree(response.body());
    }
}
