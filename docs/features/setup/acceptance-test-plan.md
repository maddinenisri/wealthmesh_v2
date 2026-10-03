# SETUP-001 acceptance test plan

Status: packet revision 1 acceptance plan ready for human design review. Aligned with the [architecture](architecture.md), [UX design](ux-design.md), and [setup design](../../bootstrap-design.md); [independent design review](design-review.md) records DR-01/02/03 resolved at design level. Human design approval and implementation are pending. No acceptance checks have been executed.

These are setup-specific scenario IDs, not imported finance requirement tags. They establish the development foundation, not a delivered financial capability. The coordinator owns [feature status](status.md) and the decision record.

## Bounded validator task

| Field | Contract |
| --- | --- |
| Feature | `SETUP-001`: reproducible local setup and Markdown communication viewer |
| Scenario IDs | `SETUP-AC-01` through `SETUP-AC-17` below |
| Inputs | [Agent instructions](../../../AGENTS.md), [setup design](../../bootstrap-design.md), [architecture](architecture.md), [coding standards](../../coding-standards.md), [workflow](../../workflow.md), and [UX design](ux-design.md) |
| Approved scope | Localhost, no login, Java 25, PostgreSQL through Docker Compose for development, Testcontainers integration, MSW frontend isolation, real-system E2E, agent-generated Markdown, independent validation |
| Proposal boundary | Framework versions, concrete contracts, lifecycle commands, and demo interaction must be part of the reviewed design; this plan does not approve them |
| Permitted changes in this session | This test plan and [validator handoff](validator-handoff.md) only |
| Required output | Scenario coverage, expected outcomes, test layers, command expectations, independent evidence format, unresolved design gaps |
| Stop conditions | No application code, executable tooling, dependency installation, Docker mutation, or test execution before implementation approval; unresolved behavior returns to the architect/coordinator |

## Concrete persistence demonstration

The first production migration creates `installation_metadata` with required `key` and `value` fields and primary key `key`, and inserts `setup_version = 1`. The browser calls `GET /api/system/status` through the frontend proxy. The real Java backend queries that row and returns `200` with `{ "status": "ready", "installationVersion": "1" }`. A page refresh and backend/database restart must still read the row from persistent development storage. This is migration-backed persistence; there is no writable application form or API in setup.

Missing metadata or query failure produces `503` with `{ "code": "SYSTEM_UNAVAILABLE", "message": "Setup status is unavailable." }`. GET never initializes missing data. The frontend shows loading, ready, unavailable/network error, and retry states. No account, balance, transaction, or financial arithmetic behavior is added. The architecture supplies this contract; the documentation UX supplies reader/navigation expectations.

To establish actual database dependence, a disposable integration/E2E fixture changes the stored `setup_version` to `2`, and the API/browser must report `2`. A hardcoded successful response would fail. Another disposable fixture deletes the row and verifies unavailable behavior and no recreation by GET. These fixtures use SQL in test-owned databases; they do not introduce an application write endpoint or alter the development record. Empty/invalid/missing response shapes are exercised by frontend isolation tests, not by inventing an input policy for a nonexistent form.

## Acceptance cases

All required cases are pending. A missing prerequisite is a blocked or not-run check, never a pass.

