# SETUP-001 documentation developer assignment

Sender: coordinator. Recipient: separate documentation developer session. Date: October 3, 2026. Status: authorized under owner-approved setup packet revision 1. This bounded transfer takes effect when this brief is published and coordinator notifies the receiving sessions. Cases: `SETUP-AC-12`, `SETUP-AC-13`, documentation contributions to `SETUP-AC-14`–`SETUP-AC-17`; read all cases for shared constraints. Finance scenarios: none.

## Approved inputs and transfer basis

Read `AGENTS.md`, [approved packet](../index.md), [canonical approval/status](../status.md), [D-022](../../../decisions.md#d-022-setup-design-approval), [questions](../../../questions.md), [architecture](../architecture.md), [UX](../ux-design.md), [bootstrap contract](../../../bootstrap-design.md), [standards](../../../coding-standards.md), [acceptance plan](../acceptance-test-plan.md), [design review](../design-review.md), [communication protocol](../agent-protocol.md), [platform brief](developer-platform.md) and [platform's proposed bounded docs transfer](../platform-implementation.md#proposed-bounded-docs-transfer).

Platform confirms the transferred renderer/overview/snapshot implementation is unstarted; directories exist only. This assigns part of the current approved feature to a separate developer session, with no new technology, behavior or human checkpoint.

## Exclusive writing ownership

- `docs/.vitepress/`: viewer configuration, theme/renderer and docs-owned tests/config within that directory.
- `docs/index.md` and `docs/features/index.md`: initial reader overview/index pages; link canonical approval/status and separate questions/decisions instead of copying approval facts.
- `docs/requirements/`: immutable text-only source snapshots, capture provenance and scenario inventory/current index.
- `docs/features/setup/docs-implementation.md`: your role-owned findings, dependencies, test evidence, integration requests and handoff.

Platform retains all npm manifests/lock, `scripts/` (including document checks/browser automation), `.runtime/`, root `.gitignore`, operations guides and integrated `implementation.md`/`demo.md`. Backend retains backend/toolchain ownership. Do not edit another role's files, architecture contracts, independent reports, coding standards, coordinator question/decision/status records or sibling source. Needed npm aliases/test-script changes/ignore rules are requested in your Markdown handoff; platform makes them. Notifications carry paths/readiness only.

## Dependencies and renderer contract

Dependencies are already installed and pinned by platform: VitePress 1.6.4, Vue 3.5.43, Mermaid 12.1.0. Use them without modifying npm or installing a replacement. Build command is `vitepress build docs`; use the installed executable through the platform's root task/runtime entry point. Loopback VitePress dev runs through root runtime and must stay independently usable with Java/PostgreSQL stopped.

Implement the approved Markdown hook and local Vue Mermaid renderer, client render after mount, `securityLevel: strict`, local assets, visible invalid-source error/source fallback, adjacent plain-English diagram explanation and original source access. Keep ordinary content readable on diagram failure; expose canonical Markdown paths and copyable source-code paths/line numbers rather than pretending an arbitrary browser link opens disk code.

Implement local search, saved-Markdown/search refresh, navigation to role/tasks/handoffs/status/architecture/plan/operations and separate canonical questions/decisions, accessible headings/keyboard/focus/narrow viewport and understandable missing-page/empty search states. Source is repository Markdown directly; no editor, approval button, agent controls or inferred status. Restrict development filesystem access dynamically to the docs source and required installed runtime assets; do not expose local secrets/runtime or arbitrary filesystem paths.

VitePress currently inherits advisories in its Vite 5 subtree, with no compatible stable VitePress patch available according to platform's dated investigation. Platform owns compatible security override investigation and mitigation/limitation evidence. Read its later handoff before final build evidence; do not override dependencies or approved baseline yourself, and never claim the security issue is resolved without evidence.

## Text-only requirements snapshot contract

Read only `../wealthmesh/docs/requirements/v2`; copy requirement text into an immutable dated snapshot under the assigned `docs/requirements/` path. Record exact source revision when available, capture time, dirty/untracked source state, source path, per-file SHA-256, `.feature` count, scenario IDs/tags, duplicates/missing IDs and inclusion/defer inventory with honest reasons. Source revision alone does not identify dirty/untracked text. Claim no finance requirements completed; future release scope remains Q-004. Do not mutate sibling files or import implementation.

Original captured Markdown/text must remain byte-faithful and excluded from formatting/lint; current authored inventory/indexes remain checked. Coordinate the exact snapshot path and exclusions with platform in your handoff before its checks/formatter run. Immutable source must not be silently rewritten to satisfy document style checks. Later source changes require a new snapshot/comparison rather than replacement.

## Tests, evidence and integration output

Follow meaningful test-first implementation for new renderer behavior; test files may live only in your owned directory. Request necessary root check/test wiring in your handoff before platform integration. Build docs and record actual commands/results, tested content identity, skips and limitations. Platform owns browser automation; publish renderer paths/source conventions, search/navigation/security details, snapshot inventory/checksums and explicit checks platform/validator still need to run. Do not report unexecuted UI checks as passing or duplicate independent validator authorship.

Handoff provides a plain-English explanation of what the viewer/snapshot adds, approved design alignment, test-first attestation, exact inputs/dependencies, actual final results and platform integration requests. Platform integrates your report with backend/platform evidence and supplies operating/demo guidance. Independent validator/reviewer sessions follow integrated delivery before human acceptance.

## Stop conditions

Stop dependent work on ambiguous approved behavior, material scope/technology change, unsafe filesystem access, unavailable prerequisite or failed mandatory check. Record issue and proposed resolution in your handoff; authorized independent work may continue. No new routine design approval request, publishing, server exposure beyond loopback, real financial data, secrets in Markdown, acceptance claim or modifications to independent reports. Stop after your bounded delivery and notify readiness using artifact paths.
