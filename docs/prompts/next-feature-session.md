# FIN-002 next-session prompt

Copy below **COPY FROM HERE** into a new session in this repository. This prepares the concrete design for [FIN-002 received salary into checking](../features/checking-income/index.md); it does not authorize implementation.

## COPY FROM HERE

Coordinate FIN-002, “Record received salary into checking”, in `/Users/srini/workspace/mdstect_ws/wealthmesh_v2`, origin `https://github.com/maddinenisri/wealthmesh_v2.git`. The owner requested preparation so execution can be observed in a new session (D-038). The recommendation is packaged; do not restart a generic feature-choice interview. Concrete design, implementation and acceptance remain pending.

### Establish facts and bounded assignments

Check current Git status/HEAD; preserve unrelated changes, running services and household records. Read `AGENTS.md`, `docs/features/checking-income/index.md`, relevant `docs/questions.md`/`docs/decisions.md` (D-023/D-024/D-037/D-038, Q-013), current FIN-001 final status, `docs/workflow.md`, `docs/agent-roles.md`, `docs/coding-standards.md`, `docs/templates/feature-packet.md`, `docs/operations/index.md` and `package.json`. Use current sections and changed-area source, not repeated full historical reads. Current repository facts supersede this prompt; no fixed starting commit.

Setup and FIN-001/modern UI are accepted under D-026/D-032/D-036. Reuse actual approvals, amount/date policies and modern UI; do not rebuild or reapprove them. Keep Java 25/Spring Boot/services/JPA/Hibernate/Flyway/PostgreSQL, React/TypeScript/Vite and VitePress. Localhost only, no login or new infrastructure. Persistent development storage is never test storage. Siblings, including v3, remain read-only.

Use ONE FIN-002 packet with role-owned sequential sections and one Markdown writer; keep questions/decisions separate. Delegate actual separate role sessions, root coordinating human chat. Spawn fresh roles with `fork_turns="none"` and a self-contained bounded brief pointing to the packet's current assignment, relevant files and recorded approvals; do not pass the full historical conversation. Linked repository decisions preserve authoritative context. Assign one outcome, inputs, exclusive scope, required section, start/deadline using the existing clock, selected command budget and stop conditions. Every assignment is at most ten minutes including reads/tool waits/commands/reporting. Check at eight minutes if still active; stop safely by ten with completed/remaining/commands/resource/dirty state. Record measured times in the packet ledger, leave planned times blank and measure human-review waits separately. No identical auto-renewals, invented completion, extra timing tools, report chains or notification-only commits. Narrow/reassess unfinished work; budget long checks explicitly and mark them pending if unfinished.

### Produce design deltas, then stop for approval

Read the immutable originals linked in the packet: `spending/income/record-income.feature`, checking `setup.feature` and `activity.feature`. Focus on V2_INCOME_001/005; CHECKING_002 supplies deferred salary clauses, CHECKING_007 is partial context, and INCOME_006 future prevention is adapted/partial with reminder deferred. Full source completion requires every ORIGINAL assertion. Income-only summary leaves spending/net clauses deferred; do not manufacture zero expense/net data or mark partial originals complete. No global completion changes during planning.

Run sequential bounded design assignments:

Start from the packet's compact clause/gap/task/test-level table, order tasks by actual dependencies and refine only the changed Salary contract. Use its accepted FIN-001 and runbook pointers instead of ceremonial baseline redesign. The table supports the existing combined UX/technical/pre-code-plan approval, not a replacement task-list-only gate. Explain unsettled choices with concrete examples. Board statuses and scenario-ID citations are traceability, not proof of every assertion; never automatically defer a mandatory approved check. Keep one consolidated independent finding batch. Add a short retro to the existing process record only for a demonstrated repeated problem, with a reusable fix.

1. UX architect: existing checking detail → positive Salary/amount/date/account/entered-by → review/confirm/cancel → activity/entry/month navigation. Reuse accepted workspace/form/error patterns; specify retained drafts, pending/error/focus states and honest deferred actions. No executable prototype now.
2. Architect: salary-only API/storage/service/transaction/read delta and one plain-English request-flow guide. Propose amount/result/aggregate overflow rules, concurrent/replayed confirmation without double credit, entered-by versus owner, preserved opening/date semantics and tracking-start/today/no-future policy. Avoid speculative whole-ledger design. Reuse exact USD/no-rounding/date/JPA baseline.
3. Validator: refine about five draft groups before coding, map exact source/adapted assertions and Testcontainers/MSW/real E2E boundaries. Groups are not a coverage cap.

Resolve only concrete Q-013 product questions after presenting their implications; record actual answers, never silence. Present the combined UX/technical/acceptance-plan packet and **stop for explicit human design approval**. Packaging direction is not that approval. Major framework/service/security changes need concrete review; unchanged baseline work needs no repeated role handoff.

### After actual approval

Developer uses meaningful failing behavior tests → minimal implementation → refactor. First deliver a tested real confirm→persist→reload vertical slice; then narrow validation/read-view increments. Enforce SRP, DRY backend invariants, guard clauses, purposeful composition/reuse and existing complexity/nesting/method review thresholds. No floating-point money, speculative abstractions or weakened assertions. Human sees final results rather than per-increment logs.

Separate independent validator/reviewer may investigate stable code concurrently with exclusive scopes; serialize packet writes and commands sharing outputs. Batch known findings, return corrections to developer, rerun affected independent checks and retain unchanged historical evidence. Use synthetic data and disposable Testcontainers PostgreSQL; MSW isolates UI, while feature-specific real E2E reaches Java/PostgreSQL with mocks disabled. Setup-only tests cannot establish Salary behavior. No development DB tests, volume resets, secrets or unrelated service interruption.

Select existing affected commands from `package.json`/operations: `npm run test:backend`, `test:integration`, `test:frontend`, `test:e2e`, and relevant quality/build/typecheck subcommands. Do not run all historical setup checks by default. Scope/budget before execution; record actual commands/exits/skips/tested commits, not proposed passes. Documentation-only work needs affected Markdown checks, no services. Use proper sandbox escalation when required.

Commit tested revisions with FIN-002 purpose/result/high-level-change messages and actual validation/limits (D-024). Inspect staged paths and ignored files; preserve unrelated work and existing Git identity. Push normally under standing authorization, never force; push is not acceptance.

### Observable handover and stop conditions

Process success means recorded deadline adherence, actual bounded outcomes, no repeated baseline reads/review loops, consolidated corrections and complete truthful evidence; no total-feature duration guarantee. Resume unfinished work from the same compact packet state under a reassessed assignment.

Before the second checkpoint, provide independent results/reviewer recommendation, working synthetic demo and plain-English flow/storage/troubleshooting explanation. Expected journey: opening `$5,000.00` plus confirmed received Salary `$6,000.00` → `$11,000.00` across saved checking views after reload, with `$6,000.00` month income and inspectable date/account/entered-by; opening excluded. Explain partial/deferred spending/reminders/corrections rather than claiming them. Human acceptance requires the actual answer; agents/tests cannot supply it. In this new session's first phase, stop at the concrete combined DESIGN review.
