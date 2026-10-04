# Feature review packet template

Use one `docs/features/<feature>/index.md` for each future feature. Roles write their sections sequentially, with one active writer. Keep questions/actual decisions in their separate registers. No additional per-role report/task chain or fingerprint tooling is required; current setup retains its existing evidence.

## Identity and status

Coordinator owns: feature ID, title, current stage, source snapshot/scenario IDs, human decisions and tested Git commit. Place bounded role assignments and next stage here (scope, inputs, allowed changes, output and stop conditions).

Each focused assignment includes start/deadline from the existing clock, at most ten minutes wall clock, exclusive ownership and an explicit command budget. Check at eight minutes if still running and stop safely by ten; update completed/remaining work, actual commands/exits, pending checks and dirty/resource state here. Reassess remaining scope, with no automatic identical renewals or new timing tools. Reuse unchanged approved UX/architecture; allow independent stable-code investigation in parallel while serializing packet writes/shared-output execution. Consolidate correction batches and select affected checks without waiving requirements.

## Behavior and scope

What the household can do, a concrete example, expected results, excluded behavior, and links to stable question IDs in `docs/questions.md`. Link actual supplied human answers to `docs/decisions.md`; do not duplicate unanswered alternatives as decisions.

## User experience proposal

UX architect owns: journey, screens, validation, loading/empty/failure states, accessibility and sketches/prototype references. When an existing application is the visual reference, name the inspected screens and show annotated desktop/mobile targets in this same design review. Specify the shell, typography, spacing, list/form presentation and unsupported actions. Functional test success is not visual approval; executable prototype scope must be authorized.

## Technical proposal

Architect owns: financial rules, request flow, API/data contract, migrations, transaction boundaries, failure handling and decisions requiring human review.

Keep one concise plain-English request-flow guide here: screen → request → service/rule → transaction/storage → response/error, with relevant source links. Reuse the accepted baseline and shared UI patterns purposefully; demonstrate an early real vertical slice after approval.

Identify the authoritative location of shared business rules, intended reusable components, and any material design pattern with its concrete purpose.

## Test plan and traceability

Validator owns: about five behavior-focused acceptance checks grouping meaningful domain/persistence/UI/error/real-system tests as appropriate. This is not a cap on tests or scenario coverage. Map scoped scenario IDs to expected outcomes and establishing tests; include failures/mock boundaries and review the plan before coding. Add final actual evidence after implementation.

## Design review decision

Human response, packet revision reviewed, requested changes, and explicit approval if supplied. Leave pending until an actual human decision arrives.

## Implementation and test driven development evidence

Developer owns: plain-English changes/code links, test-first summary and final commands/results with tested Git commit and explicit skips/failures. No per-increment red/green logs or separate fingerprint tooling.

## Validation and review

Validator then reviewer own sequential entries: independent results/tested Git commit, browser evidence, defects, checked resolutions, limitations and explicit skips. Reviewer records its recommendation; human acceptance remains separate.

Include final automated quality results and the review of responsibility, DRY, nesting, reuse, and pattern choices. Record any narrow justified exception to a mechanical threshold in the coding standards.

## Operating guide

How to run the feature, where its data lives, a realistic failure symptom, reproduction steps, relevant requests and logs, safe diagnostic queries, and recovery guidance.

## Human acceptance decision

Provide a working demo and a plain-English explanation of the high-level changes: what the user can now do, what changed in the screens and backend, where the data is saved, the important financial rules, and what final tests verified. Keep detailed troubleshooting material available as written reference; a live failure exercise is not required.

Record the demonstration and explanation reviewed, tested revision, remaining limitations, and explicit acceptance or requested changes. Passing tests alone do not populate this decision.

## Next stage

Coordinator owns next role/stage and unresolved question links. Keep one compact current assignment and update it in place; do not append repeated scope/instruction paragraphs for every turn. Routine handoff notification is this document's path plus stage; evidence stays in its existing owned sections. Reviewer/validator read-only investigation may start once stable inputs are available, while writing turns remain sequential. Keep evidence and actual failures; summarize correction status rather than duplicating complete reports.