| ID | Behavior and procedure | Required expected outcome | Layer and evidence |
| --- | --- | --- | --- |
| `SETUP-AC-01` | Inspect approved versions, configuration, dependency locks, Java toolchain, and documented prerequisites; invoke prerequisite verification | Java runtime/build use 25; commands detect missing Java, Node, or Docker and name the correction; lockfiles/wrapper versions reproduce the baseline; no hidden global Gradle dependency | Toolchain checks, command output, version inventory |
| `SETUP-AC-02` | Start documented development stack with the project-specific Compose configuration; inspect published ports and listeners | PostgreSQL has persistent project-owned storage; browser, backend, database, and docs host listeners use loopback; no published `0.0.0.0` or `::` listener; no login screen | Compose configuration inspection, runtime listeners, local HTTP/browser access |
| `SETUP-AC-03` | Open setup status, refresh, record metadata/migration history, insert validation-owned synthetic marker key `validation_<run-id>` in metadata, then restart backend and Compose DB normally | Browser/API/DB report version `1`; synthetic marker survives restart; named volume and applied migration timestamp/history unchanged; migration rerun preserves marker; remove only that owned marker afterward; no schema recreation or duplicate seeding | Real browser + backend + development PostgreSQL; bounded marker/history queries, volume identity, screenshots |
| `SETUP-AC-04` | Apply migrations to fresh Testcontainers PostgreSQL; insert unrelated synthetic marker, rerun migration/startup; read version, change it to `2` via SQL fixture, delete version row, check declared constraints | Rerun preserves marker; API returns stored `1`, then `2`; missing row yields specified `503`; row count unchanged by GET and missing row not recreated; primary-key/not-null constraints hold; production migrations/engine used | Backend integration test class/method, disposable container identity, migration and HTTP evidence |
| `SETUP-AC-05` | Exercise status-use-case behavior without database/container startup using a bounded repository stub | Stored version is returned, missing record and repository failure map to explicit unavailable behavior; no silent zero/empty/ready fallback; tests establish use-case semantics without pretending to prove SQL | Backend unit tests; persistence correctness established separately by AC-04 |
| `SETUP-AC-06` | Render frontend against MSW handlers for ready version, delayed read, `503`, network failure, malformed response, and retry success | Ready appears only after validated response; loading and error are visible; keyboard-accessible retry works; malformed shape cannot display readiness; response shapes match API contract | Vitest/RTL/MSW test names and final results; mocked evidence clearly labeled |
| `SETUP-AC-07` | Browser reads migrated version `1` from real Java backend/fresh disposable DB; SQL test fixture changes value to `2`, refresh; delete metadata and retry | Browser displays actual stored value `2`, then unavailable when absent; no hardcoded ready response, MSW, or route fulfillment mocks; migrations ran; no dev DB access | Playwright spec, backend logs, disposable PostgreSQL identity, bounded SQL fixture, screenshot/trace |
| `SETUP-AC-08` | Stop project Compose DB with `npm run db:stop`; execute `npm run test:integration` and `npm run test:e2e` twice using separate disposable DBs; inspect configuration before writes/after cleanup | Suites execute with development DB stopped; every run starts independently; no dev URL/storage fallback; absent test DB config fails before writes; owned resources removed; development data untouched and volume preserved | Independent command outputs, run IDs, harness configuration, cleanup evidence, dev storage identity comparison without real-record dumps |
| `SETUP-AC-09` | Exercise E2E cleanup on a controlled browser assertion failure and controlled backend-startup failure | Harness exits unsuccessfully, collects useful failure output, and cleans its own processes/containers; no broad process kill or Compose volume deletion; already-running development services survive | Bounded harness failure check in disposable test context; process/container identity evidence |
| `SETUP-AC-10` | Start/stop development twice; inspect ownership checks; introduce a disposable unrelated listener on a configured port in a separate controlled check | Start gives a clear port-in-use error instead of killing that listener; stop terminates only verified project-owned processes; stopping twice is safe; normal stop preserves dev volume | Lifecycle check output and specific process IDs; only synthetic fixture listener used |
| `SETUP-AC-11` | Cause DB connection failure in a disposable validation context, then request status; separately check missing row and frontend retry | Query/connection/browser waits have finite bounds; backend returns documented `503` and does not leak SQL, stack trace, paths, or credentials; frontend never displays ready and offers retry; logs identify failure safely | Frontend failure test plus real-backend disposable integration/failure check |
| `SETUP-AC-12` | Open documentation viewer with backend/DB stopped; follow roles, tasks, handoffs, architecture, plan, operations, status/results; search; use keyboard/narrow viewport and missing-page route | Docs work independently; navigation/search/empty states are clear; critical links resolve; Mermaid renders with explanation/source access; headings/focus/contrast readable; status/revision/skips accurate and acceptance not inferred | Browser evidence, docs build/link check, source comparison; covers SETUP-UX-01/02/04/05/06/07/08 |
| `SETUP-AC-13` | Update an existing page with a synthetic unique Markdown term in disposable docs checkout while reader is open | Viewer and search reflect edit without manual rebuild; Markdown is source of truth; diagrams/tables/code remain readable; docs UI has no agent execution, editor, or approval controls | Isolated fixture; local hot-update/search and final docs build; covers SETUP-UX-03 |
| `SETUP-AC-14` | Run approved formatting, lint, strict TypeScript, backend static analysis, and build checks; inspect enforcement configuration | Checks actually cover handwritten production code and tests, exit unsuccessfully for findings, and have no broad exemptions; automated thresholds and manual review responsibilities match coding standards | Final commands and outputs; configuration links; reviewer confirmation of manual SRP/DRY/pattern/reuse checks |
| `SETUP-AC-15` | Independent validator follows written setup/run/stop/test/diagnostic guide on the delivered revision | Commands and ports match implementation; data locations, logs, dev persistence, disposable-test cleanup, and prerequisite failures are understandable; no unsafe blanket cleanup is instructed | Recorded command results, guide links, concrete defects if instructions fail |
| `SETUP-AC-16` | Present working local demo and agent-written plain-English explanation to owner after independent validation and review | Explanation covers how migration saves synthetic metadata, screen requests status, backend reads DB, docs render agent Markdown, and final tests establish behavior; limitations stated; owner acceptance pending until explicit response | Demo instructions/screenshots, explanation link, final validation/review links; coordinator records human response separately |
| `SETUP-AC-17` | Compare captured requirements snapshot with source capture metadata and scenario inventory | Snapshot captures text only; source path/revision/time/dirty state and per-file SHA-256 are recorded; counts/tag uniqueness reconcile actual captured files; proposed/included/deferred inventory does not claim setup delivers finance scenarios; sibling remains unmodified | Snapshot/inventory/checksum evidence and reviewer read-only comparison; no source implementation copied |

