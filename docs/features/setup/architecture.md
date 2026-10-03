# SETUP-001 architecture proposal

Status: proposed; implementation has not started. Prepared by the architect agent on October 3, 2026. Review this with [the setup design](../../bootstrap-design.md), the UX proposal, and the acceptance test plan.

## What the setup will do

The browser will show whether the application can read a small synthetic installation record from PostgreSQL. This proves that the screen, Java backend, database connection, and first migration work together. It introduces no account, balance, transaction, household identity, or financial calculation.

The documentation browser will read the same Markdown files the agents write. The owner will see feature status, designs, handoffs, final checks, and explanations through navigation and search. The owner continues to communicate through chat; the documentation viewer has no editor, approval button, or agent control panel.

## Process and data boundaries

| Process | Proposed address | Responsibility |
| --- | --- | --- |
| React/Vite development frontend | `http://127.0.0.1:5173` | Display setup status; proxy `/api` to the backend |
| Java backend | `http://127.0.0.1:8080` | Serve the API, run migrations, read persisted metadata |
| Compose PostgreSQL | `127.0.0.1:5433` mapped to container `5432` | Persistent development database |
| VitePress documentation viewer | `http://127.0.0.1:5174` | Render repository Markdown, navigation, and local search |
| Integration/E2E databases | Disposable containers, ephemeral loopback mappings | Isolated tests using the same PostgreSQL image as development |
| E2E frontend/backend | Separate free loopback ports | Real-system test processes owned by the test run |

Port `5433` reduces collision with an existing PostgreSQL service. Application and documentation ports are fixed by default and startup fails with an actionable port-conflict message instead of silently selecting another port. Overrides are explicit, stay on loopback, and appear in startup output. Do not kill a process merely because it occupies a desired port.

Compose contains PostgreSQL only. Java, frontend, and documentation processes run on the host for readable logs and direct debugging. No reverse proxy, broker, cache, external provider, authentication service, or hosted deployment is introduced.

Loopback is explicit in host server configuration and Docker port bindings. Testcontainers database bindings must also use loopback. Validation inspects actual listeners and published ports, including auxiliary test containers. A helper that exposes a listener beyond loopback must be corrected or recorded as an unresolved setup defect; do not disable resource cleanup to work around it.

Proposed helper mechanism: register a test-classpath `org.testcontainers.core.CreateContainerCmdModifier` service provider through Java `ServiceLoader`. It normalizes container published bindings to `127.0.0.1`, preserving exposed container ports and using Docker-assigned ephemeral host ports. Apply it to the test JVM that starts both integration and E2E containers. The extension in current `GenericContainer` also reaches its Ryuk cleanup subclass, whereas a PostgreSQL-only modifier would not. Keep Docker socket mounts and cleanup behavior intact; do not change the owner's daemon defaults. Verify the extension and invocation order in the pinned stable Testcontainers source before coding, then inspect actual PostgreSQL and Ryuk port bindings during execution. This is a feasible source-based proposal, not an executed compatibility check. [Modifier interface](https://github.com/testcontainers/testcontainers-java/blob/main/core/src/main/java/org/testcontainers/core/CreateContainerCmdModifier.java), [GenericContainer extension](https://github.com/testcontainers/testcontainers-java/blob/main/core/src/main/java/org/testcontainers/containers/GenericContainer.java).

## Small read-only API contract

Proposed endpoint: `GET /api/system/status`.

| Condition | Response | Screen behavior |
| --- | --- | --- |
| Database reachable and installation metadata readable | `200`, `{ "status": "ready", "installationVersion": "1" }` for the initial persisted value | Show “Setup ready” and the stored installation version |
| Request still pending | No response yet | Show loading text; avoid displaying success prematurely |
| Database unavailable or expected metadata missing | `503`, `{ "code": "SYSTEM_UNAVAILABLE", "message": "Setup status is unavailable." }` | Show an understandable unavailable state and retry action |
| Network request fails | No HTTP response | Show an understandable connection error and retry action |

Use a finite server query/connection timeout and browser request timeout. The GET endpoint never writes, initializes records, or applies migrations. Migrations execute during backend startup. Raw SQL errors, passwords, connection strings, stack traces, and host paths are not returned to the browser. The API contract is tested on both frontend and backend; MSW implements these same response shapes in isolated tests.

## First migration and request flow

