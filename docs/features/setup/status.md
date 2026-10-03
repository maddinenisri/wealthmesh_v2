# SETUP-001 status and human decisions

The coordinator owns this canonical record. Agents recommend; the human owner supplies design approval and feature acceptance.

| Dimension                      | Current fact                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Feature                        | SETUP-001: localhost project setup and Markdown reader                                                       |
| Approved design                | Packet revision 1, October 3, 2026                                                                           |
| Current stage                  | **READY FOR HUMAN ACCEPTANCE — not accepted**                                                                |
| Implementation                 | Complete; bounded VD-01 prerequisite correction delivered                                                    |
| Independent validation         | **PASS**: required setup outcomes established; zero required skips; VD-01 independently closed               |
| Independent review             | Recommends presenting setup for owner acceptance; six findings and VD-01 checked closed                      |
| Human design approval          | Supplied for revision 1, including framework/tool baseline                                                   |
| Human acceptance               | **Pending; no owner answer supplied**                                                                        |
| Finance requirement completion | None; captured requirements await feature scope selection                                                    |
| Next action                    | Owner reviews the working demo, explanation and final independent evidence, then accepts or requests changes |

## Read the working delivery

1. Open [application](http://127.0.0.1:5173) and [documentation](http://127.0.0.1:5174). The independent validator restored healthy services after its checks.
2. Read [plain-English changes](implementation.md) and follow the [demo](demo.md).
3. Read [independent validation](validation.md) and [final review](review.md): actual results, checked closures and remaining limits.
4. Keep [operations](../../operations/index.md) for prerequisite installation, start/stop, logs, data and safe troubleshooting.

The [read-only API](http://127.0.0.1:8080/api/system/status) returns ready/version `1` from PostgreSQL. These are localhost addresses; no login or deployment is added.

## Recorded design approval

Date: October 3, 2026. Approved packet: **revision 1**. Requested revisions: **none supplied**. Owner's actual words:

> we need to maintian separate markdwon document for questions and descisions and also updated my descision for approval docs/features/setup/index.md

This supplied the first checkpoint's approval of the concrete setup scope, baseline, UX and acceptance plan. It did not supply feature acceptance. [D-021/D-022](../../decisions.md#d-021-separate-question-and-decision-records) retain the decision; [Q-007](../../questions.md#q-007-setup-design-checkpoint) is resolved.

## Final independent evidence

[Validation](validation.md) owns executed evidence: 3 Java unit tests, 12 PostgreSQL integration tests, 10 MSW cases, 5 original platform cases plus 3 targeted prerequisite regressions, 16 docs unit checks and 10 docs browser cases. Required skips: **0**. Two distinct real-system E2Es, controlled failure cleanup, actual loopback/resource ownership, persistent marker/history preservation and snapshot fidelity are established. Expected negative exits and historical failed attempts remain labelled honestly.

The validator independently retested the missing-Node correction, removed only its owned synthetic marker, verified exact disposable PostgreSQL/Ryuk/JVM absence and restored the development demo with the same database/volume and ready version `1`. [Reviewer](review.md) reconciled source/standards, all six findings and VD-01 against that final evidence and recommends human presentation. No required finding or standards violation remains open.

Developer results remain separately attributed in [backend](backend-implementation.md), [platform](platform-implementation.md) and [docs](docs-implementation.md) handoffs. Final independent content identity is recorded in the role reports; execution preceded this initial local Git commit. Do not describe the later commit as a revision that was already tested by hash. Prose reconciliation does not alter the tested executable/config/snapshot source.

## Human acceptance checkpoint

Working demo and explanation: **ready**. Independent validation: **passed**. Review recommendation: **present for acceptance**. Human response: **not supplied**; [Q-009](../../questions.md#q-009-setup-feature-acceptance) remains open. A passing test suite, reviewer recommendation or local commit cannot populate acceptance.

Known limits: setup implements installation/status/documentation infrastructure only, with no household finance feature, authentication or remote access. Mermaid's visible bundle-size warning remains; a docs port override requires using the printed URL. No destructive restore/reset or deployment was performed. See final reports for details.

## Questions, decisions and future workflow

Maintain [questions](../../questions.md) separately from [actual decisions](../../decisions.md). The owner chose “Finish setup; use the lighter workflow going forward” under [D-023](../../decisions.md#d-023-finish-setup-and-simplify-future-workflow): future features use one document with sequential role sections, commits and about five behavior-focused acceptance groups. Separate sessions, one feature, two checkpoints and strict engineering/testing remain. Current setup outcomes were not retroactively waived.

Historical design and investigation reports retain their original observations. Java-absent, Docker-blocked, integration-in-progress and earlier pending review/validation labels are historical and superseded by the final role-owned reports. [Coordinator handoff](coordinator-handoff.md) preserves the assignment and reconciliation history. Relevant future source changes require affected validation/review before acceptance.
