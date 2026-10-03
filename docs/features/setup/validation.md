# SETUP-001 independent validation

Validator: `/root/implementation_validator`, October 3, 2026. Scope: approved packet revision 1, AC-01–17. [Canonical status](status.md) records human decisions; passing tests never grant acceptance.

## Authoritative outcome

**PASS: all required independent setup outcomes are established; VD-01 is corrected and independently retested.** Ordinary required test skips: **0**. The localhost demo is restored, the owned development marker removed, and exact disposable resources absent. No requirement was waived. Ready for final reviewer/coordinator reconciliation; owner acceptance remains pending.

Independent core execution ran 17:56–18:20 UTC; the bounded prerequisite correction was independently checked at 18:27–18:28 UTC. This report records actual commands/assertions/state, not substituted developer results. Detailed traces are reference material; [demo](demo.md) and [plain-English implementation](implementation.md) are the human walkthrough.

## Content identity and environment

Git HEAD is unborn (`git rev-parse --verify HEAD`, exit 128); implementation is untracked. Initial before/after executable/config fingerprints are identical: **97 files**, aggregate SHA-256 `5a115e51914bca7841c173321f997c9564dcea292fedbe2843a338048f6b7ec3`, matching developer/reviewer frozen manifests. Final corrected source: **98 files**, aggregate SHA-256 `169a652849ea0f8064cf9732f89e182973fdbf0fc514d4b1d61ce2cfca6c4b8c`, in `.runtime/validation/final-manifest.json`, matching corrected developer identity. Independent comparison changes exactly `scripts/preflight.sh` (new) and `scripts/platform.test.mjs`; all unrelated application/backend/frontend/fixtures/renderer/locks/config bytes remain identical. Targeted affected checks below establish the correction; unrelated behavioral suites were not repeated. Rule: sorted delivered source/config inventory, excluding build/cache/node_modules/runtime/generated outputs/prose; hash UTF-8 `file-sha256 + two spaces + relative-path + newline` rows. README/operations guidance was read and checked separately.

Environment: macOS ARM64, Node 26.4.0/npm 11.17.0, project-local Java 25.0.4.1, Gradle wrapper 9.1.0, Compose 2.39.4-desktop.1, pinned PostgreSQL 17.11 digest from `config/postgres-image.txt`. Compilation/analyzers use project JDK/cache, with no global Gradle requirement.

All public commands ran from `/Users/srini/workspace/mdstect_ws/wealthmesh_v2`. The capture wrapper `node .runtime/validation/run.mjs <label> <command...>` writes full log and JSON command/cwd/start/exit/duration under `.runtime/validation/`. Ignored validator scripts are evidence tooling only. No secret configuration or household records were dumped.

## Executed results

| Exact command/check | Actual result | Duration / evidence under `.runtime/validation/` |
| --- | --- | --- |
| `npm run preflight` with Docker access | PASS, exit 0 | 378 ms; `preflight-escalated.log/json` |
| `npm run test:backend -- --rerun-tasks` | PASS, exit 0; 3 tests, zero failures/errors/skips; fresh execution | 4406 ms; `unit.log/json`, backend XML |
| `npm run test:frontend` | PASS, exit 0; 10 MSW cases | 1259 ms; `frontend.log/json` |
| `npm run test:integration -- --rerun-tasks`, first | PASS, exit 0; 12 tests, zero failures/errors/skips; Compose stopped | 10965 ms; `integration-first.log/json` |
| `npm run verify` | PASS, exit 0; all required quality/build/test stages | 62669 ms; `verify.log/json` |
| `npm run test:e2e`, second successful identity | PASS, exit 0; real stored versions, missing/no repair, restore/retry and DB-stop behavior | 22069 ms; `e2e-second.log/json` |
| `npm run test:integration -- --rerun-tasks`, second with independent Docker observation | PASS, exit 0; 12 tests, zero failures/errors/skips; five PostgreSQL IDs/Ryuk observed and removed; Compose stopped | 20898 ms; `integration-second.log`, `integration-second-result.json` |
| Isolated copied backend `./gradlew --no-daemon integrationTest --tests '*ValidatorMarkerIntegrationTest' --rerun-tasks` | PASS, exit 0; unrelated synthetic marker/history preserved with zero rerun migrations | About 6 s; exact temporary cwd/arguments in `backend-marker.json`; `backend-marker.log`; copied project removed |
| `npm run test:lifecycle` while app/backend stopped | PASS, exit 0; actual start rejects synthetic unrelated listener and leaves it listening | 337 ms; `lifecycle-conflict.log/json` |
| `npm run stop`, second stop, `npm run docs:dev`, hostile-config `npm run dev`, final `npm run stop` / `npm run dev` | PASS, exit 0 each; normal stops preserve volume; second stop safe; two starts succeed; independent docs works; demo restored | First stop 1360 ms, second 193 ms, docs start 850 ms, hostile start 7609 ms; respective logs/JSON; final direct command output/state |
| Actual live docs inspection / isolated frontend HMR / actual live app | PASS, exit 0; browser assertions and screenshots | 2234 / 694 / 438 ms; `live-docs`, `frontend-hmr`, `live-app` logs/JSON and browser result artifacts |
| Independent snapshot/live-source scan | PASS, exit 0; byte/hash/identity/status reconciliation | 69 ms; `snapshot-result.json` |
| Exact-resource/development-preservation cross-check | PASS, exit 0 after validator-only absent-process handling correction | 207 ms; `cleanup-corrected.log/json`, `cleanup-result.json` |

