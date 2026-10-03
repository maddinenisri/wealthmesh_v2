# SETUP-001 backend developer assignment

Sender: coordinator. Recipient: separate backend developer session. Date: October 3, 2026. Status: authorized by owner approval of packet revision 1. Cases: `SETUP-AC-01`–`SETUP-AC-11`, `SETUP-AC-14`–`SETUP-AC-17` for backend contributions; read all 17 cases for integration constraints. Finance scenarios: none.

## Approved inputs

Read [packet](../index.md), [canonical status and actual owner words](../status.md), [D-022](../../../decisions.md#d-022-setup-design-approval), [questions](../../../questions.md), `AGENTS.md`, [standards](../../../coding-standards.md), [bootstrap command/quality contract](../../../bootstrap-design.md), [architecture](../architecture.md), [acceptance plan](../acceptance-test-plan.md), [design review](../design-review.md), [communication protocol](../agent-protocol.md) and [platform brief](developer-platform.md). Inputs are approved design revision 1 plus coordinator-only approval/documentation reconciliation; no architecture contract was changed.

## Scope and shared contract

Implement Java 25 with compatible stable Spring Boot and a checked-in Gradle 9.x wrapper (at least 9.1), distribution checksum, dependency locks, JDBC/Flyway and explicit production/test configuration. Resolve local Java 25 using a project-owned ignored toolchain; do not replace system runtimes. Follow test-first behavior implementation and refactor after passing tests.

Implement the approved read-only `GET /api/system/status`: real persisted metadata yields `200` with ready status and stored textual installation version; missing metadata/database failure yields the approved generic `503` without secrets. Flyway creates `installation_metadata(key,value)` and inserts `setup_version = 1` once. GET never writes. Keep finite DB timeouts and HTTP/service/repository responsibilities clear. No finance, authentication, or speculative generic layers.

Create meaningful unit and PostgreSQL Testcontainers integration tests proving stored version changes, missing records, migration history/repetition, errors and isolation. Testcontainers uses the same pinned PostgreSQL image as Compose, disposable storage, reuse disabled, explicit loopback bindings including Ryuk and intact cleanup. Verify the proposed extension against the pinned stable source before implementation and inspect runtime bindings. Integration tests work with Compose stopped and never consume development URL/credentials.

For full-system tests, expose a bounded test-owned disposable-DB fixture launcher and cleanup mechanism to platform, or equivalent backend task integration within the approved orchestration. Publish the exact Gradle task names, process/config contract, image configuration, finite waits and cleanup semantics in your handoff before platform connects orchestration. E2E uses real migrations and backend, separate loopback ports, mocks disabled and no dev DB access. The platform session owns Playwright and root orchestration.

## Exclusive writing ownership

- `backend/`: application, migrations, tests, Gradle wrapper/build/locks, quality configuration and any backend-owned fixture/toolchain installer.
- `.tools/java/`: ignored project-local Java 25 installation only. Platform owns root `.gitignore` and `.runtime/` local config/log/process manifests; request ignore/runtime/orchestration changes through your Markdown handoff, not direct edits.
- `docs/features/setup/backend-implementation.md`: findings, source compatibility checks, integration requests, actual commands/results, tested content identity, skips and operating inputs for platform.

Do not edit `scripts/`, npm workspace/lock, Compose, frontend/E2E, docs renderer, question/decision/status records, independent reports or coding standards. Platform owns root `.gitignore` and any shared image record. Read its recorded image reference, never its dev secrets. Notify artifact readiness with paths only; record substantive integration requests in the handoff.

## Required output and stop conditions

Deliver backend implementation, test-first attestation, final unit/integration/static-check results, exact stable dependency/runtime records, Gradle task mapping for root `test:backend`, `test:integration` and quality aliases, backend startup/build command for E2E, disposable fixture orchestration/cleanup contract, and plain-English implementation/troubleshooting inputs. Do not require per-increment red/green logs for the owner.

Stop dependent work on ambiguous approved behavior, material architecture/scope changes, unsafe test isolation, unavailable prerequisite or failed mandatory check. Record the blocker and proposed resolution; independent authorized work may continue. Apply execution permission rules for needed installation/container access. No new design approval request for routine work. No acceptance, publishing, broad process kill, dev volume deletion or network exposure. Stop after backend handoff; independent validator and reviewer follow integrated delivery.
