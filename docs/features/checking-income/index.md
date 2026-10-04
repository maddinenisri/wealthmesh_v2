# FIN-002: Record received salary into checking

## Identity and status

**Recommended next-session planning package; design approval pending; implementation not started.** [D-038](../../decisions.md#d-038-prepare-an-observable-next-feature-session) authorizes preparation/observation, not the contract below, feature acceptance or first-release scope. Setup and FIN-001/modern UI remain accepted (D-026/D-032/D-036). Coordinator owns this packet; role proposals below are drafts pending their separate sessions. No tests executed or original scenarios completed by this planning work.

## Behavior and scope

From existing checking detail, propose recording actually received **Salary**: positive exact USD amount, received date, checking account and entered-by existing household member. Review the details, confirm once or cancel. Persist the entry, account activity/entry detail and an **income-only monthly summary**; reload must agree with list/detail and checking-only household total. Opening money is excluded from income, and joint accounts contribute once. Example: synthetic Maya records `$6,000.00` on `2026-09-02` into Everyday Checking starting at `$5,000.00` on `2026-09-01`; balance becomes `$11,000.00`, September Salary income `$6,000.00`.

Do not display fabricated spending/net zeros: this recommendation explicitly defers INCOME_001's spending/net assertions and keeps that original partial. No expenses, transfers, savings, general categories, reminders, correction/removal/Undo, new accounts, broad wealth dashboard or infrastructure. Pre-tracking-start income is proposed to be prevented honestly, rather than added to an opening amount that may already include it. Historical setup/import is deferred.

## Source map

Immutable [income original](../../requirements/snapshots/2026-10-03-v2/source/spending/income/record-income.feature) has six tagged scenarios/outlines; FIN-002 focuses on two. Examples are data rows, not extra scenario identities. The following are planned coverage, **zero completion claims**; accepting this slice never completes deferred original assertions.

| Original ID     | Planned coverage and retained boundary                                                                                                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| V2_INCOME_001   | **Partial:** salary confirmation, balances, month/entry inspection, entered-by and opening excluded. Spending/net clauses deferred; household display is checking-only.                                                                                           |
| V2_INCOME_005   | Planned full if both `$0.00` / `-$100.00` cases preserve account/date/Salary and show “Enter an amount greater than zero”, with no write/income/balance change.                                                                                                   |
| V2_CHECKING_002 | [Setup dependency](../../requirements/snapshots/2026-10-03-v2/source/accounts/checking/setup.feature): extend FIN-001's blank/zero-opening cases with salary/balance/month-income clauses; verify combined original assertions before any later completion claim. |
| V2_CHECKING_007 | [Activity context](../../requirements/snapshots/2026-10-03-v2/source/accounts/checking/activity.feature), partial only: salary/activity. Rent, transfer, savings balances and spending/net deferred.                                                              |
| V2_INCOME_006   | Adapted/partial proposed future-date prevention; Save reminder and reminder storage deferred.                                                                                                                                                                     |

## User experience proposal — UX architect pending

Reuse accepted modern workspace, form/error/focus patterns and checking navigation. Specify received Salary → review → confirm/cancel → saved detail, with account/month links, pending controls and retained failed drafts. Clearly label income-only summary and deferred features; no enabled nonfunctional actions. Explain that entered-by records who supplied the entry, independently from account owners, without login. Confirmation must communicate that editing/removal is unavailable in this slice. [Q-013](../../questions.md#q-013-fin-002-design-boundaries) holds unresolved product choices.

## Technical proposal — architect pending

Reuse JPA/services/Flyway, exact USD parser/range/no-rounding and plain dates. Propose only the salary-entry request/storage/read delta and one request-flow guide. Explain overflow for amount/result/aggregate, transaction consistency, concurrent confirmations, replay after uncertain response and no double credit. Preserve opening amount/date and distinguish tracking start from current balance date. Propose date default/today zone, received date at/after tracking start and no future date; address existing historical FIN-001 dates without rewriting them. These are design considerations, not an approved table/API/whole-ledger contract.

## Test plan — validator pending

Five **draft groups**, not a test-count cap:

1. Confirm Salary; exact list/detail/total/month/entry agreement, joint count once and opening excluded.
2. Zero/negative plus malformed/precision/range boundaries; retained context and no write.
3. Review/cancel/failure, atomicity, concurrency and replay; no partial or duplicate credit.
4. Tracking-start/today/future/month boundaries and unchanged existing dates under approved policy.
5. Feature-specific real E2E save/reload/inspection, accessible interactions and plain-English demo/diagnostics.

Validator maps original assertions and adapted rules before human design review. TDD, disposable Testcontainers, isolated MSW and real Java/PostgreSQL E2E remain mandatory; affected checks only, no rebuilding setup verification.

## Next-stage assignments and timing

New session: read current facts/source map → UX salary-flow delta → architect salary/integrity delta → validator pre-code plan → **stop for concrete combined human design approval**. One writer; no task/report chain. Each assignment has a distinct outcome, relevant inputs, exclusive files and selected command budget. After approval, developer first implements a tested real confirm→save→reload slice, then bounded error/read-view increments. Separate validator/reviewer may inspect stable code in parallel; serialize shared outputs/packet writes, consolidate findings and rerun affected checks.

| Role / outcome                                     | Start UTC           | Deadline UTC        | End UTC             | Elapsed | Result                                                                          |
| -------------------------------------------------- | ------------------- | ------------------- | ------------------- | ------- | ------------------------------------------------------------------------------- |
| Coordinator / planning package and affected checks | 2026-10-04 13:51:45 | 2026-10-04 14:01:45 | 2026-10-04 13:56:26 | 4m 41s  | Complete; seven-doc format/lint/link/fence/diff checks passed; no feature tests |
| UX / salary journey delta                          |                     |                     |                     |         | Not started                                                                     |
| Architect / salary integrity delta                 |                     |                     |                     |         | Not started                                                                     |
| Validator / pre-code plan                          |                     |                     |                     |         | Not started                                                                     |

Every assignment ≤10 minutes including reads/commands/waits; check at eight, stop safely by ten with completed/remaining/commands/state, no identical auto-renewals. Measure human-review wait separately once it occurs. Observable process success means deadline adherence, actual bounded outcomes, no repeated baseline reads/review loops, consolidated corrections and complete truthful evidence; no total-duration guarantee.

## Evidence, operation and human checkpoints — pending

Design decision, implementation/test results, independent validation/review, working demo, operating delta and human acceptance are **not supplied**. Use existing commands and D-024 commits; record actual exits/skips/tested revisions. Explain where salary is saved, why balances/month income change, and how to diagnose a failed confirmation without destructive resets. Stop at design approval next session; later present working evidence/demo for the separate acceptance checkpoint.
