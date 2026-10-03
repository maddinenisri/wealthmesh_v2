# SETUP-001 project setup design

Packet revision: 1, October 3, 2026. Status: awaiting human design review. This packet proposes the complete setup scope; no application, executable tooling, documentation server, dependencies, or containers have been implemented or started.

## Review together

- [Architecture, API, persistence, environment, and compatibility](features/setup/architecture.md)
- [UX design](features/setup/ux-design.md)
- [Validator acceptance test plan](features/setup/acceptance-test-plan.md)
- [Current status and approval record](features/setup/status.md)
- [Agent communication and ownership](features/setup/agent-protocol.md)
- [Coding standards](coding-standards.md)

The owner has selected Java 25, PostgreSQL through Docker Compose, Testcontainers, MSW, real-system E2E, localhost only, no login, Markdown agent communication, separate role sessions, and one feature at a time. The remaining framework/tool choices below are recommendations to review with this packet. Approval of this design authorizes its bounded implementation; feature acceptance remains the second human checkpoint.

## Outcome in plain English

You will have commands to start and stop this project, a small working application screen that checks a real database, and a browser where you can read the agents' Markdown files. The database will keep development data between restarts. Tests will use separate temporary databases so they cannot change that data. This setup proves the development and verification foundations; household finance features come afterward.

## Scope and exclusions

Implement a reproducible Java/backend and frontend skeleton, one synthetic persisted installation record, a read-only setup status endpoint/screen, Compose PostgreSQL, migrations, local documentation viewing, quality checks, and each required test layer. Provide final test results and a working demonstration with an explanation of the high-level changes.

No account, balance, transaction, investment, household setup rule, login, network exposure, hosting, browser editing, agent execution UI, or integration with financial providers is included. No sibling project implementation is imported. There is no financial arithmetic to approve in setup.

## Proposed baseline and tradeoffs

| Area | Concrete recommendation | Benefit and cost |
| --- | --- | --- |
| Backend | Java 25; one stable Spring Boot 4.1.x application | One backend to troubleshoot; framework conventions to learn |
| Build | Gradle 9.x wrapper, at least 9.1; Java toolchain 25 | Reproducible build and separate test tasks; a small build DSL |
| Persistence | PostgreSQL 17 in Compose, JDBC, Flyway | Visible SQL and migration history; Docker and query mappings |
| Frontend | React, strict TypeScript, Vite | Typed components and quick local feedback; Node toolchain |
| Frontend tests | Vitest, React Testing Library, MSW | Isolated state/error tests; mocks must remain aligned with API |
| Backend tests | JUnit, PostgreSQL Testcontainers | Real migration/persistence behavior; Docker required |
| Real-system E2E | Playwright Chromium; real Java API and disposable PostgreSQL | Verifies the complete path; additional process orchestration |
| Docs viewer | VitePress stable 1.6.x with local search | Repository Markdown stays authoritative; docs-only Vue dependency |
| Java quality | Compatible stable Checkstyle and PMD 7.16+ | Style/complexity/error checks; meaningful design still needs review |
| Frontend/docs quality | ESLint, TypeScript, Prettier, markdownlint and link checks | Repeatable formatting/type checks; semantic review remains manual |

Exact stable patch versions, Gradle distribution checksum, dependency locks, npm lockfile, and PostgreSQL image patch/digest are implementation outputs. Recheck official compatibility and actual artifact availability before pinning. Spring Boot/Gradle compatibility, Vite/VitePress version caveats, Flyway module requirements, and alternatives are detailed in [architecture](features/setup/architecture.md). Do not install `@next`, snapshots, or previews from documentation examples.

## Proposed repository structure

```text
backend/                  Java application, migrations, unit/integration tests
frontend/                 React application and MSW isolation tests
e2e/                      Real-system browser tests and disposable orchestration
docs/.vitepress/          Viewer configuration; source Markdown stays in docs/
docs/features/setup/      Setup design, role tasks, handoffs, evidence, status
docs/requirements/        Immutable requirements snapshots and inclusion inventory
docs/operations/          Start, stop, diagnostics, backup and restore reference
scripts/                  Bounded start/stop/preflight/verification commands
compose.yaml              Persistent development PostgreSQL only
package.json              npm workspace and documented task aliases
```

Use one backend and one browser application. Organize later features by capability with explicit HTTP, application, and persistence boundaries. Do not generate speculative finance modules or shared components before their approved behavior exists.

## Local operation contract

All commands below are **to be implemented after approval**, run from the repository root. These names are the proposed public command contract, not executable instructions available today.

| Command | Intended behavior |
| --- | --- |
| `npm run preflight` | Verify Java 25, Node/npm compatibility, Docker/Compose access, required ports/config; print actionable failures without secrets |
| `npm run dev` | Start Compose PostgreSQL, wait for health, start backend, frontend, and docs on loopback; print URLs/log locations |
| `npm run stop` | Stop only this project's recorded host processes and Compose database; preserve volume |
| `npm run db:up` | Start only PostgreSQL and wait for readiness |
| `npm run db:stop` | Stop only PostgreSQL; preserve volume |
| `npm run docs:dev` | Run the Markdown viewer independently on `127.0.0.1:5174` |
| `npm run test:backend` | Run meaningful Java unit tests without Docker |
| `npm run test:integration` | Run migrations/persistence/API integration tests with fresh Testcontainers PostgreSQL |
| `npm run test:frontend` | Run React interaction tests with MSW; reject unhandled test requests |
| `npm run test:e2e` | Build/start dedicated real frontend/backend and disposable database; run Playwright with mocks disabled; clean up |
| `npm run quality` | Run Java static checks, TypeScript/ESLint, formatting, Markdown/link checks and docs build |
| `npm run format` | Apply the agreed formatter to source/config/docs; never repair behavior |
| `npm run verify` | Run all required quality/build/test checks, including integration and real-system E2E; fail on any required check failure |

