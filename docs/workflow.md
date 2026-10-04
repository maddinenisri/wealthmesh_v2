# Feature delivery workflow

One feature stays active until accepted or explicitly deferred. The owner chose [D-023](decisions.md#d-023-finish-setup-and-simplify-future-workflow): finish current setup, then use the lighter workflow below for future features. Current setup evidence and targeted corrections are completed without retroactive waivers or infrastructure refactoring.

Future features use one `docs/features/<feature>/index.md`, based on the [feature template](templates/feature-packet.md). UX, architect, developer, validator and reviewer write their owned sections sequentially; the coordinator owns scope/status/assignments and records human decisions. Transfer the writing turn explicitly so one agent writes the file at a time. Separate [questions](questions.md) and [decisions](decisions.md) remain durable registers.

## Feature stages

| Stage                    | Responsible role                   | Required result                                                                                            |
| ------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Scope                    | Coordinator and human              | Bounded capability, source scenario IDs, exclusions, open questions                                        |
| Design                   | UX architect and architect         | Screen behavior, financial rules, API and data proposals, test plan                                        |
| Acceptance test planning | Validator                          | Scenario coverage, expected outcomes, failure cases, and required test layers before coding                |
| Awaiting design review   | Human                              | Explicit approval or requested revisions recorded against the packet revision                              |
| Test and implement       | Developer                          | Meaningful failing tests, working code, passing tests, updated explanations                                |
| Validate                 | Validator                          | Independent execution results, scenario coverage, browser evidence, defects                                |
| Review                   | Reviewer                           | Findings about correctness, maintainability, tests, integrity, and operation                               |
| Awaiting acceptance      | Human                              | Working demonstration and plain-English explanation of high-level implementation changes reviewed together |
| Accepted                 | Coordinator records human decision | Explicit acceptance, tested revision, known limitations, operating guidance                                |

Design can iterate between UX and architecture. The validator prepares an acceptance test plan before coding, using their proposals and the approved source scenarios. Include that plan in the human design review. The developer writes the failing tests and production implementation; the validator independently checks the finished feature. Validation or review findings return work to the developer, followed by the checks affected by the changes. Passing checks do not bypass either human checkpoint.

The developer self-reviews against [coding standards](coding-standards.md), and the reviewer independently checks compliance. Unresolved standards violations prevent an acceptance recommendation. Explain material reuse and design choices in plain English during the feature handover.

## Routine handoff

### Ten-minute assignments

[D-037](decisions.md#d-037-limit-agent-assignments-to-ten-minutes) limits each agent assignment to ten minutes wall clock, not each feature. Put outcome, exclusive scope, start/deadline and command budget in the existing compact assignment. Read the current section/diff and relevant inputs. Check the existing clock at eight minutes if still active; stop safe work by ten and record completed/remaining work, actual commands/exits, pending checks and dirty/resource state. No rolling identical auto-renewals, extra reports, timer tools or notification-only commits. The coordinator narrows/reassesses unfinished work rather than declaring it passed or waiving it.

Budget expensive execution separately and explicitly within a bounded assignment, including startup/cleanup; do not launch a command unlikely to fit the remaining time. Plan safe interruption/cleanup of owned fixtures, preserve unrelated services and report unfinished execution pending. A time limit never removes a required financial or acceptance assertion. [Process comparison](process-improvement.md) distinguishes inspected sources, historical durations and unverified v3 claims.

Skip repeated UX/architect work for a routine change when approved screens/contracts/invariants are unchanged; identify the reused baseline and delta. New/changed design still follows the existing combined approval. Validator/reviewer may inspect stable code in parallel with exclusive scopes; serialize feature-packet writing and shared-output execution, then consolidate findings into one correction batch. Use existing standard commands, purposeful shared UI patterns, an early real vertical slice after approval and one plain-English request-flow guide inside the packet.

### Keep delivery proportional

For a small change, describe the delta against the accepted application rather than redesigning its baseline. Settle material technology choices before coding; reuse the approved Spring Data JPA, exact-money/date rules, fixtures and screen patterns. A new framework or material product decision still follows the existing design checkpoint.

When an original UI is the reference, inspect it read-only and identify the visual target in the existing design review: shell/navigation, typography, spacing, account presentation, forms and mobile behavior. Include annotated representative screens with synthetic data and distinguish unsupported features. Behavior tests and accessibility checks alone do not establish visual quality. An executable prototype still needs scoped authorization; this adds no third human gate.

Independent investigation can overlap implementation once a working vertical slice and stable contract exist. Start the reviewer read-only then, and let the validator inspect scenario-to-test coverage before the final execution pass. Collect required findings together before handing back a correction batch; do not withhold a known issue until another correction has completed. Final independent results/recommendation still refer to the completed code. Separate developer, validator and reviewer sessions, one feature and one Markdown writer remain required.

For a presentation-only correction, reuse the accepted architecture and record that APIs, data and financial invariants are unchanged; do not require another architect handoff without a changed contract. Prepare the affected validator plan with the screen design, then keep one implementation batch and one consolidated independent findings/result section. No commit is needed just to transfer a writing turn.

Use one compact active assignment and current-state summary in the packet. Update them in place rather than adding another repeated handoff for each turn. Each role records its substantive final result once; use a compact finding/resolution table for corrections while retaining actual failures, tested commits and limits. Read the current stage and relevant sections first, not the entire historical packet on every resumption. Preserve FIN-001's existing detailed evidence; this guidance governs future additions rather than erasing its history.

Before checks, select the affected command set from the approved plan and changed risks. Run one developer verification pass and one independent validator pass on stable code; fixes repeat affected checks. Required financial, persistence, accessibility and real-system outcomes remain binding. When fresh execution is needed, invoke the existing forced-execution option directly instead of first running an UP-TO-DATE task and then forcing it. Sequence commands that mutate shared output or temporary MSW tests; use the existing per-fixture preview copies. Do not add custom supervisors, manifests or timing tools.

Before an expensive browser pass, inspect the actual edited diff and rendered styles; automated text replacements can silently miss multiline declarations. Resolve known selector ambiguity against the observed semantic structure, and batch pending presentation changes before the final stable pass. A selector/setup failure is not missing-behavior evidence and must stay distinct from a behavioral failure.

Format owned documentation before a compound quality check. Check documentation at substantive stage boundaries and final delivery, not after every notification. A prose-only update needs relevant documentation checks, not application builds or behavior suites. Code commits identify tested revisions; a writing-turn notification does not by itself require another commit.

The coordinator stays active through authorized implementation, validation and review. Do not end a turn just after launching work and leave completed handoffs waiting for another owner message. Progress updates report a new finding or completed outcome; routine waiting does not need a new report paragraph in the packet. Missing required human decisions still stop dependent work.

Use observed Git milestone intervals and existing command results to discuss time. Distinguish wall-clock intervals, owner wait, environment startup and test execution; do not present unmeasured focused-hour estimates as evidence. Audit avoidable rework without weakening financial integrity, clean-code standards or either human checkpoint.

Update the owned feature section with its result, evidence, unresolved question IDs and next action. Notify only the existing feature document path and stage. The coordinator places each bounded assignment (role, scope/scenario IDs, relevant inputs, allowed changes, required outcome and stop conditions) in the same document. No separate task/report chains are required for future features.

Keep proposals, evidence, and approvals distinct. Chat is for communicating with the owner only. Agents write their assignments, generation plans, architecture changes, technical findings, decisions, handoffs and final evidence in repository Markdown. Agent notifications identify document paths and readiness. The coordinator records consequential human answers and resolves ambiguous feedback before dependent work.

The coordinator maintains canonical status, questions and decisions; no other role infers acceptance. Questions retain stable IDs, owner, status, rationale/options, supplied answer and resulting decision links. Resolved questions remain available. [Setup protocol](features/setup/agent-protocol.md) and its existing reports remain specific to finishing current setup; they are not a paperwork template for future features.

## Testing responsibilities

Domain tests establish calculations, classifications, dates, and invariants without starting containers. Integration tests exercise real PostgreSQL persistence, migrations, constraints, and transaction boundaries through Testcontainers. Development PostgreSQL runs in Compose with persistent storage; container tests use independent disposable databases and never its credentials or URL. Frontend tests use MSW to exercise normal responses, errors, empty results, and loading behavior. Full-system browser tests reach the real backend with mocks disabled and a disposable database.

Use existing scenario tags for traceability. Plan about five behavior-focused acceptance checks: group related meaningful domain, persistence, interaction, error and real-system checks according to actual feature risk. This is a readable acceptance summary, not a test-count cap or a waiver of scenario coverage. Each approved scenario identifies its establishing tests; core journeys need real-system evidence.

The developer follows test-first development, but the owner has selected final test results for the human-facing packet. Do not require the owner to inspect red/green logs for each increment. Final reports must still identify failures and skips honestly.

Use Git commits for tested implementation revisions and reference the requirements snapshot. Record commands, actual results, failures and skips in the feature document; identify any later dirty changes with a diff. No custom fingerprint tooling/manifests are required for future features. Developer checks and independent validator results remain separate sections. Run required checks, then repeat only affected checks when changes/failures justify it.

## Commit messages

Follow [D-024](decisions.md#d-024-explain-feature-outcomes-in-commit-messages): use a descriptive feature-ID title and a short plain-English body explaining the problem, user-visible result and high-level changes, with relevant actual validation. Keep pending acceptance and limits explicit when relevant. Explain the feature rather than listing methods/files; this adds no report or approval gate.

## Human explanation and operation

The human handover includes a working demo and a plain-English explanation of the feature implementation and high-level changes. Explain what the user can now do, what changed in the screen, what the backend does, where information is saved, how key financial rules work, and what final tests verified. Mention remaining limitations explicitly.

For example: "The form sends the account name and starting amount to the backend. The backend checks the entries and saves the account. The account list reads that saved information. A starting amount establishes the balance without counting as income. Tests cover saving, invalid entries, cancellation, and finding the account again."

Keep detailed request flows, code links, data descriptions, and troubleshooting notes in the written feature packet for later reference. A live calculation trace or deliberately reproduced failure and recovery exercise is not a required acceptance step. Offer deeper explanation when the owner requests it.

## Proposed disagreement policy

Missing approved behavior, incorrect calculations, failing required tests, data integrity defects, and missing evidence prevent an agent from recommending acceptance. The developer addresses findings; the validator or reviewer checks the resolution. Product ambiguity returns to the human owner before dependent implementation continues.

After two unsuccessful correction cycles for the same finding, the coordinator should present the evidence and alternatives to the owner. This limit and the optional-cleanup severity policy remain proposals under [Q-002](questions.md#q-002-review-findings-and-disagreement-policy). Existing behavior, integrity, required checks and coding standards remain binding.