## Test isolation and safe operation

- Development uses project-scoped Compose resources and persistent PostgreSQL storage. Ordinary stop must preserve that storage. Destructive reset is outside these acceptance steps.
- Integration tests use Testcontainers PostgreSQL with production migrations. Missing Docker must fail the required command, not silently disable container tests.
- E2E starts a real backend and browser against its own Testcontainers PostgreSQL instance. Reject absent/disallowed test database configuration before any schema or data mutation. Test ports and resource names must not collide with running development services.
- The chosen host Java test/backend topology requires database ports published on ephemeral loopback mappings. Inspect the actual `127.0.0.1` mappings, including Testcontainers cleanup helpers. A random published port alone is not proof of loopback-only access. Do not disable Ryuk to conceal a binding defect or change the owner's global Docker configuration without explicit authorization.
- Resource ownership must be verified, not inferred only from a reusable PID file. Cleanup covers success and failure and targets only resources this run created.
- Validation uses synthetic data. Redact connection credentials in captured configuration/logs. Do not dump the household's existing development records for evidence.
- The dev persistence check adds only a uniquely named validation-owned marker to the nonfinancial metadata table. Record its key, confirm it is absent before insertion, and remove only that marker after checking restart. Do not overwrite `setup_version` or household records. Version-change/deletion fixtures are restricted to disposable test databases.
- Controlled failure checks use disposable processes, databases, or checkouts. Do not alter the owner's live database, stop an existing Docker daemon, or kill unrelated services to test failures.

## Required tools and command contract

Tools needed after approval: Java 25, project Gradle wrapper, pinned Node/npm baseline, Docker daemon/Compose, browser binaries required by Playwright, and repository scripts. Installing those tools is not authorized by this plan alone.

