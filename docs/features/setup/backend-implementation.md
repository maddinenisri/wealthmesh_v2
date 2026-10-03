# SETUP-001 backend implementation handoff

Backend developer owns this document and `backend/`. Backend implementation and developer verification are complete, including the backend portion of IR-01; independent review/validation and integrated delivery remain pending. Approval and acceptance remain in [canonical status](status.md).

Resource-identity follow-up is complete: `owner.json` retains its early PID publication and is atomically replaced with the same PID plus actual initialized PostgreSQL/Ryuk IDs before the controlled failure point. A meaningful regression was added first, then implemented and verified. Final backend checks below are refreshed; platform must refresh its successful/controlled-failure E2E evidence against this source. No platform files or independent reports were changed.

## Integration contract for platform

Use `backend/gradlew` from working directory `backend/`. Select the project Java installation with `JAVA_HOME=<repository>/.tools/java/jdk-25.0.4.1+1/Contents/Home`; `backend/install-java.sh` will install the pinned verified archive without changing system Java. Please ignore `.tools/`, `backend/.gradle/`, and `backend/build/` in the platform-owned root ignore file before tooling is installed. Gradle cache remains project-owned through `GRADLE_USER_HOME=<repository>/.tools/gradle-cache`.

Implemented stable task names: `test` (unit only), `integrationTest` (disposable PostgreSQL), `quality` (Checkstyle, PMD, CPD), `bootJar` (application artifact), `bootRun` (development). `check` includes quality and both test layers. Artifact path is `backend/build/libs/wealthmesh-backend-0.0.1-SNAPSHOT.jar`; SNAPSHOT is a local application name, never an external dependency pin.

Platform published the nonsecret image record `config/postgres-image.txt`, exact single-line patch plus digest. Backend reads only that file, never development secrets, for both integration/E2E. It is identical to Compose.

Application accepts `WM_DB_URL`, `WM_DB_USERNAME`, `WM_DB_PASSWORD`, and `WM_BACKEND_PORT` (8080 by default). Server always binds `127.0.0.1`. No database credential/URL default is supplied. Startup runs Flyway; status GET is read-only. Tests ignore development environment and inject their own connection.

E2E fixture launcher is Gradle `e2eFixture` with `-PfixtureDir=<absolute isolated runtime directory>` and `-PbackendPort=<dedicated loopback port>`. It owns PostgreSQL and the real backend in a single Java process and keeps Ryuk enabled. `stop` and process termination close the Spring context and database; the harness must wait for process exit. The fixture never exports database credentials. Exact file protocol follows.

### Fixture protocol, now implemented

Canonical commands: `version2`, `missing`, `restore`, `databaseStop`, `stop`. Create `commands/<unique-id>.json` atomically with `{"command":"version2"}`. Await `responses/<unique-id>.json`: success is `{"ok":true,"command":"version2"}`; failure is `{"ok":false,"error":"<exception class>"}`. Commands mutate only this disposable database. `stop` acknowledges then ends the fixture. Avoid sending commands concurrently or after `databaseStop` except `stop`. Request files are removed only after handling; incomplete `.tmp` files are ignored.

`owner.json` is written immediately after directory/port validation, before container startup, and initially contains `{"pid":<fixture JVM PID>}`. This allows bounded termination on readiness timeout after verifying the invocation contains the fixture main class and exact run directory. After database/application initialization and actual binding verification, it is atomically replaced with `{"pid":<same JVM PID>,"containerId":"<exact PostgreSQL ID>","cleanupContainerId":"<exact Ryuk ID>"}`. This update occurs before the controlled startup-failure check. Failures earlier in initialization preserve the PID-only record and still invoke owned cleanup; the harness must handle either complete shape.

`ready.json` contains `backendUrl`, fixture JVM `pid`, disposable `containerId`, `cleanupContainerId` (Ryuk), `databaseHost` (`127.0.0.1`), `databasePort`, and synthetic `databaseName`. Before readiness is published, Docker inspection verifies actual loopback bindings for both PostgreSQL and Ryuk. The real Spring Boot application runs in the owning fixture JVM from the same production compiled classes/resources used by `bootJar`; it is not an HTTP mock. No credentials are written to these files. The fixture has a ten-minute maximum lifetime; root harness startup/command/termination waits must also be finite. `-PfixtureStartupFailure=true` throws a controlled startup failure after resource-ID publication, before writing readiness; cleanup still runs. Atomic writes use an owned sibling temporary file and atomic replacement, so consumers see the complete early or initialized record.

