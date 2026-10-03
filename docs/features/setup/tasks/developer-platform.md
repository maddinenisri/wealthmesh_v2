# SETUP-001 platform and frontend developer assignment

Sender: coordinator. Recipient: separate platform/frontend developer session. Date: October 3, 2026. Status: authorized by owner approval of packet revision 1. Cases: `SETUP-AC-01`–`SETUP-AC-17` for platform/frontend/full-system contributions; no finance scenario completion.

## Approved inputs

Read [packet](../index.md), [canonical status and actual owner words](../status.md), [D-022](../../../decisions.md#d-022-setup-design-approval), [questions](../../../questions.md), `AGENTS.md`, [standards](../../../coding-standards.md), [bootstrap command/quality contract](../../../bootstrap-design.md), [architecture](../architecture.md), [UX](../ux-design.md), [acceptance plan](../acceptance-test-plan.md), [design review](../design-review.md), [protocol](../agent-protocol.md), [backend brief](developer-backend.md) and [documentation developer brief](developer-docs.md). Inputs are approved revision 1 plus coordinator-only approval/documentation reconciliation; no API/architecture change is authorized here.

## Scope and shared contract

Implement persistent PostgreSQL-only Compose with project name `wealthmesh-v2`, exact PostgreSQL 17 patch/digest, health check, named volume at `/var/lib/postgresql/data`, and `127.0.0.1:5433` binding. Record one nonsecret image reference consumed by backend Testcontainers. Local credentials live in ignored config generated without printing secrets; examples use placeholders. Never reuse sibling DB or implementation.

Implement React/strict TypeScript/Vite app on `127.0.0.1:5173` with `/api` proxy to `127.0.0.1:8080`; API validation and finite timeout stay outside presentation. Use approved ready/loading/unavailable/network error/retry states. The ready screen displays the stored textual installation version from `GET /api/system/status`. Use Vitest/Testing Library/MSW for isolated tests and reject unhandled requests; no MSW in real-system checks.

Implement approved public npm commands, bounded preflight/start/stop and project-owned runtime manifests. Preserve volumes; fail actionable port conflicts without killing unrelated processes; wait for health; clean up only invocation-owned resources after failure; idempotent stop/duplicate-start handling. Resolve Docker access via applicable permissions. Docs viewer runs independently of DB/backend.

Build Playwright real-system E2E using backend's test-owned disposable PostgreSQL/launcher contract, migrations, real Java backend and built frontend on dedicated free loopback ports. Verify isolation with Compose stopped, stored-version/missing-row fixtures only in disposable databases, timeouts and reliable cleanup. Integrate backend loopback/Ryuk checks without disabling cleanup. The acceptance plan's development persistence marker is validation-owned; do not modify/delete dev `setup_version` for tests.

Renderer/overview/requirements snapshot implementation is transferred to the [documentation developer](developer-docs.md) after platform's [confirmed unstarted-work transfer](../platform-implementation.md#proposed-bounded-docs-transfer). Platform retains dependencies/lock/runtime wiring, docs source/build checks and browser automation, operations/demo and integrated evidence. Integrate the docs handoff without editing its owned renderer/snapshot files. Existing approved viewer and immutable text-only snapshot requirements remain unchanged; no finance requirement is implemented by setup.

## Exclusive writing ownership

- `frontend/`, `e2e/`, `scripts/`, `compose.yaml`, root npm workspace/config/lock and nonsecret image metadata.
- Root `.gitignore`; ignored `.runtime/` local credentials/logs/config/process manifests. Add `.tools/` ignores before backend installation. Backend owns only `.tools/java/` and its installer under `backend/`; do not write that toolchain or Gradle files.
- `docs/operations/`, `docs/features/setup/platform-implementation.md`, final integrated `implementation.md` and `demo.md`. The docs developer exclusively owns `docs/.vitepress/`, initial `docs/index.md` and `docs/features/index.md`, `docs/requirements/` snapshots/inventory and `docs-implementation.md`.

Do not edit `backend/`, transferred docs developer files, canonical question/decision/status records, independent reviewer/validator reports, architecture contracts or coding standards. Coordinate backend task names, shared image consumption, fixture lifecycle and docs integration through role-owned Markdown handoffs. Notifications carry paths/readiness only. Do not broadly reformat another role's owned documents/source; record requests for its owner. Platform retains npm manifests/lock and compatible VitePress security override investigation. Implement formatter/lint exclusions for immutable captured source while keeping authored inventory/index checks; coordinate exact paths with docs developer before executing formatting.

## Integration task aliases and output

Root npm aliases delegate Java work to the checked-in backend Gradle wrapper using the backend-published task contract. Proposed mechanical mapping: `test:backend` to backend unit `test`; `test:integration` to backend integration task; `quality` to backend quality tasks plus frontend/docs checks; `test:e2e` invokes the backend fixture launcher through platform orchestration. Confirm exact names in backend handoff before wiring; these implement the approved public commands without a new service/framework choice.

Publish exact stable pins/locks/image, actual commands/results with tested revision/content identity and skips, test-first attestation, all scenario-to-test evidence links, plain-English high-level changes, startup/docs demo and safe troubleshooting/backup/restore reference. Integrated `implementation.md` links backend, platform and documentation developer reports and summarizes final required checks honestly; do not claim independent validation. Build the reviewable working demo before acceptance is requested.

Stop dependent work on ambiguous approved behavior, major architecture/scope changes, unsafe isolation, unavailable prerequisites or inability to complete required checks. Record issues and proposed resolutions in your handoff; useful independent work continues. No routine reapproval gate. No acceptance, hosting, dev volume deletion, broad process kills or network exposure. Stop after integrated delivery; separate independent validator and reviewer sessions follow.
