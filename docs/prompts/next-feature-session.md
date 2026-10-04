# Next feature session prompt

Copy everything below **COPY FROM HERE** into a fresh session in this repository. Setup and FIN-001 are accepted; continue from the delivered application rather than rebuilding its first feature.

## COPY FROM HERE

You coordinate the next bounded change to WealthMesh in `/Users/srini/workspace/mdstect_ws/wealthmesh_v2`, origin `https://github.com/maddinenisri/wealthmesh_v2.git`. Financial health only, one household, localhost without login; household members are owners, not authenticated identities. Bind services to loopback and preserve household data.

### Start from actual current state

Inspect Git status/branch/HEAD and read `AGENTS.md`, current sections of `docs/features/household-checking/index.md`, `docs/features/setup/status.md`, `docs/questions.md`, relevant `docs/decisions.md`, `docs/workflow.md`, `docs/agent-roles.md`, `docs/coding-standards.md`, `docs/templates/feature-packet.md`, `docs/process-improvement.md`, `docs/operations/index.md` and `package.json`. Read changed-area source before commands; do not reread every historical report each task. Repository facts supersede this context; do not pin a stale starting hash.

Setup is accepted under D-026. FIN-001 household/checking is accepted under D-032, with modern UI correction accepted under D-036. Reuse actual answers and approvals; do not ask for these again or rebuild FIN-001. The accepted finance baseline uses Java 25/Spring Boot/Spring services/JPA/Hibernate, Flyway and PostgreSQL; setup retains its small JDBC metadata reader. Frontend is React/strict TypeScript/Vite; VitePress renders docs. Persistent development Compose storage and disposable test storage are separate. Do not replace this stack or adopt v3 because its playbook appears shorter.

No next feature is assigned in the present record. Q-004 leaves wider first-release scope open; ask one concise next-capability question only if no newer actual direction exists. Read relevant originals in immutable `docs/requirements/snapshots/2026-10-03-v2/source/` and recommend a narrow dependency-aware slice. Deferred activity, transfers, savings and Update balance are possible future scope, not approved assignments. Record actual choices/product answers in the separate registers; never infer answers from silence. Full original completion requires every original assertion, separately from acceptance of a partial feature. Preserve originals/inventory and sibling projects read-only.

### Timebox and communicate

Every role assignment has a maximum ten-minute wall-clock budget under D-037. Record outcome, feature/scenario IDs, inputs, permitted/exclusive files, required section, start/deadline from the existing clock, command budget and stop conditions in the single feature packet. If still active, check at eight minutes and stop safe work by ten. Leave completed/remaining work, actual commands/exits/skips, pending checks and dirty/resource state. No identical rolling auto-renewals: coordinator narrows or reassesses remaining work. Budget expensive commands explicitly, including startup/cleanup; do not launch one unlikely to fit. Unfinished checks stay pending, with safe owned-fixture cleanup. Do not add timer tools or kill unrelated services.

Use one active feature and one `docs/features/<slug>/index.md` based on the template, with sequential role-owned sections. Root coordinates and chats with the human; actual role agents work in separate sessions. Transfer the writing turn explicitly. Tool notifications contain path/stage only; substantive results remain in the packet. Keep questions/decisions separate. No per-role report chains, fingerprint manifests, custom supervisors, infrastructure rebuilds or commits just to notify a writing turn. Preserve unrelated dirty work and existing services.

### Design and first human checkpoint

For a new feature, run UX architect → architect → validator acceptance plan → concrete combined human design approval. UX defines screens/states/accessibility and annotated visual targets with synthetic data; reference the accepted modern workspace and shared UI patterns. Architect explains financial invariants, request/data/transaction/error contracts and costs. Keep one short request-flow guide in the packet. Validator maps about five acceptance groups to meaningful domain, persistence, UI, error and real-system tests before coding; five groups are not a coverage/test cap.

Reuse unchanged approved UX/architecture for routine changes and describe the delta instead of repeating handoffs. New/changed design still needs the existing concrete review; no third gate. Prototype execution needs scoped authorization. Major services/frameworks/providers/security/deployment additions require concrete alternatives and human review; routine approved details are autonomous. Stop dependent production changes until actual design approval is recorded.

### Implement, independently validate and review

After approval, developer uses genuine test-first behavior tests → minimal coherent implementation → refactor with passing tests. A setup failure is not missing behavior. Show an early real vertical slice before multiplying forms. Human receives final results, not increment logs. Enforce SRP, authoritative DRY financial rules, guard clauses, composition and purposeful reuse/patterns; review nesting above two levels, complexity above ten and methods above forty meaningful lines. Exact money, dates, currency, constraints and atomic transactions stay authoritative in the backend; no speculative abstractions or financial waivers.

Separate validator/reviewer independently check stable finished code; neither accepts it for the owner. They may investigate concurrently with exclusive scopes, while packet writes and commands sharing outputs remain sequential. Consolidate known findings into one correction batch; return fixes to developer and rerun affected independent checks. Preserve earlier evidence for unchanged areas and actual historical failures.

Select existing commands by changed risk and approved plan:

| Need                     | Existing command                                                               |
| ------------------------ | ------------------------------------------------------------------------------ |
| Prerequisite/status/demo | `/bin/sh scripts/preflight.sh`; `npm run status`; `npm run dev` only if needed |
| Backend/domain/database  | `npm run test:backend`; `npm run test:integration`                             |
| Isolated UI              | `npm run test:frontend`; `npm run typecheck --workspace frontend`              |
| Real system              | `npm run test:e2e` or existing affected-suite selection                        |
| Quality/build            | Relevant subcommands; `npm run quality` / `npm run build` when justified       |
| Authored Markdown        | Affected formatting/lint/link/diff checks; no services or behavior suites      |

Testcontainers uses disposable PostgreSQL, MSW isolates frontend tests, and real E2E reaches Java/PostgreSQL with mocks disabled. Add feature-specific E2E assertions/fixtures; setup-only E2E cannot establish new finance behavior. Never use development storage/credentials for tests or reset its volume. Use synthetic data, protect secrets and proper sandbox escalation. Record actual exits, failures/skips and tested Git commits; unfinished/unexecuted checks cannot pass. Avoid repeated historical full suites; changed risks still require checks.

### Handover, acceptance and resume

Commit tested revisions with D-024 descriptive feature-ID titles and concise plain-English purpose/result/high-level changes plus actual validation/limits. Inspect staged paths, respect ignored files, preserve unrelated changes and existing Git identity. Push normally to origin under standing authorization once reviewed; no force/history rewrite. A push is not acceptance.

Provide a working synthetic demo and plain-English explanation of screens, backend rules/storage, changed behavior and troubleshooting. Example: “You can now record the selected financial action. Java validates and saves it atomically; the summary reads saved amounts. Independent checks covered the real save/reload journey and invalid inputs. These listed capabilities remain deferred.” Supply actual feature-specific evidence, not a mechanically filled example.

Stop for the second human checkpoint after required independent evidence, review, demo and operating explanation are complete. Record the actual answer; agents/tests cannot accept. At a timebox stop, resume from compact remaining-work state in the same packet under a reassessed assignment. Preserve accepted FIN-001 history, source-coverage boundaries and prior actual decisions.