Verify executes Java Checkstyle/PMD/CPD, strict frontend/docs/E2E types, ESLint, Prettier, Markdown/link checks, docs/app/backend builds and every required test layer. PMD inspected 18 Java files with zero violations/errors. All matched Prettier files passed; 42 authored Markdown files lint/link checked. Platform: 5 tests, zero skips. Docs: 16 unit checks, zero skips, plus ten browser cases. MSW policy deliberately verifies an unmatched request causes test failure even when caught by the UI; its uniquely owned temporary test is removed. Backend XML was independently counted: 3 unit/12 integration tests, zero failures/errors/skips. Verify legitimately reuses unchanged Gradle inputs; separate forced executions supply fresh unit/integration evidence. Wrapper exit alone is not treated as behavior proof.

## Negative exercises and failed attempts

| Exercise | Actual outcome |
| --- | --- |
| Missing Java, absent Docker, unsupported Node in disposable environments | Expected nonzero exits with actionable correction; `prerequisite-result.json`; installed tools/daemon unchanged |
| Actual missing Node, original entry | Historical FAIL, corrected by the independently checked shell entry below; retained failure evidence, no hidden skip |
| Duplicate `npm run dev` | Expected exit 1 in 138 ms; clear already-running error, no new processes; `duplicate-start.log/json` |
| `WM_E2E_FORCE_ASSERTION_FAILURE=1 npm run test:e2e` under hostile synthetic environment | Expected exit 1, 17948 ms; intentional assertion failure, exact owned cleanup, dev unchanged; `hostile-assertion.log/json`, `assertion-test-results/`, `assertion-playwright-report/` retain context/PNG/trace |
| `WM_E2E_FORCE_STARTUP_FAILURE=1 npm run test:e2e` under same environment | Expected exit 1, 16542 ms; controlled startup failure/no ready file, initialized owner publishes exact IDs, cleanup complete, dev unchanged; `hostile-startup.log/json` |
| Deliberately complex isolated Java fixture | Quality exits 1; Checkstyle reports complexity 13/max 10; PMD also fails; `backend-quality-negative.log/json`; temporary project removed |
| Deliberately complex JavaScript via ESLint stdin | ESLint returns nonzero complexity finding; wrapper confirms rejection; `eslint-negative-output.log`; no production file added |
| First sandboxed preflight | Docker socket denial, exit 1; properly escalated rerun passes; `preflight.log/json`. Environment failure is not missing-behavior/TDD evidence |
| Initial validator-only cleanup script | Exit 1 because synchronous `ps` treated absent PID's expected exit 1 as an exception. Corrected only validator handling: accept completed inspection but still assert no owned invocation. Rerun passes; `cleanup.log/json`, `cleanup-corrected.log/json`. No product change or weakened requirement |

Hostile values cover independent Spring datasource/Flyway URLs/credentials, wildcard bind, configuration location/import, application JSON, JVM options and stale `WM_DB_*`; exact synthetic values are in `hostile-env.json`. Real development starts on owned loopback DB; disposable fixtures initialize only their own DB. Verify's launcher probe separately proves external root/config YAML is ignored and only an explicit synthetic nonexistent loopback database is contacted. No external/unrelated database is migrated.

## Persistence and cleanup

Development PostgreSQL ID `1b5d8a5192120152454d6ce4e8733317f803f6f88e0ba1a01d4c969f9c432744` and volume `wealthmesh-v2_postgres_data` remain unchanged. Mount `/var/lib/postgresql/data`; published `127.0.0.1:5433`.