The first Flyway migration creates `installation_metadata` with a primary key `key` and required textual `value`. It inserts one non-sensitive row, `setup_version = 1`. Backend readiness reads this row through an explicit query and reports its stored textual value, never a hardcoded version. Disposable integration/E2E fixtures may change it to `2` to prove the response reads the database. A missing row returns `503` without being recreated by GET. Startup applies the migration once and fails clearly if migration validation fails. No automatic schema recreation or destructive migration fallback is allowed.

```text
Browser setup page
  -> GET /api/system/status through Vite /api proxy
  -> SystemStatusController maps HTTP response
  -> SystemStatusService coordinates the readiness query
  -> InstallationMetadataRepository executes a parameterized read
  -> PostgreSQL installation_metadata row created by Flyway
  <- typed ready response or actionable unavailable response
```

Use Spring JDBC for this small persistence boundary. Domain/business rules will live in feature modules when approved finance features arrive. Controllers translate requests, application services coordinate a use case, and repositories handle database access. Avoid a generic repository hierarchy, speculative money engine, or mandatory interface for every class.

Frontend API access and runtime response validation stay outside presentation controls. Use a small status component and a reusable loading/error presentation only where its purpose is clear. No financial math occurs in setup. The future rules for currency, precision, balances, transfers, and rounding require their own feature designs.

## Persistence and lifecycle

Use a dedicated Compose project name `wealthmesh-v2` and named development volume. For the proposed PostgreSQL 17 image, mount the volume at `/var/lib/postgresql/data`. Pin the exact image patch and digest during approved implementation and use the same image reference in Testcontainers. Do not use a floating `latest` tag.

Store local credentials in ignored local configuration generated without printing secrets; supply an example containing placeholders. Credentials are never embedded in browser code or Markdown. Use a dedicated local database/user for this application. No connection to the sibling project's database is permitted.

PostgreSQL has a `pg_isready` health check. Host startup waits for Compose health and the backend status endpoint with bounded timeouts; container existence alone is insufficient. A failed start reports the failed dependency and log location, then stops only application processes created by that invocation. It preserves the development database volume.

Normal shutdown sends termination to this project's recorded processes and stops the Compose database. It never deletes the development volume. A later explicit database-reset operation is destructive and requires an explicit owner request; reset is outside setup. Document backup and restore commands, but do not run a restore or erase existing data as part of setup.

The test suite never reads the development database URL or its credentials. Integration tests create their own PostgreSQL container; E2E orchestration creates a separate disposable database, applies real migrations, starts the Java backend and built frontend, runs Playwright with MSW disabled, and reliably cleans up its own resources. Integration and E2E still work with the persistent Compose database stopped. Container reuse is disabled for mandatory acceptance checks.

The validator may insert one uniquely named synthetic `validation_<run-id>` marker into the nonfinancial development metadata table solely for restart evidence, after checking it does not exist. It must survive the same named-volume restart; remove only that owned marker afterward. Migration history and applied timestamp must stay unchanged. Mutating/deleting `setup_version` is restricted to disposable test databases. This prevents a freshly reseeded record from imitating persistent data.

## Documentation reader implementation contract

VitePress reads `docs/` directly, with stable navigation to `docs/index.md`, `docs/features/index.md`, and this feature's `index.md` and canonical `status.md`. These overview/index pages are implementation outputs. Use VitePress local search with no external service. Configure only the docs source root and approved static assets; do not expose `.env`, runtime logs, or arbitrary filesystem paths.

Implement Mermaid with an explicit local, pinned `mermaid` npm dependency and one small docs-theme Vue renderer. VitePress's supported Markdown configuration hook turns Mermaid fences into that renderer; client-side rendering begins after mount so server/static builds do not depend on browser globals. Mermaid runs in strict security mode with local assets. Invalid sources produce a visible render-error state, an available source/text description, and a failed diagram acceptance check. Ordinary article content remains readable. This is a docs-only component, not another application service or externally hosted renderer. [VitePress Markdown configuration](https://vuejs.github.io/vitepress/v1/guide/markdown), [Mermaid configuration](https://mermaid.js.org/config/schema-docs/config.html).

Every diagram has an adjacent plain-English explanation and a link to a source section on the same page containing the original fence text and canonical Markdown path. This source section can be expanded/copied and needs no arbitrary file server. Source-code references use explicitly labelled copyable local paths and line numbers until a suitable repository URL is known. Relative Markdown links route to rendered pages; do not pretend a browser link to `backend/...java` opens a local editor or arbitrary disk file. Keep canonical source paths visible for future troubleshooting.

