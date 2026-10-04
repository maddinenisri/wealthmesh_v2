# Run and understand WealthMesh locally

This guide describes the existing local operating commands. Setup is accepted; its command evidence remains in [platform evidence](../features/setup/platform-implementation.md), [backend evidence](../features/setup/backend-implementation.md) and [canonical status](../features/setup/status.md). FIN-001 finances are accepted under D-032. The modern finance workspace correction is accepted under [D-036](../decisions.md#d-036-accept-fin-001-modern-ui-correction). Its [packet](../features/household-checking/index.md) explains the current screens, saved data, financial rules, independent results, demo and delivery-process changes. The product navigation contains Overview and Household; diagnostics remain directly available at `/setup`, and engineering documentation remains at `http://127.0.0.1:5174/`.

## First installation

Use the repository root. Node is pinned in `.node-version`; npm's exact generation version is recorded in `package.json`. Java is installed into this repository, not your system.

Run this prerequisite entry before any npm command:

```sh
/bin/sh scripts/preflight.sh
```

It works before Node or npm is installed. Missing Node/npm produces the required version and guidance to install or select it with your toolchain, then rerun the same entry. The current pins are Node.js 26.4.0 and npm 11.17.0; the entry reads those from project metadata. It installs nothing and changes no global settings. Once those tools are present, it delegates the established `npm run preflight` checks for supported versions, project-local Java and Docker.

Follow any reported correction before continuing. If the local Java runtime is missing, run `bash backend/install-java.sh`, then rerun the prerequisite entry. Start Docker Desktop if it reports an unavailable daemon. After prerequisites pass, install the project dependencies and browser:

```sh
npm ci
node_modules/.bin/playwright install chromium
/bin/sh scripts/preflight.sh
```

Docker Desktop must be running. On this computer the approved commands may require Docker socket or loopback-listener permission from the execution environment. An unavailable prerequisite produces an error; container tests never silently pass without Docker.

## Start, read, and stop

```sh
npm run dev
npm run status
npm run stop
```

Startup builds the Java application, starts PostgreSQL, waits for database health, then starts the API, application screen and documentation. Normal shutdown preserves PostgreSQL's named volume and signals only verified project-owned host processes. Starting the complete stack twice reports that it is already running. Stopping twice is safe.

| Service       | Default local address                     | Purpose                       |
| ------------- | ----------------------------------------- | ----------------------------- |
| Application   | `http://127.0.0.1:5173`                   | Manage household and checking |
| Setup status  | `http://127.0.0.1:5173/setup`             | Independent setup diagnostics |
| API           | `http://127.0.0.1:8080/api/system/status` | Read the installation record  |
| Documentation | `http://127.0.0.1:5174`                   | Browse saved agent Markdown   |
| PostgreSQL    | `127.0.0.1:5433`                          | Persistent development data   |

All addresses bind to this computer only. There is no login; household members annotate account ownership. Create a household, add members and save an individual or joint checking account from the application. A joint account counts once in the checking total. Balances use exact USD cents; dates use backend local today or an earlier Gregorian date. Member and account-detail edits are available; activity, income, savings and updating balances remain deferred. Read the [feature's operating guide](../features/household-checking/index.md#operating-guide--implemented-developer-handover) for the screens and a save/failure explanation.

The reader works independently of Java and PostgreSQL:

```sh
npm run docs:dev
```

This starts a tracked background reader and prints its address. `npm run stop` stops tracked services, including that reader. Its source is `docs/`; saving Markdown updates the open reader and local search. The reader has no editing or approval controls. Separate [questions](../questions.md) and [decisions](../decisions.md) remain authoritative written records.

To operate PostgreSQL alone:

```sh
npm run db:up
npm run db:stop
```

## Configuration, ownership, and data

The first database command creates `.runtime/local.env` with a generated password and mode `0600`. The database name is `wealthmesh_v2`; the local username is `wealthmesh`. Do not copy this password into frontend settings, screenshots or Markdown. Preserve the file with the existing development volume; changing it does not change PostgreSQL's existing password.

Compose project `wealthmesh-v2` owns volume `wealthmesh-v2_postgres_data`, mounted at `/var/lib/postgresql/data`. Ordinary stop never deletes it. `.runtime/` contains ignored configuration, logs and process metadata. `.tools/` contains the project-owned Java installation and Gradle cache. Neither is served by the reader.

Explicit local overrides: `WM_FRONTEND_PORT`, `WM_BACKEND_PORT`, `WM_DOCS_PORT`, `WM_DB_PORT`. Each must be an integer from 1024 through 65535. Set overrides before starting; the printed URLs show effective ports. The frontend documentation link uses the documented default reader address, so open the printed reader URL if its port is overridden.

The `.runtime/processes.json` manifest records supervisor PID, unique invocation token and process start identity. Stop compares actual process identity before signalling it. A stale PID belonging to another application is ignored. Do not use broad process-name kills or volume-deletion commands.

The Java launcher selects the packaged application configuration and fixes the host address to loopback. It removes inherited Spring/server overrides and JVM option variables; ambient `application.yaml` and `config/application.yaml` files do not control this app. Use the supported `WM_*` overrides above. The test fixture separately supplies only its own database configuration, never development credentials.

## Verify behavior

```sh
npm run test:backend
npm run test:integration
npm run test:frontend
npm run test:platform
npm run test:launcher
npm run test:msw-policy
npm run test:docs:unit
npm run test:docs
npm run test:e2e
npm run quality
npm run verify
```

`npm run test:launcher` proves the production JAR ignores external configuration in a temporary working directory, using an intentionally unavailable synthetic database. `npm run test:msw-policy` intentionally triggers unmatched mock traffic in a temporary frontend test, verifies the test fails, and removes only that fixture. Both wrapper commands pass only when their expected protection is established.

`npm run test:lifecycle` runs an actual unrelated-port conflict check. Stop the application/backend first; an independent documentation reader may remain running. The synthetic listener must survive the failed startup. This supplemental check is separate from `verify` because it requires that service state.

Backend unit tests need no database. Integration tests use real PostgreSQL through Testcontainers. Frontend tests use MSW only for isolated responses. Full-system E2E builds the frontend once and runs setup then finance in separate sequential disposable Java/PostgreSQL lifecycles, with service workers disabled. Each fixture serves its own copied build, isolated from subsequent shared-output changes. Finance checks include joint ownership, exact balances/dates, saved reload, errors and keyboard focus. The test-only finance reset operates solely on its verified disposable database. E2E never reads development credentials or changes development data.

The fixture protocol is documented in [backend handoff](../features/setup/backend-implementation.md#fixture-protocol-now-implemented). E2E results/logs are in `.runtime/e2e/<run-id>/`; Playwright failures produce `test-results/` traces and `playwright-report/`. Each run cleans its own fixture process and PostgreSQL; Ryuk stays enabled.

The harness verifies that both exact owned PostgreSQL and Ryuk IDs disappear after the fixture JVM exits, including the controlled startup failure. Controlled checks are `WM_E2E_FORCE_ASSERTION_FAILURE=1 npm run test:e2e` and `WM_E2E_FORCE_STARTUP_FAILURE=1 npm run test:e2e`: an exit of 1 is intentional in these modes, and `result.json` must still record completed cleanup. Ordinary E2E must exit 0. These options affect only the disposable fixture.

Automated checks include strict TypeScript, typed ESLint, complexity/depth/method-length checks, Vue lint/type checks, Prettier, Markdown lint, document links, rendered docs build, Java static checks and duplication signal. Single responsibility, rule ownership, purposeful reuse, architecture and financial correctness remain independent review responsibilities. Java owns exact money validation and totals; frontend response validation and formatting do not replace those rules.

Immutable imported source text under `docs/requirements/snapshots/` is intentionally excluded from formatting and authored-document link checks. Its exact bytes are verified by recorded SHA-256. Historical coordinator and role-owned documents retain their ownership; the formatter covers the current developer's assigned artifacts.

## Diagnose startup and status failures

| Symptom                      | First check                                                              | Safe next action                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Prerequisite failure         | `npm run preflight`                                                      | Start Docker Desktop or install the pinned local JDK/Node dependencies named in the error                 |
| Port already in use          | Error identifies port; inspect with `lsof -nP -iTCP:<port> -sTCP:LISTEN` | Stop the listener through its owner or choose an explicit loopback port override                          |
| PostgreSQL startup fails     | `.runtime/local.env` exists; Docker Desktop health                       | Run `npm run db:up` again after correcting the named issue; preserve volume and password                  |
| API is unavailable           | `.runtime/backend.log`, `npm run status`                                 | Check database health and finite connection errors; do not recreate missing data through GET              |
| Screen cannot reach server   | `.runtime/frontend.log`, `.runtime/backend.log`                          | Restart the owned stack after resolving backend/proxy configuration                                       |
| Documentation will not start | `.runtime/docs.log`                                                      | Correct Markdown/configuration error; database availability is irrelevant                                 |
| Diagram did not render       | Visible diagram source and adjacent explanation                          | Correct the diagram's canonical Markdown source and rerun docs checks                                     |
| Lifecycle lock is stale      | Check that no startup/stop command is active                             | Remove only the empty `.runtime/lifecycle.lock` directory after confirming no lifecycle operation owns it |

A setup failure stops processes launched by that invocation and preserves development data. An existing independent reader or existing database remains owned by its earlier invocation. A failed test or skip is not acceptance; check the revision and outstanding findings in the final evidence.

## Backup and restore reference

Create a private local PostgreSQL archive while the project database is running:

```sh
npm run db:backup
```

The archive goes under ignored `.runtime/backups/` with private permissions. It includes only this project's database. Keep encrypted copies and local credentials outside this checkout if you need recovery after loss of the computer. No real household data is included in setup evidence.

Restoration changes data and is outside routine setup. Before requesting a restore, stop application writers, confirm the archive and target database, take a current backup, and obtain explicit authorization for replacement of the intended target. PostgreSQL's `pg_restore` reads the custom archive; test restoration into a separate disposable database first. Do not run `--clean`, delete a named volume, or replace the development database as a troubleshooting shortcut. No destructive restore/reset command is supplied here.