Bounded SQL reads only setup version, the owned marker and Flyway history. `validation_20261003_1756` was absent, inserted as `synthetic_persistence_probe`, and read unchanged after normal backend/Compose restart. Version stayed `1`; one successful migration stayed at timestamp `2026-10-03T13:00:52.521398`, checksum `625859511`. Cleanup `DELETE ... WHERE key='validation_20261003_1756' AND value='synthetic_persistence_probe'` returned **DELETE 1**, then marker count **0**, version `1`, identical history. The development setup row was never updated/deleted. No volume or unrelated process/container was deleted/stopped.

Both successful E2Es ran with actual Compose `State.Running=false` and distinct disposable identities. Independent exact-ID Docker filters confirm PostgreSQL and enabled Ryuk absent; owner JVM invocation absent; ready-run backend ports closed:

| Run / outcome | PostgreSQL | Ryuk |
| --- | --- | --- |
| `724dd485-2015-4c44-88c9-c9a1bca8ae97`, PASS | `0ee6e566abb922ed9c2d4bfaf52a04ba0a7521c2a481e1d433cfeb9d014244b1` | `10efde57576103cd45debc04cfac79d1c2833b9debe1441ed8fee5bc35ddbabc` |
| `c169a1de-2504-4347-9989-9b90a88c34f0`, PASS | `f180df4937be52227097701e995d6aa50a56fafbfd8c04c46f471b9d7683ffd0` | `fdd777c617a124fd7369f780be0fa626378fab5a5c09ff2d0c2ac3c5962e9958` |
| `6fa3cd68-c4f9-424a-a025-380e5660e457`, expected assertion failure | `3b248c845fe926787c6b6d40d73e79b8a6c384bb1148e275e9be4b86fc325343` | `ac42e070b3b5845e5d8584fda9e4aec59f5457bcaf43a25d6cd6ac782fb49a25` |
| `f449362b-5bab-432d-8a84-ab70c371b637`, expected startup failure | `575fe108d67a38e51359dc2b974059b261ac95762c98f29c2ebf9aa69ff73a39` | `47063b7309a51de2002caf56a1819c10c625ef8704f14d4d9dc2cb9c7857b492` |

`cleanup-result.json` records absence and preserved dev ownership. Supplemental marker fixture resources are absent too. `integration-second-result.json` records five independent PostgreSQL IDs/Ryuk and loopback HostConfig; executed integration assertions inspect actual NetworkSettings positive ephemeral mappings for both. Cleanup enabled, reuse disabled.

Before/after both failures, exact development supervisor identities/tokens/start times stayed unchanged (docs 55596, backend 62183, frontend 62235), same healthy DB/volume, ready API version 1 and app/docs HTTP 200. `state-failure-baseline.json`, `state-after-assertion.json`, `state-after-startup-failure.json` establish this independently.

**Restored demo at 18:20:34 UTC:** supervisors backend **66009**, frontend **66062**, docs **66114**. Actual listeners Java 66061 `127.0.0.1:8080`, Node 66113 `127.0.0.1:5173`, Node 66165 `127.0.0.1:5174`; same healthy PostgreSQL `127.0.0.1:5433`; app/docs HTTP 200, API `{ "status": "ready", "installationVersion": "1" }`. `state-final-demo.json` records current ownership. No more validator service mutations planned.

## Scenario outcomes

| Case | Outcome / establishing evidence |
| --- | --- |
| AC-01 | PASS: Java25/runtime/wrapper/locks/compilation and missing-tool guidance, including corrected pre-Node entry |
| AC-02 | PASS: actual listeners/Docker/HTTP/no-login browser; runtime/database/Compose configurations |
| AC-03 | PASS: real screen refresh, unique marker/history/volume restart and marker removal |
| AC-04 | PASS: migration/status integration constraints/1/2/missing/no repair; supplemental unrelated marker/history rerun |
| AC-05 | PASS: three repository-stub `SystemStatusServiceTest` cases; no DB dependency |
| AC-06 | PASS: ten `SetupStatus.test.tsx` MSW cases including JSON syntax/shapes/network/loading/timeout/keyboard retry; unmatched traffic fails |
| AC-07 | PASS: two actual `e2e/setup.spec.ts` runs against Java/PostgreSQL; service workers blocked, no route mocks |
| AC-08 | PASS: stopped Compose, two forced integrations/two E2E identities, explicit config/image guards, exact cleanup and dev volume preserved |
| AC-09 | PASS: actual assertion/startup failure cleanup and unchanged healthy development identities |
| AC-10 | PASS: actual lifecycle/second stop/duplicate rejection, unrelated listener survives, ownership-denial tests, volume preserved |
| AC-11 | PASS: exact generic query/missing/connection 503 integration responses, disconnected response under 8s, finite frontend timeout/retry, real DB-stop E2E |
| AC-12 | PASS: docs independent; ten delivered browser cases plus actual fourteen-route navigation/focus/source/narrow inspection |
| AC-13 | PASS: disposable existing-page edit updates article/search without rebuild; Mermaid/source/error handling; no editor/approval/agent controls |
| AC-14 | PASS: initial full quality/types/lint/format/build and meaningful rejection, plus targeted corrected-script syntax/lint/format/doc checks; semantic review remains reviewer-owned |
| AC-15 | PASS: run/stop/test/diagnostic/storage/ownership guidance followed, corrected shell prerequisite entry independently exercised |
| AC-16 | Working demo/explanation ready; human acceptance pending; no agent supplies it |
| AC-17 | PASS: captured/live source bytes/revision/dirty status/scenario identities reconcile; no finance completion |

