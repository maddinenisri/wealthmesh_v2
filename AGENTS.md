# WealthMesh v2 agent instructions

## Confirmed scope

- Build a greenfield household finance application in this repository.
- Financial health is in scope; physical and medical health tracking is excluded. Financial healthcare expenses and HSA accounts remain finance features.
- The MVP runs on this computer through localhost, without login. Household members are account owners, not authenticated users.
- Bind development services to loopback. Do not publish or expose them to the home network without a new explicit decision.
- Treat `../wealthmesh/docs/requirements/v2` as source material. Do not mutate the sibling project or import its implementation by default.
- Backend: Java 25. Development database: PostgreSQL through Docker Compose, with persistent project-owned storage. Integration testing: Testcontainers with independent disposable PostgreSQL. Frontend network mocks: MSW. Include real-system E2E tests with mocks disabled and a disposable database.

## Human checkpoints

The human owner requires review before implementation and before feature acceptance. Planning, investigation, screen proposals, API specifications, test plans, and documentation drafts may proceed before design approval. Production implementation starts only after an explicit approval of the concrete design packet. Silence is not approval.

Project setup follows the same checkpoints. Present the setup design before implementing its application skeleton, executable tooling, or documentation server. Prototype scope may be included in that concrete design review; do not create an additional mandatory human checkpoint. An executable prototype before the design approval needs explicitly scoped authorization.

Do not ask again about already approved routine work. After approval, complete implementation, validation, review, and the demonstration packet before requesting acceptance. Explicit deployment requests are governed by their own authorization; feature acceptance alone does not publish the application.

## Agent execution

Use separate sessions for developer, validator, and reviewer, and work on one feature at a time. Role contracts are drafted in `docs/agent-roles.md`; unresolved choices live in `docs/questions.md`, and actual human decisions live in `docs/decisions.md`.

Assign bounded tasks with a feature ID, scenario IDs, approved scope, relevant input files, permitted changes, required output, and stop conditions. Do not launch an implementation agent before design approval. A reviewer must not approve implementation it authored.

The owner chose to finish current setup and use a lighter workflow going forward (D-023). For future features, place bounded assignments, scope/status, design, test plan, implementation, validation/review and operating explanation in one `docs/features/<feature>/index.md`. Roles write their owned sections sequentially with one active writer. Retain separate role sessions, one feature at a time and both human checkpoints; no extra per-role task/report chains are required.

The validator prepares the acceptance test plan before coding, and the human reviews it with the design. The developer writes the failing tests and implementation. The validator independently validates the finished feature afterward.

Agents may investigate independent parts of the current feature concurrently after their inputs are ready. Avoid concurrent writes to the same files. The coordinator alone maintains feature status, the question register and the decision record; it cannot supply human approval.

## Test driven development and evidence

For behavior changes, add a meaningful failing test before production code, implement the smallest coherent change, then refactor with tests passing. A setup failure is not evidence that behavior is missing. The owner wants final test results only in the human-facing packet; do not require live red/green demonstrations or a per-increment failure log. This reporting preference does not remove test-first development.

Integration tests must use the production database engine through Testcontainers. Full-system E2E tests must reach the real Java backend and a disposable database, with MSW disabled. MSW is for frontend isolation and clearly identified mock demonstrations.

Record commands, results, tested revision, and any skips. Never report an unexecuted check as passing. Relevant changes invalidate earlier validation evidence. Do not weaken requirements, assertions, or mandatory checks to obtain a passing result. Report a flawed test and its proposed correction explicitly.

For future features, identify tested revisions with Git commits; record any later dirty changes with a diff. Custom fingerprint tooling/manifests are not required. Group acceptance into roughly five behavior-focused checks with meaningful underlying domain/integration/UI/error/E2E tests; do not cap test count or waive scenario coverage. Repeat affected checks when changes/failures justify it. Current setup retains truthful existing evidence and targeted VD-01 correction, cleanup/restored demo and concise final actual results, with no retroactive waiver or infrastructure refactor.

Use synthetic household data in tests, screenshots, and demonstrations. Explain money rules and rounding choices before implementing them.

Commit messages must use a descriptive feature-ID title and a short plain-English body explaining the problem, user-visible result and high-level changes, with relevant actual validation (D-024). Keep pending human acceptance and limits explicit when relevant; avoid method/file inventories or unexecuted pass claims. No additional report or approval gate is required.

## Architect authority

The architect may choose routine details within the approved baseline. Major additions require human review before implementation: new deployable services, message brokers, external providers, replacement frameworks or databases, and material security or deployment changes. Present the concrete need, alternatives, and operational cost. Setup packet revision 1, including the baseline in `docs/bootstrap-design.md`, was approved by the owner on October 3, 2026; canonical approval and acceptance facts are in `docs/features/setup/status.md`.

## Coding standards

Follow `docs/coding-standards.md` for production code and tests. Methods must have one coherent responsibility. Keep authoritative business rules DRY, favor purposeful component reuse and composition, and choose design patterns only for demonstrated needs. Use guard clauses and cohesive collaborators to avoid complex nested conditions.

The reviewer must check compliance before recommending acceptance. Standards violations require correction; justified exceptions to mechanical thresholds must be narrow and recorded. Financial invariants and approved behavior cannot be waived through a coding exception. Configure automated quality checks during approved setup and report which standards remain manual review responsibilities.

## Durable communication

Chat is for communication with the human owner only. Agents write generation plans, architecture changes, decisions, bounded task briefs, role handoffs, feature explanations, final evidence, and operational guidance in repository Markdown. Agent tool messages may notify readiness and artifact paths; substantive technical discussions belong in the written artifacts. The coordinator records consequential human answers in the feature packet or decision record. Do not store private reasoning transcripts, secrets, or real financial records.

Future routine handoffs notify the existing feature document path and stage; substantive results remain in sequential role-owned sections there. The coordinator alone maintains canonical status and question/decision records; recipients read source approvals rather than copying facts. Current setup retains its existing assignments/handoffs under `docs/features/setup/agent-protocol.md` through completion; do not extend that report chain to future features.

Human feature handover requires a working demo and a plain-English explanation of the implementation and high-level changes. Keep technical traces and troubleshooting guidance in the written packet as reference. Do not require live calculation traces or failure and recovery exercises unless the owner requests them.

Separate implemented behavior from proposals and limitations. Link a scenario to its test evidence and relevant code. A feature cannot be accepted by an agent, by a passing test suite alone, or by changing a status field.