Graceful cleanup should prefer the `stop` command and await the Gradle process exit. If a fixture must be interrupted, target the owner-file fixture JVM PID only after verifying owned invocation identity; its shutdown hook closes Spring and PostgreSQL. Ryuk remains enabled for interrupted JVM resource cleanup. Do not terminate a broad Java/Gradle process group or disable Ryuk. Controlled backend startup failure was executed with expected nonzero exit and owned-resource cleanup; platform still owns complete browser failure/cleanup verification.

Exact installed Java executable is `.tools/java/jdk-25.0.4.1+1/Contents/Home/bin/java`; no `current` symlink is required. Approved `WM_*` config remains the development contract. PostgreSQL record is now available and consumed from `config/postgres-image.txt`. A strict official-image allowlist precedes `.asCompatibleSubstituteFor("postgres")` because Testcontainers parses tag-plus-digest names as a compatibility mismatch; it does not alter the pinned pull reference.

## Source verification

[Spring Boot 4.1.1 requirements](https://docs.spring.io/spring-boot/system-requirements.html) lists Java 25 and Gradle 9.x compatibility. [Gradle compatibility](https://docs.gradle.org/current/userguide/compatibility.html) establishes Java 25 support from 9.1.0. Official Maven Central has the 4.1.1 BOM. Gradle 9.1.0 official distribution SHA-256 is `a17ddd85a26b6a7f5ddb71ff8b05fc5104c0202c6e64782429790c933686c806`.

[Adoptium official metadata](https://api.adoptium.net/v3/assets/latest/25/hotspot?architecture=aarch64&image_type=jdk&os=mac&vendor=eclipse) identifies Temurin `25.0.4.1+1` macOS ARM64 archive and SHA-256 `61979887f7506a24a57439ff99adb8b3a7fc89977d9cfe3b8984f58a981b7b9d`. Archive extraction is project-local; no package installer or global runtime update.

Pinned Boot-managed Testcontainers **2.0.5** source was checked at its official release tag. `GenericContainer` loads the `CreateContainerCmdModifier` service providers at construction, applies container settings, then invokes the registered modifiers before creation. Ryuk derives from `GenericContainer`, exposes port 8080, and adds its socket/auto-remove modifier without replacing port bindings. The test-classpath modifier preserves exposed ports and normalizes their bindings to ephemeral `127.0.0.1`; it keeps Ryuk's socket mount and cleanup. Actual PostgreSQL and Ryuk Docker bindings were inspected by executed integration assertions. Sources: [GenericContainer 2.0.5](https://github.com/testcontainers/testcontainers-java/blob/2.0.5/core/src/main/java/org/testcontainers/containers/GenericContainer.java), [Ryuk 2.0.5](https://github.com/testcontainers/testcontainers-java/blob/2.0.5/core/src/main/java/org/testcontainers/utility/RyukContainer.java).

Quality correction: the initial Gradle PMD adapter printed an invalid rule configuration yet exited successfully. That result is not counted as passing analysis. The ruleset now uses the correct `UnnecessaryImport` rule and PMD runs through its strict CLI, with Java 25 explicitly selected. Analysis/configuration errors and violations return nonzero and fail `quality`; a real complexity finding in fixture directory validation produced exit 4 and was corrected by separating argument validation from directory ownership validation. There are no suppression exceptions. Checkstyle and PMD cover main, unit, integration, and shared fixture source; CPD scans all handwritten Java. Single responsibility, business-rule ownership, purposeful reuse/patterns and the exact 40 meaningful-line review threshold remain manual reviewer duties.

## Final evidence

Developer results on October 3, 2026; independent validation/review and human acceptance remain pending. Backend behavior was developed test-first: meaningful tests demonstrated unavailable stored-version behavior and missing initial seed behavior before those behaviors were implemented. Dependency/runtime setup errors were resolved as prerequisites and were never counted as evidence of missing behavior. This attestation provides final results without requiring owner red/green demonstrations.

Environment: macOS ARM64, project-local Temurin 25.0.4.1+1, Gradle 9.1.0 wrapper, Spring Boot 4.1.1, Flyway 12.4.0, PostgreSQL JDBC 42.7.13, Testcontainers 2.0.5, Ryuk 0.14.0, Checkstyle 12.3.1 and PMD 7.16.0. All application, test and analyzer dependencies are locked in `backend/gradle.lockfile`; wrapper distribution checksum is checked in. Shared PostgreSQL image is `postgres:17.11@sha256:d74eeac9a635390a49bc21bd49fccd973de707e2a53a76ac49b552b8712ec46f`.

Executed from `backend/`, with `JAVA_HOME=/Users/srini/workspace/mdstect_ws/wealthmesh_v2/.tools/java/jdk-25.0.4.1+1/Contents/Home` and `GRADLE_USER_HOME=/Users/srini/workspace/mdstect_ws/wealthmesh_v2/.tools/gradle-cache`:

| Final command/check | Result | Evidence |
| --- | --- | --- |
| `./gradlew quality test integrationTest bootJar --rerun-tasks` after resource-ID correction | PASS, exit 0, 12 seconds; all 16 tasks executed | 3 unit tests, 12 integration tests, 0 failed/errors/skipped; reports under `backend/build/reports/tests/test/` and `integrationTest/` |
| Checkstyle through `quality` | PASS for main, unit, integration and shared fixture source | `backend/build/reports/checkstyle/`; explicit naming/indent/complexity/depth/length rules |
| PMD strict CLI through `quality` | PASS; 18 Java files, 0 violations, 0 analysis errors | `backend/build/reports/pmd/all.xml`; Java 25 selected |
| CPD through `quality` | PASS; no duplicated 100-token Java block | `backend/build/reports/cpd.xml`; semantic DRY remains manual |
| `./gradlew resolveAndLockAll --write-locks` | PASS, exit 0 | Deliberate bootstrap lock generation; normal checks run without `--write-locks` |
| `./gradlew e2eFixture -PfixtureDir=/private/tmp/wm2-backend-e2e-drOz7f -PbackendPort=0` plus bounded HTTP/file-protocol smoke | Historical pre-IR-01 execution: real API version `1` → `2` → missing (two read-only 503s) → restored `1` → disconnected 503 → acknowledged stop; Gradle exit 0. Protocol behavior is unchanged; post-correction integrated Playwright is platform-owned | Ready/owner/request/response artifacts in that synthetic temporary directory; PostgreSQL ID `ca5033fcfcce6e6838702e5dff0de4f6bbbdaa178700abd6f5057c9ea572d18b`, Ryuk ID `922b009718993dc9563104b5ea02e3c4ddaeb88c1d076f31936774b8a6583783` |
| Exact owned-container cleanup inspection after fixture process exit | PASS; both IDs absent from `docker ps -a --filter id=<id>` after Ryuk's short normal cleanup delay | No unrelated container, dev volume or daemon was deleted/stopped |
| `./gradlew e2eFixture -PfixtureDir=/private/tmp/wm2-backend-failure-CVghop -PbackendPort=0 -PfixtureStartupFailure=true` | Historical pre-IR-01 controlled negative check behaved correctly: expected exit 1, no ready file; owned JVM and PostgreSQL/Ryuk removed | PostgreSQL `cba6ab6835b67b234bd1fa24984eaae4308bc2381c7ab59b16ec692cb5c1c611`, Ryuk `082b5d4c975f38c0f8532936122d4926d871e7286f0d5df339fe05f2b6bf42e9`; exact-ID Docker/owned-PID checks |

Git has no initial commit yet; all backend source is untracked. Current tested backend content is identified by **32 files**, aggregate SHA-256 `3be08f1d0aa91401f01d720fe0611340df7e8d9fd0d319ffe4076b78456ab8c5`: sort relative `backend/` file paths excluding `build/` and `.gradle/`, compute SHA-256 per file, then hash UTF-8 records `relative-path + NUL + lowercase-file-sha256 + newline`. Shared image-record SHA-256 is `eebb2af479787dd25e3f3497367a93819361af94bb9ce5dad372278c83e7c233`. The historical standalone smoke/failure executions used the previous 30-file aggregate `2c73856fede53d500bba4ab02574b81ff8cd8d0be4e91d6b0a127af0019b5f01`; they do not establish post-correction isolation. The 31-file IR-01 stale-environment run below used aggregate `47d7456da1d1bacbd963011b6e3c28be69b06bd67691294b3bc834e64588b97a`; fixture configuration protection is unchanged in this follow-up. This document is outside the backend aggregate; documentation corrections do not change that tested content.

Remaining integrated checks belong to platform and independent validator: full Playwright browser runs, integration/E2E twice with Compose stopped, controlled browser-failure cleanup, lifecycle/persistence/demo/docs and all source-snapshot cases. No skipped backend checks are hidden; no independent validation, owner acceptance or finance completion is claimed.

### Independent review correction implemented: IR-01

The reviewer found that independent inherited Flyway URLs and Spring server/configuration overrides could bypass fixture datasource/binding settings. `BackendFixture` now creates an explicit Spring environment without the parent's system-property/environment property sources, restricts config loading to packaged `classpath:/application.yaml`, and provides only its owned datasource/port with authoritative `127.0.0.1`. Flyway uses the same datasource object. Supported fixture configuration is the shared pinned image record, explicit backend port, explicit owned directory and test-only controlled-startup-failure flag; arbitrary inherited Spring configuration and profiles are ignored. Testcontainers retains its local Docker configuration and enabled cleanup helper. JVM runtime options may affect JVM startup itself, but their inherited Spring `-D` properties do not configure this application. Production development launcher protection remains platform-owned under IR-01; the reviewer decides closure.

`FixtureConfigurationIntegrationTest.staleSpringPropertiesCannotRedirectFixtureMigrationBindingOrConfiguration` was added before this correction and now passes. It exercises stale datasource, independent Flyway URL/user, wildcard server address and external config location/import options using synthetic unavailable destinations. It verifies the actual ready HTTP response, effective loopback address, owned database URL and identical Flyway/application datasource object.

The prior IR-01 full rerun inherited the following deliberately stale environment, with only synthetic unavailable destinations; all 14 then-existing Java tests and strict checks passed. JVM options were delivered to every test JVM, demonstrating actual system-property precedence protection as well as ordinary environment protection:

```bash
SERVER_ADDRESS='0.0.0.0'
SPRING_DATASOURCE_URL='jdbc:postgresql://127.0.0.1:1/synthetic_unowned'
SPRING_FLYWAY_URL='jdbc:postgresql://127.0.0.1:1/synthetic_unowned_migration'
SPRING_CONFIG_LOCATION='file:/synthetic-nonexistent-configuration.yaml'
SPRING_CONFIG_IMPORT='file:/synthetic-nonexistent-import.yaml'
SPRING_APPLICATION_JSON='{"server":{"address":"0.0.0.0"},"spring":{"flyway":{"url":"jdbc:postgresql://127.0.0.1:1/synthetic_json_migration"}}}'
JAVA_TOOL_OPTIONS='-Dspring.flyway.url=jdbc:postgresql://127.0.0.1:1/synthetic_jvm_migration -Dserver.address=0.0.0.0'
```

These variables were prefixed to the documented Gradle command only for the negative-configuration regression; they are not operating instructions or persisted runtime configuration.

### Exact resource identity regression

`FixtureResourceIdentityIntegrationTest.controlledStartupFailurePublishesExactResourceIdentitiesBeforeClosingOwnedDatabase` now executes a real fixture with controlled startup failure, reads the initialized owner record, verifies the actual current fixture PID and both 64-character IDs, inspects the named Ryuk container for this Testcontainers session, confirms no ready file was emitted, and confirms the exact owned PostgreSQL container is absent after cleanup. The test-first assertion previously found an absent ID; it now passes. Ryuk belongs to the integration test JVM until that JVM exits; platform's separate-process harness is responsible for asserting that helper also disappears after the failed fixture JVM exits. Final all-layer checks include this regression and have no skips. No production API, migration, database configuration or money behavior changed. Relevant Java sources and locks are unchanged after the final passing run.

## What changed, in plain English

Java now serves one small setup check. During startup, a numbered SQL migration creates a table and stores installation version `1`. When the screen asks for setup status, a controller receives the request, a service asks for the stored version, and a repository reads PostgreSQL. The response contains the actual stored text; the integration test changes it to `2` and proves the API follows the database. A missing record or database failure returns the approved unavailable message. The read request cannot create or repair data.

Gradle builds the same Java code and runs small unit tests independently of Docker. Database integration tests create temporary PostgreSQL instances and check real migrations, constraints, changed values, missing data, errors, bounded waits and cleanup-helper bindings. Playwright's fixture starts the same real Java application against its own temporary database. Its file commands change only synthetic fixture data, so browser tests can reproduce error/retry behavior safely. Ordinary development continues to use the persistent Compose database managed by platform.

## Troubleshooting inputs for the operating guide

- Start/stop through root lifecycle commands once platform integration is complete; development launches `backend/build/libs/wealthmesh-backend-0.0.1-SNAPSHOT.jar` with the installed local Java 25 binary. There is no global Java replacement.
- If backend startup fails, inspect its project-owned log for missing `WM_DB_*` configuration, a refused database connection, a port conflict or a Flyway validation error. Do not edit an applied migration, disable migration validation, reseed automatically or delete development storage to conceal the problem.
- If the app reports unavailable, the backend logs `system_status_unavailable` with an exception class and no secret-bearing SQL/stack trace. `MetadataMissingException` means the expected row was not readable; `DataAccessResourceFailureException` commonly means a connection failure. The operations guide should first check database health and application logs.
- Backend query/connection acquisition is bounded: Hikari 2.5 seconds, driver connect 2 seconds/socket 3 seconds, JDBC/server statement 3 seconds. Integration verifies the disconnected database receives the exact generic 503 in under 8 seconds.
- To inspect implementation, copy local paths `backend/src/main/java/com/wealthmesh/system/SystemStatusController.java`, `SystemStatusService.java`, `InstallationMetadataRepository.java`, `SystemStatusErrorHandler.java` and migration `backend/src/main/resources/db/migration/V1__installation_metadata.sql`. These are repository paths, not browser editor links.

## Scenario-to-code/test traceability

| Setup case | Backend contribution and establishing code/test |
| --- | --- |
| AC-01 | Java installer, checksum wrapper, toolchain/BOM/locks and executed Java 25 compilation |
| AC-02/03/04 | Flyway migration plus `InstallationMigrationIntegrationTest`; `migrationHistoryIsNotReappliedAndChangedDataIsPreserved` verifies unchanged history timestamp, changed-data preservation and zero rerun migrations; actual persistent Compose restart evidence remains platform/validator-owned |
| AC-05/06/07 | Exact `SystemStatusController`/error-handler HTTP contract; service unit tests; `returnsTheStoredVersionThroughTheRealHttpServer`, `missingMetadataIsUnavailableAndGetDoesNotRepairIt`; file fixture supplies stored-value/missing/restore commands to Playwright |
| AC-08/09 | Disposable fixture creation never reads dev variables; configuration guards; lifecycle ownership, early owner PID, initialized exact resource IDs, cleanup hook and Ryuk retained; resource identity regression and observed graceful cleanup; independent repeated/full failure checks remain pending |
| AC-10 | Backend binds only 127.0.0.1 and offers finite graceful shutdown; full lifecycle remains platform-owned |
| AC-11 | `databaseQueryFailureIsUnavailableWithoutLeakingDetails`, `databaseConnectionFailureHasABoundedSafeResponse`, missing metadata test and actual disconnected-fixture smoke |
| AC-14 | Executed Checkstyle, strict PMD, CPD and Java compilation; manual responsibility/DRY/reuse/pattern review still required |
| AC-15/16 | This plain-English explanation, final evidence, task/config/runtime and diagnostic contract feeds the platform operating/demo packet |
| AC-17 | No backend finance requirement implementation or sibling code import; source text snapshot belongs to docs/platform |