Browser artifacts: `independent-reader.png`, `independent-app.png`, `browser-docs-result.json`, `browser-app-result.json`, `frontend-hmr-result.json`; verify's ten-case docs results are in `.runtime/docs-evidence/`. Actual live reader reached fourteen representative role/task/architecture/plan/status/result/demo/operations/question/decision routes with no page exception/external request, canonical paths, visible 3px keyboard focus, Enter-to-main, 390px page/viewport and scrollable tables/code. Screenshots were inspected. Isolated frontend visibly hot-updated and proxied the real API while denying `.env`, `.runtime`, `.tools`, `.git`, `.aws` synthetic canaries; ordinary modules served.

Snapshot: **40 files / 39 features / 262 scenarios/outlines / 262 unique V2 IDs**, zero missing/duplicate/multiple IDs; all deferred. Aggregate `b9b575dccce13b2eb77402aa8145361d5728c716d92661e3809ac9ab0be09d56`; manifest digest `755dcbe6e7a5e3eeb348abe6e00d4b6ce0c9d1b6adaf11a7c454198ae828a1fd`; inventory digest `d1a863bc5053519d96de13bcb32d3d969f51743107b9ca301295bfca808681be`. Live sibling revision `c2527c056de7c1f19d60d3dbde9830cc68bac4a1`, all forty source files untracked, scoped status unchanged, every byte matches capture. Sibling read only.

Reviewer IR-01/02/03 have actual configuration-isolation/filesystem/JSON-classification runtime evidence; IR-04/05 have actual docs filesystem/HMR/search evidence; IR-06 handover truth inspected through source and routes. [Reviewer handoff](implementation-reviewer-handoff.md) source-checks all six findings/standards against the identical initial manifest. Validator supplies executed evidence; reviewer owns closure/recommendation.

## VD-01: missing Node prevents actionable prerequisite guidance

Status: **corrected and independently retested; validator finding closed**. Owner: platform developer/coordinator. Historical reproduction: actual npm `run preflight` with an empty owned disposable PATH prints only `env: node: No such file or directory`, without pinned guidance; wrapper exits 1 in 40ms (`missing-node-result.json`, `missing-node-output.log`). This original failure remains recorded, not recast as a pass. Installed tools untouched, disposable directory removed.

Platform delivered `/bin/sh scripts/preflight.sh`, runnable before Node/npm and delegating the established npm contract afterward. README/operations now name it before first-install npm commands and explain pinned-tool correction. Independent targeted execution:

| Command | Actual final result |
| --- | --- |
| `node --test --test-name-pattern='prerequisite entry' scripts/platform.test.mjs` | PASS, exit 0; 3 tests, 0 failures/skips, 627ms capture duration; missing Node26.4.0 guidance, missing npm11.17.0 guidance, correct project cwd/arguments and preserved failure exit23; `prerequisite-correction.log/json` |
| `/bin/sh -n scripts/preflight.sh` | PASS, exit0; shell syntax |
| `/bin/sh scripts/preflight.sh` | PASS, exit0, 438ms; real installed Node26.4.0/npm11.17.0/Java25.0.4.1/Compose2.39.4 checks; `shell-preflight.log/json` |
| ESLint `--max-warnings 0 scripts/platform.test.mjs` | PASS, exit0, 899ms; `prerequisite-lint.log/json` |
| Prettier `--check scripts/platform.test.mjs docs/operations/index.md README.md` | PASS, exit0, 140ms; `prerequisite-format.log/json` |
| `npm run docs:lint`, `npm run docs:check` | PASS, exit0 each, 383/138ms; updated authored-doc lint/links; `docs-lint-final`, `docs-links-final` logs/JSON |

The required missing-tool outcome is retained. The correction installs nothing, changes no services/dependencies or global settings, and requires no unrelated broad rerun. Total platform coverage is the original 5 safety cases plus 3 targeted prerequisite cases, all executed with zero required skips. Final source identity is recorded above. No unresolved required validation case remains. Reviewer retains final recommendation; human alone accepts.
