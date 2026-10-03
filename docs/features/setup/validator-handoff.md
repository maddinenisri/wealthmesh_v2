# SETUP-001 validator handoff

Stage: pre-coding acceptance planning complete; packet revision 1 ready for human design review. Implementation approval: pending. Validation results: not run; there is no implementation to validate.

## Assignment and boundaries

Sender: independent validator session. Receivers: architect, UX architect, and coordinator; developer receives this plan only after human design approval.

Task: prepare acceptance coverage for reproducible local project setup, PostgreSQL Compose development storage, Java 25, Testcontainers, MSW, real-system E2E, Markdown communication viewer, coding-quality checks, and plain-English human demonstration.

Feature: `SETUP-001`, aligned by the coordinator with [status](status.md). Cases: `SETUP-AC-01` through `SETUP-AC-17` in [acceptance test plan](acceptance-test-plan.md).

Inputs read: [AGENTS.md](../../../AGENTS.md), [setup proposal](../../bootstrap-design.md), [architecture](architecture.md), [UX design](ux-design.md), [coding standards](../../coding-standards.md), [workflow](../../workflow.md), [role contracts](../../agent-roles.md), [decisions](../../decisions.md), and [feature packet template](../../templates/feature-packet.md).

Permitted writes: this handoff and the acceptance test plan. No production code, dependency installs, Docker mutations, or executable tooling. No agents spawned.

## Output and rationale

The plan requires migration-created synthetic metadata read from PostgreSQL by the real browser/API. There is no application write feature: version changes/deletion are bounded SQL fixtures in disposable test databases that establish real query behavior and missing-data failures. Dev persistence proves a validation-owned synthetic marker survives restart, alongside migration history/volume identity; only that marker is removed afterward. Migration rerun preserves unrelated synthetic data and GET writes nothing. These additions reconcile reviewer finding DR-02. The plan separates infrastructure from finance features and MSW from real-system evidence. It requires loopback/cleanup-helper checks, isolated test DBs, safe cleanup, errors, accurate docs status, independent final tests/quality, and requirements-snapshot traceability.

TDD remains mandatory for behavior changes. The owner receives final results only. Neither a passing suite nor this handoff supplies human approval.

## Evidence available now

Only repository documents were read and Markdown planning files written. No application tests, quality commands, Docker operations, or browser demo have run. No pass claims are made. Existing setup documentation describes the baseline as proposed and reports Java 25 as a prerequisite still to resolve; this session has not independently verified installed runtimes or Docker daemon availability.

## Completed alignment and next actions

| Owner | Next action | Completion condition |
| --- | --- | --- |
| Architect | Bootstrap commands, stored-version semantics, loopback-helper mechanism, and local reader/source-reference resolutions read and incorporated | Architecture and acceptance agree on `GET /api/system/status`, SQL-only test fixtures, ports, lifecycle/isolation; design reconciliation complete |
| UX architect | Completed viewer navigation/states/checks; remaining app screen uses architectural loading/ready/error/retry contract | UX checks SETUP-UX-01 through SETUP-UX-08 covered by AC-12/13 |
| Validator | Final bounded check read reviewer/architect handoffs, recorded design closures, and canonical status; scenarios/contracts unchanged | Acceptance plan ready for human review at packet revision 1; implementation checks not run |
| Coordinator | Record completed role readiness in canonical status and present concrete review packet | Approval is explicitly pending until human reviews the aligned packet |
| Human owner | Review design and acceptance plan | Explicit approval of identified packet revision or requested revisions |
| Developer, after approval | Write meaningful failing tests, implement, refactor, deliver final test results and operating guide | Approved scope implemented with traceable final evidence |
| Independent validator, after implementation | Execute delivered commands, inspect isolation/ownership, exercise real UI, report defects and final results | All required checks execute; unresolved failures/skips disclosed |
| Independent reviewer | Review standards, contracts, tests, integrity, and documentation | Findings resolved and recommendation given without supplying human acceptance |

Current readiness: packet revision 1 acceptance plan ready for human design review. The final bounded read confirmed [reviewer handoff](reviewer-handoff.md), [architecture handoff](architecture-handoff.md), and [design review](design-review.md) agree that DR-01/02/03 are resolved at design level. Architecture/UX/commands, stored-version and marker evidence, Compose-stopped test runs, host/cleanup loopback checks, and local reader/source-reference behavior align with the plan. No substantive scenarios or contracts changed during this final readiness update. Exact compatibility, runtime bindings, rendered diagrams/search, automated checks, and application behavior remain unexecuted implementation obligations. Human approval remains pending. Do not start implementation based on this handoff.
