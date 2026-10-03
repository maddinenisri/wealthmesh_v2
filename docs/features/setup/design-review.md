# SETUP-001 independent design review

Status: **Design review complete; ready for the owner's first checkpoint.** Reviewer session on October 3, 2026, packet revision 1. No unresolved blocking design inconsistency remains in the reviewed content. This recommendation is not implementation acceptance or human approval.

## Bounded task

Review `SETUP-001` project setup design for feasibility, scope, readability, test quality, engineering-standard enforcement and the two confirmed human checkpoints. Inputs: [agent instructions](../../../AGENTS.md), [coding standards](../../coding-standards.md), [architecture](architecture.md), [UX design](ux-design.md), [UX handoff](ux-handoff.md), [setup packet](../../bootstrap-design.md), and the acceptance test plan when available. Setup scenario IDs are local setup checks, not finance requirement completion.

This reviewer owns this document and [reviewer handoff](reviewer-handoff.md) only. No production implementation, executable tooling, dependencies, server or application checks are permitted in this design task. The reviewer cannot supply design approval or acceptance. Stop after reconciling the design findings and producing the handoff.

## Confirmed choices and remaining proposals

The owner's confirmed requirements include financial health only, localhost/no login, Java 25, Testcontainers, MSW, real-system E2E, test-first development, separate role sessions, one feature at a time, pre-code validator planning, final test results, working demo and plain-English explanation. The owner specifically selected Docker Compose for PostgreSQL. Human review is required before implementation and before feature acceptance.

Spring Boot, Gradle, JDBC/Flyway, React/TypeScript/Vite, VitePress, precise versions and the migration-metadata API are proposals requiring the first checkpoint. A general cleanup/severity policy remains unselected; this review does not introduce a rule that optional improvements automatically block acceptance.

## Reconciled design findings

### DR-01: Define a feasible loopback policy for test cleanup helpers — resolved in architecture

