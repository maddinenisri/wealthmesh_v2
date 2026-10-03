# Agent responsibilities and boundaries

These contracts are drafts for discussion. Confirmed workflow decisions are binding through `AGENTS.md`; the remaining responsibilities and escalation rules below are recommendations.

For future features, all roles write sequential owned sections in one feature document; one agent writes at a time. Chat is for the owner. Routine notifications carry the feature path and stage, with no additional report/task chain. Coordinator maintains status and separate questions/decisions. [D-023](decisions.md#d-023-finish-setup-and-simplify-future-workflow) retains separate sessions, one feature and two human checkpoints. [Setup protocol](features/setup/agent-protocol.md) remains for current setup completion only.

## Coordinator

Maintain scope/status/assignments in the single feature document, source traceability, [questions](questions.md), [human decisions](decisions.md), and stage transitions. Provide bounded work and approved inputs in that document; coordinate sequential writing turns and surface conflicting assumptions.

The coordinator can organize work and request clarifications. It cannot approve designs or acceptance for the human, invent missing requirements, or describe an unexecuted check as passing.

## UX architect

Translate approved scenarios into a user journey, navigation, screen states, labels, validation messages, and accessible interactions. Include success, cancellation, empty, loading, and failure states when relevant. Explain how summary amounts lead to their supporting details.

Deliver a reviewable UX proposal and a list of unresolved product questions. Recommend annotated screens covering wording/states and a clickable experience. Setup uses annotated design now and the working viewer after approval. Prototype scope can be included in the existing design checkpoint; no third mandatory human checkpoint is added. Do not change financial semantics or treat an attractive mock as proof that the backend works.

## Architect

Define financial invariants, domain boundaries, API contracts, persistence, migrations, transaction handling, observability, and error behavior. Explain the request flow and the cost of significant alternatives. Coordinate with UX when data availability affects the screen design.

Deliver the technical proposal, a concise decision record for consequential choices, and implementation boundaries. Prefer a small system the owner can operate. The owner permits routine choices within the approved baseline. Major infrastructure or dependency additions require human review with the need, alternatives, and operational cost; see `AGENTS.md`. Setup revision 1's baseline is approved; use [canonical status](features/setup/status.md) for the recorded approval.

Apply [coding standards](coding-standards.md) when defining authoritative financial rules, domain boundaries, reusable components, and abstractions. Explain why any material design pattern is useful for the current requirement.

## Developer

Implement the approved feature through failing behavior tests, minimal working code, and refactoring. Keep API behavior and MSW handlers aligned with the approved contract. Update explanations and troubleshooting notes with code changes.

Deliver code, final test results, and a demonstration path. The owner wants final results rather than live or recorded per-increment red/green demonstrations; still write and execute meaningful failing tests before production implementation. Do not silently weaken assertions, rewrite product rules, add infrastructure outside the agreed baseline, or accept the feature.

Follow [coding standards](coding-standards.md) and self-review responsibility, duplication, nesting, reuse, and error handling before handoff. Keep methods cohesive and financial rules authoritative.

## Validator

Before coding, prepare the acceptance test plan from the scenario IDs, UX proposal, and technical proposal. Identify expected outcomes, boundary and failure cases, and required test layers. Bring missing or ambiguous requirements to the coordinator for resolution before dependent coding begins. The developer remains responsible for writing failing implementation tests.

After implementation, independently check the approved scenarios against the feature. Run required tests, exercise the UI and failure paths, inspect persistence where relevant, and report reproducible defects. Separate mocked UI evidence from real-system evidence.

Deliver the initial acceptance test plan, then commands and results tied to the tested revision, scenario coverage, screenshots or traces, and defect reports. Do not quietly repair production code or accept a developer's reported result without verifying required checks.

For future features, own the test-plan and validation sections in the same feature document. Group acceptance into about five behavior-focused checks without reducing meaningful tests/scenario coverage. Use the tested Git commit; no extra validation-report chain or fingerprint tooling is required.

## Reviewer

Review the implementation, test quality, financial integrity, architecture adherence, readability, migrations, and troubleshooting guide. Distinguish blocking defects from suggestions and explain each finding with evidence.

Enforce [coding standards](coding-standards.md), including single-responsibility methods, DRY business rules, purposeful reuse and patterns, and simple control flow. Established standards violations require correction before an acceptance recommendation. Record any justified exception to a mechanical threshold. The general handling of optional improvements remains an open decision.

Deliver findings, checked resolutions, and an acceptance recommendation. Do not approve code authored in the reviewer session or turn a recommendation into human acceptance. The owner must still see the working behavior and explanation. Severity and waiver policies remain open.

## Human product owner

Choose scope, resolve product ambiguity, review design before implementation, and review the working feature before acceptance. Decide whether the explanation provides enough understanding to operate the system. A requested change must be recorded with its effect on scope and tests.

The coordinator should present a concrete decision and its consequences instead of asking the owner to manage routine agent mechanics. At acceptance, provide a working demo and explain the feature implementation and high-level changes in plain English. Detailed diagnostic walkthroughs are optional rather than required human exercises.
