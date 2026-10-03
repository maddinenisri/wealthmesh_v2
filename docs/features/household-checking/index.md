# FIN-001: Household and first checking account

## Identity, status and assignment

**Recommended planning package; concrete design approval pending; implementation not started.** Revision: planning 1, October 3, 2026. Coordinator owns status/assignments; roles write their sections sequentially with one active writer. This is a next-session planning target, not a second active implementation or completed human design-review packet.

The owner authorized packaging the recommendation under [D-025](../../decisions.md#d-025-prepare-the-combined-first-feature-planning-package). [Q-004](../../questions.md#q-004-first-usable-finance-release) final scope/release decisions remain open; [Q-009](../../questions.md#q-009-setup-feature-acceptance) setup acceptance remains pending. Reuse recorded answers; resolve the existing setup checkpoint before next-feature implementation if still pending. Authorized design/planning may proceed meanwhile. [D-023](../../decisions.md#d-023-finish-setup-and-simplify-future-workflow) retains setup and the lighter process; no infrastructure cleanup is proposed.

## Recommended behavior and boundaries

One usable slice creates/renames a household, adds named members and creates checking with individual or joint owners, name, bank, initial USD amount and financial date. Show household creation, empty overview, account list and detail; preserve data across reload. Count a shared checking account once in the clearly labelled checking-only household amount; do not imply totals include unimplemented account types.

Blank/explicit zero amount starts at zero. Checking date defaults to today and allows a chosen date as an adapted rule. Detail edits change name/bank/owners without changing money/date; cancellation saves nothing. Invalid name/amount preserves entered fields. Starting amounts establish balances, not income. Architect/validator must establish that classification without claiming salary or monthly-income behavior exists.

Defer activity, transfers, savings/cards/investments, budgets, Update balance/corrections, legacy recovery, member rename/deactivation/restoration/full profiles, account archive/delete/undo. Deferred means retained for later scope, not deleted globally. UX must explain unavailable future actions without enabled nonfunctional buttons.

## Original requirement traceability

Read immutable `docs/requirements/snapshots/2026-10-03-v2/source/household/setup/set-up-household.feature` and `accounts/checking/setup.feature` under that source root. Never edit originals or import sibling implementation. **Nine unique original IDs; zero completed claims.** Outlines count once; example rows are test executions. These are planned boundaries, not approved outcomes or executed evidence.

| Original ID               | Recommended coverage                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `@V2_HOUSEHOLD_SETUP_001` | Planned full only if named/joint owners, one shared contribution to household wealth and rename preserving ownership/money are all established |
| `@V2_HOUSEHOLD_SETUP_003` | Partial: empty overview/add checking/zero; first transaction deferred                                                                          |
| `@V2_HOUSEHOLD_SETUP_004` | Original savings scenario deferred; checking date-default/change is adapted coverage                                                           |
| `@V2_CHECKING_001`        | Partial: create/find/details/starting classification; money-in/out/transfer actions deferred                                                   |
| `@V2_CHECKING_002`        | Partial: blank/zero and empty activity; salary/balance/monthly-income clauses deferred                                                         |
| `@V2_CHECKING_003`        | Partial: edit details without money/date changes; separate Update balance action/form deferred                                                 |
| `@V2_CHECKING_004`        | Planned full: cancellation preserves existing account details/balance/date                                                                     |
| `@V2_CHECKING_005`        | Planned full: missing-name feedback, retained entries, cancellation and no account creation                                                    |
| `@V2_CHECKING_017`        | Planned full: invalid amount remains unsaved; correction persists matching list/detail                                                         |

`@V2_MEMBERS_001` is supporting partial/context for named members and owner choices; entered-by choices/full member lifecycle are not implemented here. `@V2_CHECKING_006` recovery remains deferred. Feature acceptance never completes partial original scenarios; every original assertion is needed for full completion. Do not alter global inventory completion during planning.

## UX proposal — pending ux_architect

Coordinator suggests household/member setup, honest empty overview, checking form, list/detail and detail-only edit. UX architect must define screen flow, labels, owner selection, error/cancel/loading states, keyboard/focus and deferred-action wording. No executable prototype is authorized before design approval.

## Technical proposal — pending architect

Retain existing Java 25/Spring Boot/JDBC/Flyway/Gradle, React/TypeScript/Vite and PostgreSQL. Architect proposes exact USD storage (`BigDecimal` plus PostgreSQL `NUMERIC`, or justified exact alternative), precision/range/rounding, input transport, dates/timezone, owner references/foreign keys, unique joint ownership and atomic saves/migrations. Explain constraints and request flow plainly; no table/API contract or money policy is approved by this packet. Keep backend invariants authoritative; no speculative abstractions, new services or custom supervisors.

Open owner-level design questions, tracked through Q-004: allow negative opening amounts? Reject or round excess decimal places, and which dollar/grouping formats are accepted? Permit future dates, and which local-date/timezone rule defines today? Require unique member names or distinguish duplicate display names? Architect supplies concise proposed defaults/implications before the owner answers; routine technical choices need no repeated permission.

## Draft acceptance plan — pending validator refinement

Approximately five groups, not a test-count cap:

1. Household/members/joint owners: creation/rename, valid ownership, empty state and one shared contribution.
2. Checking creation: known/blank/zero amounts, chosen/default dates and agreed exact input policy.
3. Persistence/details: list/detail/reload agree; edits preserve balance/date and owner references.
4. Cancel/validation/failure: accessible actionable errors, retained form, invalid/cancelled saves produce no write; explicit atomic failure cases.
5. Feature-specific real E2E, plain-English demo and operating guidance; MSW only in isolated UI tests.

Validator maps approved clauses to meaningful domain, Testcontainers PostgreSQL, MSW UI/error and Playwright tests before coding. Expected synthetic journey: Maya/Sam jointly own checking with `$5,000.00` on `2026-09-01`; reload, edit details and observe unchanged balance counted once. Setup-only E2E is insufficient. No tests have run for FIN-001.

## Sequential next-session work and design checkpoint

Read current facts, this packet and [session prompt](../../prompts/next-feature-session.md); reuse actual answers. Coordinator records bounded inputs/allowed sections/stop conditions here. Execute `ux_architect → architect → validator plan → human concrete design approval`; iterate design as needed, then stop for that approval. Roles own only their sections, and no separate task/report chain is created.

After approval: developer performs genuine TDD; separate validator executes actual checks; reviewer independently checks SRP/DRY/composition/purposeful patterns/guard clauses and integrity. Findings return to developer, then affected checks rerun. Use existing selective commands, disposable test databases, synthetic data and tested Git commits/D-024 messages. No private data, dev-DB tests, volume resets or unrelated service changes.

## Implementation, evidence, operation and human acceptance — pending

Implementation/code links, final commands/exits/skips/tested commit and independent results: **not available**. Operational guidance must explain stored data, requests/logs, one realistic failure and safe diagnosis. Demo/explanation must show the approved journey and remaining partial/deferred clauses; no fake income proof while activity is absent.

Human acceptance: **not supplied**. Stop on missing product answers/design approval or unresolved required checks; continue independent authorized planning. Only the owner accepts the demonstrated feature after validation/review. Resume this packet's recorded stage, rather than recreating setup or generating more documents.