The architecture requires all published test helper listeners to be loopback and correctly forbids disabling cleanup as a workaround. This is stricter than simply binding PostgreSQL and the app. Testcontainers creates Ryuk itself; its current source exposes a control port and mounts the Docker socket. A modifier applied only to the PostgreSQL container does not also configure that helper. The design needs an explicit small mechanism, with a pinned-version check, rather than an unverified claim that default Testcontainers meets this requirement. [Ryuk source](https://github.com/testcontainers/testcontainers-java/blob/main/core/src/main/java/org/testcontainers/utility/RyukContainer.java).

Recommended scoped option: test-classpath registration of Testcontainers' `CreateContainerCmdModifier` service provider, normalizing published bindings to `127.0.0.1` with Docker-selected ephemeral host ports for the containers created by that test JVM. Current `GenericContainer` discovers these providers and applies them to create commands; Ryuk derives from it. Preserve exposed ports, Docker socket mounts and cleanup behavior, and validate actual mappings after creation. This is a feasible source-based proposal, not a compatibility or execution result; confirm the selected stable Testcontainers release provides the same extension before implementing. [GenericContainer extension](https://github.com/testcontainers/testcontainers-java/blob/main/core/src/main/java/org/testcontainers/containers/GenericContainer.java), [modifier interface](https://github.com/testcontainers/testcontainers-java/blob/main/core/src/main/java/org/testcontainers/core/CreateContainerCmdModifier.java).

An alternative Docker daemon default publish IP exists, but changing the owner's Docker Desktop configuration affects other projects and is a material environment change, so do not silently choose it. A narrower policy for short-lived helpers would need an explicit recorded owner decision. Retain Ryuk: its documentation describes disabling it for environments that already supply automatic cleanup; ordinary local tests have not established such a replacement. No extra daemon, broker, remote runner or cleanup service is needed. [Docker daemon publish IP](https://docs.docker.com/reference/cli/dockerd/), [Testcontainers cleanup configuration](https://java.testcontainers.org/features/configuration/).

Checked resolution: architecture now explicitly proposes the test-classpath service provider, requires pinned stable-source/invocation-order verification before coding, preserves Ryuk and Docker socket mounts, and validates actual PostgreSQL/Ryuk mappings. The plan mirrors this. The scoped mechanism is reasonable for the confirmed loopback boundary; it avoids a silent daemon-wide change or unsafe cleanup disablement. Pinned-version compatibility and observed runtime bindings remain implementation obligations.

### DR-02: Keep persistence proof stronger than a generic health response — resolved in the revised plan

The proposed `installation_metadata` row is meaningful for setup: it demonstrates that a real migration creates stored data and that the API reads it. It intentionally establishes no financial behavior. The revised acceptance plan requires independent migration-history assertions, a disposable-database value change to `2`, a missing-row `503`, and proof that GET creates nothing. AC-03 now adds a separate validation-owned marker, preserves it across Compose restart and checks volume identity/migration timestamp; AC-04 checks rerun preservation. These resolve the generic-health and restart-reseeding concerns without a new production write endpoint. Architecture explicitly returns the stored textual value.

The plan also requires tests with isolated configuration and no dev-URL fallback. Revised AC-08 explicitly executes integration/E2E twice with Compose stopped; its isolation section now requires loopback database mappings for the chosen host Java process and inspects cleanup-helper mappings. Both plan-alignment clarifications are resolved. Execution remains pending.

### DR-03: Finish the concrete tooling and reader contract — resolved in the revised packet

The revised bootstrap draft now names proposed commands, their responsibilities and resource ownership; distinguishes not-yet-implemented commands from environment checks actually executed; and maps automated format/lint/type/static-analysis coverage versus manual responsibility/DRY/pattern review. Architecture now specifies local Mermaid via one small docs-theme renderer and pinned local dependency, mounted client rendering for static-build compatibility, visible failure/source fallback, and readable adjacent text. Source-code references use labelled copyable paths/line numbers until a repository URL exists. No arbitrary filesystem server or additional application service is introduced. Bounded developer/validator/reviewer task files are present and agree with the approval boundary.

## Final assessment and practical limits

The bounded read-only setup slice is appropriate. Persistent Compose development data and disposable test databases are distinct, and tests must operate with Compose stopped. The documented two checkpoints and no implementation-before-approval boundary agree with the owner. The UX reader remains useful during backend/database failure, includes truthful statuses and final results, and uses annotated design now with a clickable working viewer after approval. No separate prototype has been authorized.

The source requirements inventory is a design snapshot and traceability task. It must not import sibling implementation or present finance scenarios as delivered by setup. No login is required for localhost scope. No monetary engine or speculative domain abstraction should enter this setup.

The proposed runtime combination is supported at the design level: current Spring Boot stable documentation lists 4.1.1 with Java through 26 and Gradle 9.x support. The architect's Java 25/Gradle 9.1+ floor is compatible with the official Gradle matrix. This supports feasibility only; exact artifact versions and the full dependency combination still need the approved build and tests. [Spring Boot requirements](https://docs.spring.io/spring-boot/system-requirements.html), [Gradle compatibility](https://docs.gradle.org/current/userguide/compatibility.html).

The owner can review this coherent proposal now. Java 25 availability, Docker execution permissions, exact stable dependency pins, real listeners, local-search hot updates, Mermaid rendering and quality-tool behavior are still unverified. Their planned checks must execute after approval; these limitations do not justify a passing result today. Later implementation review must check manual engineering standards, actual rule configuration and meaningful tests, including real persisted-value/migration assertions. Synthetic failure checks belong to independent validation; they are not extra live owner exercises.

The broader policy for optional cleanup findings remains open. No optional-cleanup gate, coverage quota, separate prototype approval, live red/green demonstration or additional mandatory human checkpoint is introduced by this review.

## Evidence and limitations

Reviewed Markdown through read-only `sed`/`rg` commands and consulted the linked primary Testcontainers/Docker/Spring/Gradle sources. `git status --short` showed the repository documents are untracked; a Git commit alone cannot identify reviewed content. A read-only Python SHA-256 calculation identifies the content below. Application tests, browser interactions, container startup, dependency compatibility builds, installation, and executable tooling checks were **not run**. Docker/Java environment observations remain the architect's attributed evidence, with their original limitations.

| Reviewed input | SHA-256 |
| --- | --- |
| AGENTS.md | `cf773da0a3e0526337adc1f27d78045289819ecec372effc43c7265ff5f98db5` |
| docs/coding-standards.md | `b119a05d3531f2fe7b7f575e68b145363b5f32ac4be6ce252cb437ef335e13f6` |
| docs/bootstrap-design.md | `91b3486fa6d38aa1ca87bf8ab6532defeab3155fcebf118b3c7352488e44e38d` |
| docs/features/setup/architecture.md | `e3338eceb70b311c9c47c21239d3268ba2801e2914e76958c53057d876eb6945` |
| docs/features/setup/ux-design.md | `622bc2658c67922cd8275a6e16f12b628a5fd9e1ae79f79ed99042ea7ad3a88b` |
| docs/features/setup/ux-handoff.md | `0285a6917ec169f1ce931f64edd386bb45f61fd4a7662fb16b6090a789458471` |
| docs/features/setup/acceptance-test-plan.md | `e557491a199a2b9428028359b6a41fa38957a61cc4b81183eeb7f2e89660ffdb` |
| docs/features/setup/agent-protocol.md | `87a052c3403825a5f3ae53f1eaa131f55b55966ef597fc99384d1d26dc766137` |
| docs/features/setup/tasks/reviewer.md | `cc5107d12da79e19dbeaf8c46b5dc0549041fb8ea201f51afbdcacad69e1310b` |
| docs/features/setup/tasks/developer.md | `07c2ea450b1b57ce7e56e7a8ae339b0898a9a108338dc62d7e458ccdb9bc5b94` |
| docs/features/setup/tasks/validator.md | `5006f81dc478a17f747e75e94e9247b565e05a6fad210c44cd55b120b064e49e` |

Relevant design changes require a checked update to this review. Coordinator-only status changes recording review readiness or the owner's later decision do not alter the underlying design assessment.