The setup design supplies the following proposed command contract. The developer implements it after approval. The independent validator executes delivered commands and records working directory/arguments. They are not currently executable instructions or evidence that scripts exist.

| Proposed root command | Required coverage |
| --- | --- |
| `npm run preflight` | Runtime versions, Docker availability, actionable missing-tool output |
| `npm run dev` / `npm run stop` | Loopback-only app/docs/DB, project ownership, persistence, actionable startup failure, duplicate-start protection |
| `npm run db:up` / `npm run db:stop` | Bounded readiness and persistent-volume preservation |
| `npm run docs:dev` | Independent reader at `127.0.0.1:5174`, usable without Java/DB |
| `npm run test:backend` | Status use-case result/failure semantics without DB startup |
| `npm run test:integration` | Testcontainers PostgreSQL, migration/persistence/API assertions |
| `npm run test:frontend` | RTL/Vitest/MSW states; unhandled mocked requests fail tests |
| `npm run test:e2e` | Browser + Java backend + isolated disposable PostgreSQL; mocks disabled |
| `npm run quality` | Checkstyle/PMD/CPD, strict types/ESLint, formatting, Markdown/docs build/link checks |
| `npm run format` | Agreed source/config/docs formatting only; quality check verifies clean output |
| `npm run verify` | All required quality/build/test checks; fail on required failure or skipped container check |

The final command catalog belongs in the setup design and operating guide. No required quality/test layer may rely solely on the developer's reported result: the validator executes it independently after implementation.

## TDD procedure and final evidence

The developer writes and executes a meaningful failing behavior test before corresponding production behavior, implements the smallest coherent change, and refactors while tests pass. Missing dependencies, an absent Java runtime, or Docker connection failure do not demonstrate missing product behavior. Mechanical config changes need appropriate operational checks rather than vacuous tests that mirror their file contents.

The human packet contains final results only. It does not require red/green recordings, live failing demonstrations, or a per-increment failure log. The reviewer still checks that meaningful tests cover behavior and that the development handoff attests to test-first work honestly.

For each required result, record:

| Field | Required value |
| --- | --- |
| Identity | Feature ID, scenario IDs, date/time, independent validator session |
| Inputs | Approved packet revision, source snapshot/requirement scope, implementation Git revision |
| Working tree | Clean/dirty; if dirty, content fingerprint and list of relevant changed files; never identify `HEAD` alone as the tested content |
| Environment | Java/Node/Docker/PostgreSQL versions and platform; isolate/redact credentials |
| Execution | Exact command, working directory, exit code, duration, test counts and report/log path |
| Outcome | `PASS`, `FAIL`, `BLOCKED`, or `NOT RUN`; explicitly list skipped tests and why |
| Traceability | Establishing test names, applicable API/schema/code links, browser screenshot or trace where useful |
| Findings | Reproduction, expected/actual outcome, severity, responsible role, resolution/retest link |
| Recommendation | Ready for reviewer or blocked; never human acceptance |

Any relevant change invalidates affected evidence. Re-run those checks and record the new tested content. A failed or skipped required check blocks a ready-for-acceptance recommendation. Report a flawed test and proposed correction; do not weaken requirements to get a passing result.

## Design alignment and remaining checkpoints

1. `127.0.0.1:5173` frontend, `:8080` backend, `:5433` Compose DB, and `:5174` docs follow architecture. Test ports are separately allocated loopback ports; inspect auxiliary cleanup-container bindings as well as PostgreSQL.
2. Architecture explicitly confirms stored textual metadata is returned unchanged; version `2` fixture establishes real DB dependence.
3. [Reviewer handoff](reviewer-handoff.md) confirms packet revision 1 readiness and DR-01/02/03 closure. `SETUP-001` and local case IDs align with coordinator status; the coordinator records completed role readiness and presents the packet to the owner.
4. Human reviews this aligned plan together with design before production implementation starts. Exact versions and actual test names/code links are populated after approved implementation, not fabricated now.