Java task aliases delegate to the checked-in Gradle wrapper. Fresh installation uses the checked-in npm lockfile through `npm ci`. Development logs/runtime files are ignored; startup uses bounded waits and a manifest of processes it owns. A second start must not launch duplicates. Port conflicts fail clearly and never trigger a broad process kill. Stopping an already stopped project succeeds without affecting other projects.

Frontend `5173`, backend `8080`, docs `5174`, and database `5433` bind explicitly to `127.0.0.1`. Vite proxies `/api` to the backend. No wildcard CORS policy is introduced. Compose uses a dedicated `wealthmesh-v2` project and named volume; secrets belong in ignored local config. No volume-deletion/reset command is part of routine startup/shutdown.

## Quality enforcement proposal

| Standard | Automated setup check | Manual responsibility |
| --- | --- | --- |
| Consistent formatting/naming/imports | Compatible Checkstyle plus Prettier for supported JS/TS/config/Markdown | Reviewer examines names that express domain meaning |
| Complexity above 10 | Java Checkstyle `CyclomaticComplexity`; ESLint `complexity` | Reviewer checks coherent responsibility below the threshold too |
| Deeply nested control flow | Java nested-if/loop checks; ESLint `max-depth` at 2 and `no-nested-ternary` | Reviewer handles mixed nesting and declarative markup appropriately |
| Methods over 40 meaningful lines | ESLint `max-lines-per-function` with blanks/comments skipped; Java PMD/Checkstyle size reports | Java tool counts differ from the exact meaningful-line policy: reviewer verifies that policy explicitly |
| Type safety/clear async behavior | Strict TypeScript; typed ESLint rules; Java compilation/static checks | Reviewer checks runtime validation and error boundaries |
| DRY business rules | PMD CPD duplication report as a signal, with fixtures/generated files identified | Reviewer establishes authoritative rule ownership and meaningful reuse |
| Layer boundaries | Explicit package conventions and build dependency structure | Reviewer checks HTTP/service/persistence boundaries and cycles |
| Financial integrity | Feature-specific tests when finance behavior is approved | Reviewer checks exact money representation, transaction boundaries, and rounding policies |
| Accessible components | Testing Library accessible queries; Playwright keyboard/focus checks for scoped UI | UX/reviewer examine usability and states |
| Documentation completeness | Markdown formatting, internal links, docs build, status/evidence completeness checks | Reviewer checks plain-English explanations and useful diagnostics |

Configure tools explicitly for Java 25; never rely on an old Gradle default analyzer that cannot parse the selected Java version. Official PMD support lists Java 25 from 7.16.0, and Checkstyle documents Java 25 parsing. Avoid preview language features. Automated metrics produce actionable findings, not proof of single responsibility or DRY. [PMD Java support](https://pmd.github.io/pmd/pmd_languages_java.html), [Checkstyle compatibility](https://checkstyle.org/), [ESLint complexity](https://eslint.org/docs/latest/rules/complexity).

The existing standards require correction of violations or a narrow documented mechanical exception. Optional cleanup severity remains an open owner decision. Do not silently disable a rule or widen a threshold. Do not invent a coverage percentage gate for this setup; establish meaningful behavior tests and scenario traceability.

## Requirements source policy

During approved setup, copy requirement text only from `../wealthmesh/docs/requirements/v2` into a dated, immutable `docs/requirements/snapshots/` directory. Record source path, source Git revision, capture time, dirty/untracked source state, per-file SHA-256 checksums, `.feature` count, scenario tags, and duplicates/missing IDs. A Git revision alone does not identify uncommitted source changes.

Create an inventory mapping each source scenario to proposed/included/deferred status with reasons. Setup has its own local acceptance scenarios and claims no finance scenarios implemented. The first finance feature and release scope are separate decisions. A later source change creates a new snapshot and an agent-authored comparison proposal; it never silently replaces an approved requirement. Do not mutate the sibling project's README or implementation.

Latest read-only filename inventory found 39 `.feature` paths; the earlier 33-file/226-scenario observation is historical. Current scenario count has not been rescanned in this design. The source README and live source can differ; the approved snapshot inventory will be authoritative for this project's traceability.

## Evidence and two checkpoints

First checkpoint: owner reviews this packet, UX, test plan, scope, and baseline. Record explicit approval or requested revisions in [status](features/setup/status.md) and [decisions](decisions.md). A request to begin setup is not a recorded approval of the newly proposed framework/API/test details.

After approval, the developer writes meaningful failing behavior tests, implements, and refactors. The validator independently executes required checks; a separate reviewer checks code and evidence. Provide final results only, with exact commands, exit/results, revision or working-tree fingerprint, skips, and defects. No passing implementation checks are claimed now.

Second checkpoint: show actual startup, docs navigation/search, the real setup-ready screen/API/database path, persistent data across a safe restart, and shutdown. Explain in plain English what changed and how to start, stop, and inspect the system. Detailed traces remain in Markdown for reference; the owner need not perform a live troubleshooting exercise. Only the owner can accept the setup.