The reader runs independently of Java/PostgreSQL and updates saved Markdown and its search index through local VitePress development refresh. Validate this behavior against the selected stable version. Status remains a written fact owned by the coordinator; neither a filesystem watch nor test-count widget infers approval. Startup/shutdown instructions remain available when the finance backend or database is down.

## Dependency and compatibility policy

Recommend Java 25, Spring Boot stable 4.1.x, Gradle wrapper 9.x at least 9.1, PostgreSQL 17 with Flyway and JDBC, React/TypeScript/Vite, Vitest/React Testing Library/MSW, Playwright, and VitePress stable 1.6.x. Exact patch versions and compatible tool versions will be pinned in wrapper metadata, Gradle dependency locking, npm lockfiles, and the container image record during implementation. Recheck registry availability and compatibility before pinning; reject previews and snapshots. This recommendation remains subject to human design approval.

Gradle supports Java 25 for toolchains and its own runtime starting at 9.1.0. Spring Boot's official current stable requirements include Java 25 and Gradle 9.x. These establish a feasible combination, not a completed build. [Gradle compatibility](https://docs.gradle.org/current/userguide/compatibility.html), [Spring Boot requirements](https://docs.spring.io/spring-boot/system-requirements.html).

Vite's published minimum Node versions are 20.19+ or 22.12+, with higher requirements possible for templates. Current VitePress landing documentation points at a 2.0 alpha and installs `@next`; use the linked stable 1.6 branch and verify its engine/dependency requirements instead. The detected Node 26.4.0 is an environment observation; the final setup must verify the selected packages and document an exact supported runtime without an unsolicited global replacement. [Vite guide](https://vite.dev/guide/), [VitePress stable guide](https://vuejs.github.io/vitepress/v1/guide/getting-started).

Flyway PostgreSQL support requires the PostgreSQL database module as well as core and a JDBC driver. Testcontainers supplies a PostgreSQL module for disposable integration databases. Use Boot dependency management where available and verify version alignment with executed tests. [Flyway PostgreSQL](https://documentation.red-gate.com/flyway/reference/database-driver-reference/postgresql-database), [Testcontainers PostgreSQL](https://java.testcontainers.org/modules/databases/postgres/).

Compose supports health-based startup conditions, and explicit localhost publishing restricts host access. Health checks do not establish application correctness. MSW intercepts network requests for isolated browser/Node tests and does not replace real-system evidence. [Compose startup](https://docs.docker.com/compose/how-tos/startup-order/), [Docker publishing](https://docs.docker.com/engine/network/port-publishing/), [MSW documentation](https://mswjs.io/docs/).

## Tradeoffs for the owner

| Recommendation | Benefit | Cost or alternative |
| --- | --- | --- |
| One Spring Boot application | One backend to inspect, run, and troubleshoot | Framework conventions to learn; plain Java HTTP setup requires more assembly |
| Gradle wrapper | Explicit reproducible build and separate test tasks | Build DSL to learn; Maven is a valid alternative if preferred |
| JDBC plus Flyway | Small visible queries and explicit schema history | Write mappings/queries; JPA would add ORM behavior unnecessary for setup |
| React/TypeScript/Vite | Typed screen components and fast local iteration | Node toolchain and component conventions; server-rendered Java UI would simplify processes but change the proposed UI approach |
| VitePress stable | Readable local Markdown, navigation, search, and fast updates | A docs-only Vue dependency; a plain static Markdown reader would have fewer features |
| Persistent Compose plus disposable tests | Day-to-day data survives; tests cannot damage it | Docker required and additional temporary containers during tests |

## Current environment evidence

Read-only observations on October 3, 2026: Java 21.0.11 active; Java 17 installations also detected; Java 25 absent from the detected JDK list. Node 26.4.0, npm 11.17.0, Docker client 28.4.0, and Compose 2.39.4-desktop.1 detected. Docker daemon access returned an execution-sandbox permission error; daemon running state and container execution remain unverified. No container, server, dependency install, or application test was started.

Resolve Java 25 availability and Docker execution during approved implementation using the applicable execution permissions. They are prerequisites to validation, not passing checks or evidence of application defects.
