# SETUP-001 agent communication and ownership

Confirmed human preference: chat is for communication with the owner. Generation plans, architecture changes, bounded role tasks, handoffs, evidence, and explanations are written by agents in repository Markdown. Save decisions and useful technical rationale, not private reasoning transcripts or secrets.

## Durable assignment and handoff rules

Before launching work, the coordinator supplies a Markdown task path identifying feature ID, scenario IDs or source applicability, approved scope, exact inputs and their revision, permitted changes, required output, recipient, and stop conditions. A notification may carry the path; it must not substitute an undocumented architecture discussion for the file.

The receiving agent reads its brief and relevant instructions before work. It writes consequential findings in its permitted artifact, then sends a short readiness/path notification. If a missing decision blocks dependent work, write the question, need, alternatives, and effect in the handoff for the coordinator to communicate to the owner. The coordinator maintains separate [questions](../../questions.md) with stable IDs and [actual human decisions](../../decisions.md); resolved questions link to the decision rather than disappearing. Independent authorized investigation may continue.

At handoff, record sender/receiver, task IDs, approved scope, input/output revisions, changes and why, evidence (or explicitly not run), findings and responsible role, and next action. Plans name intended commands; evidence names actual executed commands/results. Never convert a proposal or an agent recommendation into human approval.

## Canonical ownership

| Artifact | Owner and allowed writers |
| --- | --- |
| `status.md`, project/feature index, `../../questions.md`, `../../decisions.md` | Coordinator; initial architect design draft supplied for coordinator reconciliation; documentation developer creates only initial `docs/index.md` and `docs/features/index.md` within its brief |
| `architecture.md`, `../../bootstrap-design.md`, `architecture-handoff.md` | Architect |
| `ux-design.md`, `ux-handoff.md` | UX architect |
| `acceptance-test-plan.md`, `validator-handoff.md`, later `validation.md` | Validator |
| `design-review.md`, `reviewer-handoff.md`, later `review.md` | Reviewer |
| `implementation.md`, `demo.md`, later operations guides and source code | Developer, now authorized by recorded revision 1 design approval; see bounded backend/platform/documentation ownership below |
| `tasks/*.md` | Coordinator assigns and updates; architect supplies initial proposed task briefs |
| Human approval/acceptance fields | Coordinator records the owner's actual words, packet revision, date, and requested changes |

Do not edit a role's report to remove its findings. Write a resolution in the responsible artifact; the finding author records checked closure. Avoid concurrent writes to the same file. Required work stays on the current feature; parallel work is limited to independent tasks whose inputs are ready.

## Order and session separation

1. Coordinator scopes setup and drafts role task briefs.
2. UX and architect draft their bounded designs; reconcile shared contracts in Markdown.
3. Validator writes the acceptance plan before coding. Independent design review checks feasibility; it adds no human approval gate.
4. Human reviews the concrete packet and plan. Coordinator records explicit design approval or requested revisions.
5. Developer in its own session implements through test-first development and supplies final results, demo, explanations, and operating guidance.
6. Validator in a separate session independently executes the approved plan; developer corrects defects and affected checks rerun.
7. Reviewer in a separate session checks implementation it did not author; resolved findings receive verification.
8. Human sees the working demo and high-level explanation, then accepts or requests changes. Coordinator records that decision.

Only the two human checkpoints are mandatory. Routine details within the approved baseline do not need repeated permission. Material scope or architecture changes follow the existing architect-authority rule and return to the current design review as needed.

## Current task briefs

- [Architect design](tasks/architect-design.md)
- [UX design](tasks/ux-design.md)
- [Validator planning and later independent validation](tasks/validator.md)
- [Developer implementation, authorized](tasks/developer.md)
- [Backend developer implementation](tasks/developer-backend.md)
- [Platform/frontend developer implementation](tasks/developer-platform.md)
- [Documentation developer implementation](tasks/developer-docs.md)
- [Coordinator documentation reconciliation](tasks/coordinator.md)
- [Reviewer design and later implementation review](tasks/reviewer.md)

The [setup packet](index.md) is the human entry point; [status](status.md) is canonical. The approved implementation will add `docs/index.md` as the reader start page and `docs/features/index.md` as the feature index. They link to current packet/status instead of copying approval facts. Until the viewer exists, repository Markdown links provide review access.

## Approved implementation assignment split

Backend, platform and documentation are bounded developer sessions for the same `SETUP-001` feature. They may proceed on independent owned files after reading the approved contract; no second feature, new architecture or human checkpoint is introduced. Integration requests are written in their role-owned Markdown handoffs; notifications carry document paths/readiness only.

Backend owns `backend/`, Gradle wrapper/build/tasks, Java 25 toolchain installation under ignored `.tools/java/`, and `backend-implementation.md`. Platform owns frontend/E2E/orchestration, Compose/image record, npm workspace/lock, operations/demo and `platform-implementation.md`. Platform alone owns root `.gitignore`, generated `.runtime/` local configuration/logs/process manifests, scripts including document checks/browser automation, and final `implementation.md` integration summary. Backend requests ignored entries or integration task changes in its handoff and does not edit those shared files. Backend's toolchain installer lives under `backend/`; platform scripts may invoke it rather than compete for `scripts/` ownership.

Documentation developer exclusively owns `docs/.vitepress/`, initial `docs/index.md`, initial `docs/features/index.md`, `docs/requirements/` and `docs-implementation.md`, transferred from platform's confirmed unstarted implementation on October 3, 2026. [Transfer brief](tasks/developer-docs.md) records the exact existing dependency/command contract. Docs developer requests npm/task/security-override, runtime and browser-check changes through its handoff; platform retains those files and investigation. Original captured requirement text stays byte-faithful and excluded from formatting/lint; authored current indexes/inventory remain checked. Coordinate exclusions in Markdown before formatting.

The approved [architecture](architecture.md) remains the source of truth for API, migration, image equality, loopback and test isolation. Platform records the chosen exact PostgreSQL image reference; backend consumes it for Testcontainers without reading development database credentials. Backend publishes wrapper task and E2E fixture-launch/cleanup instructions in its handoff. Root npm aliases delegate to those backend tasks; platform owns aliases and full-system orchestration. Agent details must preserve the approved public command contract.

Independent validator and reviewer sessions follow integrated implementation. They do not inherit implementation authorship, and their historical design handoffs remain unchanged. All required checks and the working-demo/explanation packet precede the second human checkpoint.
