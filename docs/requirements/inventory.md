# Captured v2 requirements inventory

Snapshot: `2026-10-03-v2`. Captured 2026-10-03T16:42:02.686Z through 2026-10-03T16:42:02.730Z. 40 text files include 39 feature files and 262 scenarios/outlines with 262 unique scenario IDs. Outlines count once; example rows are not additional scenario IDs.

No finance scenario is included or implemented by SETUP-001. Every scenario is **deferred for release selection**, because [Q-004](../questions.md#q-004-first-usable-finance-release) remains open. These are source requirements, not accepted product behavior.

## Capture integrity

Source revision: `c2527c056de7c1f19d60d3dbde9830cc68bac4a1`. All captured source files are untracked in the sibling repository; the revision alone does not identify them. Per-file bytes, SHA-256, scoped status and full tags are retained in copyable local paths `docs/requirements/snapshots/2026-10-03-v2/manifest.json` and `scenario-inventory.json`. Source aggregate SHA-256: `b9b575dccce13b2eb77402aa8145361d5728c716d92661e3809ac9ab0be09d56`.

Missing IDs: **0**. Duplicate IDs: **0**. Multiple IDs on one scenario: **0**. Source names/tags are preserved; the sibling README count is historical source text, not the captured count.

## Feature files

| Captured source path                                   | Scenarios/outlines | Release status  |
| ------------------------------------------------------ | ------------------ | --------------- |
| `accounts/401k/setup.feature`                          | 7                  | Deferred: Q-004 |
| `accounts/brokerage/setup.feature`                     | 6                  | Deferred: Q-004 |
| `accounts/checking/activity.feature`                   | 11                 | Deferred: Q-004 |
| `accounts/checking/setup.feature`                      | 7                  | Deferred: Q-004 |
| `accounts/checking/transfers.feature`                  | 3                  | Deferred: Q-004 |
| `accounts/credit-cards/activity.feature`               | 8                  | Deferred: Q-004 |
| `accounts/credit-cards/setup.feature`                  | 6                  | Deferred: Q-004 |
| `accounts/defined-benefit/setup.feature`               | 6                  | Deferred: Q-004 |
| `accounts/hsa/setup.feature`                           | 7                  | Deferred: Q-004 |
| `accounts/lifecycle/dated-values.feature`              | 4                  | Deferred: Q-004 |
| `accounts/lifecycle/manage-accounts.feature`           | 7                  | Deferred: Q-004 |
| `accounts/loans/manage-loans.feature`                  | 6                  | Deferred: Q-004 |
| `accounts/mortgage/manage-mortgage.feature`            | 8                  | Deferred: Q-004 |
| `accounts/other-assets/setup.feature`                  | 6                  | Deferred: Q-004 |
| `accounts/property/setup.feature`                      | 6                  | Deferred: Q-004 |
| `accounts/roth-ira/setup.feature`                      | 7                  | Deferred: Q-004 |
| `accounts/savings/activity.feature`                    | 5                  | Deferred: Q-004 |
| `accounts/savings/setup.feature`                       | 6                  | Deferred: Q-004 |
| `accounts/traditional-ira/setup.feature`               | 7                  | Deferred: Q-004 |
| `household/history/manage-supporting-records.feature`  | 3                  | Deferred: Q-004 |
| `household/journeys/manage-household-finances.feature` | 6                  | Deferred: Q-004 |
| `household/members/manage-members.feature`             | 6                  | Deferred: Q-004 |
| `household/overview/understand-wealth.feature`         | 11                 | Deferred: Q-004 |
| `household/setup/set-up-household.feature`             | 5                  | Deferred: Q-004 |
| `investments/corrections.feature`                      | 9                  | Deferred: Q-004 |
| `investments/dividends-fees.feature`                   | 6                  | Deferred: Q-004 |
| `investments/funding.feature`                          | 5                  | Deferred: Q-004 |
| `investments/holdings.feature`                         | 8                  | Deferred: Q-004 |
| `investments/performance.feature`                      | 8                  | Deferred: Q-004 |
| `investments/purchases.feature`                        | 6                  | Deferred: Q-004 |
| `investments/retirement-health.feature`                | 7                  | Deferred: Q-004 |
| `investments/sales.feature`                            | 7                  | Deferred: Q-004 |
| `spending/budgets/manage-budgets.feature`              | 7                  | Deferred: Q-004 |
| `spending/categories/manage-categories.feature`        | 8                  | Deferred: Q-004 |
| `spending/categories/split-expenses.feature`           | 5                  | Deferred: Q-004 |
| `spending/expenses/record-expenses.feature`            | 11                 | Deferred: Q-004 |
| `spending/income/record-income.feature`                | 6                  | Deferred: Q-004 |
| `spending/monthly-review/review-spending.feature`      | 5                  | Deferred: Q-004 |
| `spending/recurring/manage-recurring.feature`          | 10                 | Deferred: Q-004 |

## Scenario traceability

Paths below are relative to the immutable snapshot source directory `docs/requirements/snapshots/2026-10-03-v2/source/`; the number after the colon is the original source line. Full scenario names and all tags are also in `scenario-inventory.json`.

| Scenario ID                   | Original source path and line                              | Release status and reason                                               |
| ----------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| `@V2_401K_001`                | `accounts/401k/setup.feature:7`                            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_401K_002`                | `accounts/401k/setup.feature:21`                           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_401K_003`                | `accounts/401k/setup.feature:31`                           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_401K_004`                | `accounts/401k/setup.feature:41`                           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_401K_005`                | `accounts/401k/setup.feature:54`                           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_401K_006`                | `accounts/401k/setup.feature:69`                           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_401K_007`                | `accounts/401k/setup.feature:78`                           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BROKERAGE_001`           | `accounts/brokerage/setup.feature:7`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BROKERAGE_002`           | `accounts/brokerage/setup.feature:21`                      | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BROKERAGE_003`           | `accounts/brokerage/setup.feature:31`                      | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BROKERAGE_004`           | `accounts/brokerage/setup.feature:41`                      | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BROKERAGE_005`           | `accounts/brokerage/setup.feature:54`                      | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BROKERAGE_006`           | `accounts/brokerage/setup.feature:69`                      | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_007`            | `accounts/checking/activity.feature:7`                     | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_008`            | `accounts/checking/activity.feature:19`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_009`            | `accounts/checking/activity.feature:27`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_010`            | `accounts/checking/activity.feature:38`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_011`            | `accounts/checking/activity.feature:46`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_012`            | `accounts/checking/activity.feature:54`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_013`            | `accounts/checking/activity.feature:65`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_014`            | `accounts/checking/activity.feature:78`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_015`            | `accounts/checking/activity.feature:89`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_016`            | `accounts/checking/activity.feature:97`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_018`            | `accounts/checking/activity.feature:108`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_001`            | `accounts/checking/setup.feature:8`                        | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_002`            | `accounts/checking/setup.feature:19`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_003`            | `accounts/checking/setup.feature:33`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_004`            | `accounts/checking/setup.feature:43`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_005`            | `accounts/checking/setup.feature:50`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_006`            | `accounts/checking/setup.feature:59`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CHECKING_017`            | `accounts/checking/setup.feature:74`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_TRANSFER_001`            | `accounts/checking/transfers.feature:6`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_TRANSFER_002`            | `accounts/checking/transfers.feature:16`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_TRANSFER_003`            | `accounts/checking/transfers.feature:27`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_006`                | `accounts/credit-cards/activity.feature:7`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_007`                | `accounts/credit-cards/activity.feature:16`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_008`                | `accounts/credit-cards/activity.feature:24`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_009`                | `accounts/credit-cards/activity.feature:32`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_010`                | `accounts/credit-cards/activity.feature:40`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_011`                | `accounts/credit-cards/activity.feature:52`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_012`                | `accounts/credit-cards/activity.feature:59`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_013`                | `accounts/credit-cards/activity.feature:69`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_001`                | `accounts/credit-cards/setup.feature:7`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_002`                | `accounts/credit-cards/setup.feature:16`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_003`                | `accounts/credit-cards/setup.feature:29`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_004`                | `accounts/credit-cards/setup.feature:37`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_005`                | `accounts/credit-cards/setup.feature:44`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CARD_014`                | `accounts/credit-cards/setup.feature:52`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_DB_001`                  | `accounts/defined-benefit/setup.feature:5`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_DB_002`                  | `accounts/defined-benefit/setup.feature:15`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_DB_003`                  | `accounts/defined-benefit/setup.feature:23`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_DB_004`                  | `accounts/defined-benefit/setup.feature:33`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_DB_005`                  | `accounts/defined-benefit/setup.feature:43`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_DB_006`                  | `accounts/defined-benefit/setup.feature:54`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HSA_001`                 | `accounts/hsa/setup.feature:7`                             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HSA_002`                 | `accounts/hsa/setup.feature:21`                            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HSA_003`                 | `accounts/hsa/setup.feature:31`                            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HSA_004`                 | `accounts/hsa/setup.feature:41`                            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HSA_005`                 | `accounts/hsa/setup.feature:54`                            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HSA_006`                 | `accounts/hsa/setup.feature:69`                            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HSA_007`                 | `accounts/hsa/setup.feature:78`                            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_DATED_VALUE_001`         | `accounts/lifecycle/dated-values.feature:7`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_DATED_VALUE_002`         | `accounts/lifecycle/dated-values.feature:23`               | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_DATED_VALUE_003`         | `accounts/lifecycle/dated-values.feature:37`               | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_DATED_VALUE_004`         | `accounts/lifecycle/dated-values.feature:48`               | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ACCOUNT_LIFECYCLE_001`   | `accounts/lifecycle/manage-accounts.feature:7`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ACCOUNT_LIFECYCLE_002`   | `accounts/lifecycle/manage-accounts.feature:20`            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ACCOUNT_LIFECYCLE_003`   | `accounts/lifecycle/manage-accounts.feature:29`            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ACCOUNT_LIFECYCLE_004`   | `accounts/lifecycle/manage-accounts.feature:41`            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ACCOUNT_LIFECYCLE_005`   | `accounts/lifecycle/manage-accounts.feature:51`            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ACCOUNT_LIFECYCLE_006`   | `accounts/lifecycle/manage-accounts.feature:62`            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ACCOUNT_LIFECYCLE_007`   | `accounts/lifecycle/manage-accounts.feature:71`            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_LOAN_001`                | `accounts/loans/manage-loans.feature:7`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_LOAN_002`                | `accounts/loans/manage-loans.feature:18`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_LOAN_003`                | `accounts/loans/manage-loans.feature:25`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_LOAN_004`                | `accounts/loans/manage-loans.feature:37`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_LOAN_005`                | `accounts/loans/manage-loans.feature:47`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_LOAN_006`                | `accounts/loans/manage-loans.feature:58`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MORTGAGE_001`            | `accounts/mortgage/manage-mortgage.feature:7`              | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MORTGAGE_002`            | `accounts/mortgage/manage-mortgage.feature:20`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MORTGAGE_003`            | `accounts/mortgage/manage-mortgage.feature:27`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MORTGAGE_004`            | `accounts/mortgage/manage-mortgage.feature:40`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MORTGAGE_005`            | `accounts/mortgage/manage-mortgage.feature:51`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MORTGAGE_006`            | `accounts/mortgage/manage-mortgage.feature:62`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MORTGAGE_007`            | `accounts/mortgage/manage-mortgage.feature:70`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MORTGAGE_008`            | `accounts/mortgage/manage-mortgage.feature:81`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_OTHER_ASSET_001`         | `accounts/other-assets/setup.feature:7`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_OTHER_ASSET_002`         | `accounts/other-assets/setup.feature:19`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_OTHER_ASSET_003`         | `accounts/other-assets/setup.feature:26`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_OTHER_ASSET_004`         | `accounts/other-assets/setup.feature:36`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_OTHER_ASSET_005`         | `accounts/other-assets/setup.feature:47`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_OTHER_ASSET_006`         | `accounts/other-assets/setup.feature:53`                   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PROPERTY_001`            | `accounts/property/setup.feature:7`                        | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PROPERTY_002`            | `accounts/property/setup.feature:19`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PROPERTY_003`            | `accounts/property/setup.feature:28`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PROPERTY_004`            | `accounts/property/setup.feature:41`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PROPERTY_005`            | `accounts/property/setup.feature:52`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PROPERTY_006`            | `accounts/property/setup.feature:64`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ROTH_IRA_001`            | `accounts/roth-ira/setup.feature:7`                        | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ROTH_IRA_002`            | `accounts/roth-ira/setup.feature:21`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ROTH_IRA_003`            | `accounts/roth-ira/setup.feature:31`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ROTH_IRA_004`            | `accounts/roth-ira/setup.feature:41`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ROTH_IRA_005`            | `accounts/roth-ira/setup.feature:54`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ROTH_IRA_006`            | `accounts/roth-ira/setup.feature:69`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_ROTH_IRA_007`            | `accounts/roth-ira/setup.feature:78`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SAVINGS_006`             | `accounts/savings/activity.feature:6`                      | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SAVINGS_007`             | `accounts/savings/activity.feature:17`                     | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SAVINGS_008`             | `accounts/savings/activity.feature:25`                     | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SAVINGS_009`             | `accounts/savings/activity.feature:33`                     | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SAVINGS_010`             | `accounts/savings/activity.feature:43`                     | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SAVINGS_001`             | `accounts/savings/setup.feature:7`                         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SAVINGS_002`             | `accounts/savings/setup.feature:18`                        | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SAVINGS_003`             | `accounts/savings/setup.feature:33`                        | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SAVINGS_004`             | `accounts/savings/setup.feature:42`                        | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SAVINGS_005`             | `accounts/savings/setup.feature:49`                        | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SAVINGS_011`             | `accounts/savings/setup.feature:62`                        | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_TRAD_IRA_001`            | `accounts/traditional-ira/setup.feature:7`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_TRAD_IRA_002`            | `accounts/traditional-ira/setup.feature:21`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_TRAD_IRA_003`            | `accounts/traditional-ira/setup.feature:31`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_TRAD_IRA_004`            | `accounts/traditional-ira/setup.feature:41`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_TRAD_IRA_005`            | `accounts/traditional-ira/setup.feature:54`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_TRAD_IRA_006`            | `accounts/traditional-ira/setup.feature:69`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_TRAD_IRA_007`            | `accounts/traditional-ira/setup.feature:78`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SUPPORTING_RECORD_001`   | `household/history/manage-supporting-records.feature:7`    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SUPPORTING_RECORD_002`   | `household/history/manage-supporting-records.feature:18`   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SUPPORTING_RECORD_003`   | `household/history/manage-supporting-records.feature:31`   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_JOURNEY_001`             | `household/journeys/manage-household-finances.feature:7`   | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_JOURNEY_002`             | `household/journeys/manage-household-finances.feature:59`  | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_JOURNEY_003`             | `household/journeys/manage-household-finances.feature:81`  | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_JOURNEY_004`             | `household/journeys/manage-household-finances.feature:94`  | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_JOURNEY_005`             | `household/journeys/manage-household-finances.feature:112` | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_JOURNEY_006`             | `household/journeys/manage-household-finances.feature:140` | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MEMBERS_001`             | `household/members/manage-members.feature:7`               | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MEMBERS_002`             | `household/members/manage-members.feature:15`              | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MEMBERS_003`             | `household/members/manage-members.feature:29`              | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MEMBERS_004`             | `household/members/manage-members.feature:39`              | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MEMBERS_005`             | `household/members/manage-members.feature:53`              | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MEMBERS_006`             | `household/members/manage-members.feature:63`              | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_WEALTH_001`              | `household/overview/understand-wealth.feature:7`           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_WEALTH_002`              | `household/overview/understand-wealth.feature:26`          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_WEALTH_003`              | `household/overview/understand-wealth.feature:41`          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_WEALTH_004`              | `household/overview/understand-wealth.feature:53`          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_WEALTH_005`              | `household/overview/understand-wealth.feature:67`          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_WEALTH_006`              | `household/overview/understand-wealth.feature:81`          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_WEALTH_007`              | `household/overview/understand-wealth.feature:99`          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_WEALTH_008`              | `household/overview/understand-wealth.feature:111`         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_WEALTH_009`              | `household/overview/understand-wealth.feature:124`         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_WEALTH_010`              | `household/overview/understand-wealth.feature:135`         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_WEALTH_011`              | `household/overview/understand-wealth.feature:148`         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOUSEHOLD_SETUP_001`     | `household/setup/set-up-household.feature:7`               | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOUSEHOLD_SETUP_002`     | `household/setup/set-up-household.feature:19`              | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOUSEHOLD_SETUP_003`     | `household/setup/set-up-household.feature:37`              | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOUSEHOLD_SETUP_004`     | `household/setup/set-up-household.feature:49`              | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOUSEHOLD_SETUP_005`     | `household/setup/set-up-household.feature:59`              | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INV_CORRECTION_001`      | `investments/corrections.feature:5`                        | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INV_CORRECTION_002`      | `investments/corrections.feature:18`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INV_CORRECTION_003`      | `investments/corrections.feature:33`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INV_CORRECTION_004`      | `investments/corrections.feature:45`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INV_CORRECTION_005`      | `investments/corrections.feature:59`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INV_CORRECTION_006`      | `investments/corrections.feature:69`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INV_CORRECTION_007`      | `investments/corrections.feature:82`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INV_CORRECTION_008`      | `investments/corrections.feature:93`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INV_CORRECTION_009`      | `investments/corrections.feature:105`                      | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EARNINGS_001`            | `investments/dividends-fees.feature:5`                     | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EARNINGS_002`            | `investments/dividends-fees.feature:18`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EARNINGS_003`            | `investments/dividends-fees.feature:28`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EARNINGS_004`            | `investments/dividends-fees.feature:38`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EARNINGS_005`            | `investments/dividends-fees.feature:49`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EARNINGS_006`            | `investments/dividends-fees.feature:57`                    | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_FUNDING_001`             | `investments/funding.feature:5`                            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_FUNDING_002`             | `investments/funding.feature:16`                           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_FUNDING_003`             | `investments/funding.feature:24`                           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_FUNDING_004`             | `investments/funding.feature:33`                           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_FUNDING_005`             | `investments/funding.feature:44`                           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOLDINGS_001`            | `investments/holdings.feature:5`                           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOLDINGS_002`            | `investments/holdings.feature:14`                          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOLDINGS_003`            | `investments/holdings.feature:28`                          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOLDINGS_004`            | `investments/holdings.feature:39`                          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOLDINGS_005`            | `investments/holdings.feature:49`                          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOLDINGS_006`            | `investments/holdings.feature:59`                          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOLDINGS_007`            | `investments/holdings.feature:69`                          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_HOLDINGS_008`            | `investments/holdings.feature:78`                          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PERFORMANCE_001`         | `investments/performance.feature:6`                        | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PERFORMANCE_002`         | `investments/performance.feature:20`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PERFORMANCE_003`         | `investments/performance.feature:33`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PERFORMANCE_004`         | `investments/performance.feature:45`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PERFORMANCE_005`         | `investments/performance.feature:57`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PERFORMANCE_006`         | `investments/performance.feature:67`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PERFORMANCE_007`         | `investments/performance.feature:78`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PERFORMANCE_008`         | `investments/performance.feature:88`                       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PURCHASE_001`            | `investments/purchases.feature:5`                          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PURCHASE_002`            | `investments/purchases.feature:16`                         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PURCHASE_003`            | `investments/purchases.feature:27`                         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PURCHASE_004`            | `investments/purchases.feature:36`                         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PURCHASE_005`            | `investments/purchases.feature:47`                         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_PURCHASE_006`            | `investments/purchases.feature:58`                         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RETIREMENT_ACTIVITY_001` | `investments/retirement-health.feature:5`                  | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RETIREMENT_ACTIVITY_002` | `investments/retirement-health.feature:19`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RETIREMENT_ACTIVITY_003` | `investments/retirement-health.feature:28`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RETIREMENT_ACTIVITY_004` | `investments/retirement-health.feature:37`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RETIREMENT_ACTIVITY_005` | `investments/retirement-health.feature:49`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RETIREMENT_ACTIVITY_006` | `investments/retirement-health.feature:58`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RETIREMENT_ACTIVITY_007` | `investments/retirement-health.feature:68`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SALE_001`                | `investments/sales.feature:6`                              | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SALE_002`                | `investments/sales.feature:18`                             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SALE_003`                | `investments/sales.feature:26`                             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SALE_004`                | `investments/sales.feature:36`                             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SALE_005`                | `investments/sales.feature:50`                             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SALE_006`                | `investments/sales.feature:60`                             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SALE_007`                | `investments/sales.feature:67`                             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BUDGET_001`              | `spending/budgets/manage-budgets.feature:7`                | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BUDGET_002`              | `spending/budgets/manage-budgets.feature:19`               | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BUDGET_003`              | `spending/budgets/manage-budgets.feature:31`               | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BUDGET_004`              | `spending/budgets/manage-budgets.feature:43`               | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BUDGET_005`              | `spending/budgets/manage-budgets.feature:54`               | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BUDGET_006`              | `spending/budgets/manage-budgets.feature:67`               | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_BUDGET_007`              | `spending/budgets/manage-budgets.feature:78`               | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CATEGORIES_001`          | `spending/categories/manage-categories.feature:7`          | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CATEGORIES_002`          | `spending/categories/manage-categories.feature:18`         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CATEGORIES_003`          | `spending/categories/manage-categories.feature:31`         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CATEGORIES_004`          | `spending/categories/manage-categories.feature:39`         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CATEGORIES_005`          | `spending/categories/manage-categories.feature:52`         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CATEGORIES_006`          | `spending/categories/manage-categories.feature:61`         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CATEGORIES_007`          | `spending/categories/manage-categories.feature:72`         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_CATEGORIES_008`          | `spending/categories/manage-categories.feature:82`         | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SPLITS_001`              | `spending/categories/split-expenses.feature:7`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SPLITS_002`              | `spending/categories/split-expenses.feature:18`            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SPLITS_003`              | `spending/categories/split-expenses.feature:28`            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SPLITS_004`              | `spending/categories/split-expenses.feature:37`            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_SPLITS_005`              | `spending/categories/split-expenses.feature:50`            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EXPENSE_001`             | `spending/expenses/record-expenses.feature:7`              | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EXPENSE_002`             | `spending/expenses/record-expenses.feature:17`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EXPENSE_003`             | `spending/expenses/record-expenses.feature:26`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EXPENSE_004`             | `spending/expenses/record-expenses.feature:37`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EXPENSE_005`             | `spending/expenses/record-expenses.feature:45`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EXPENSE_006`             | `spending/expenses/record-expenses.feature:54`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EXPENSE_007`             | `spending/expenses/record-expenses.feature:64`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EXPENSE_008`             | `spending/expenses/record-expenses.feature:75`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EXPENSE_009`             | `spending/expenses/record-expenses.feature:85`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EXPENSE_010`             | `spending/expenses/record-expenses.feature:96`             | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_EXPENSE_011`             | `spending/expenses/record-expenses.feature:103`            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INCOME_001`              | `spending/income/record-income.feature:7`                  | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INCOME_002`              | `spending/income/record-income.feature:17`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INCOME_003`              | `spending/income/record-income.feature:25`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INCOME_004`              | `spending/income/record-income.feature:38`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INCOME_005`              | `spending/income/record-income.feature:48`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_INCOME_006`              | `spending/income/record-income.feature:60`                 | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MONTHLY_001`             | `spending/monthly-review/review-spending.feature:7`        | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MONTHLY_002`             | `spending/monthly-review/review-spending.feature:22`       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MONTHLY_003`             | `spending/monthly-review/review-spending.feature:32`       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MONTHLY_004`             | `spending/monthly-review/review-spending.feature:41`       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_MONTHLY_005`             | `spending/monthly-review/review-spending.feature:50`       | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RECURRING_001`           | `spending/recurring/manage-recurring.feature:7`            | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RECURRING_002`           | `spending/recurring/manage-recurring.feature:16`           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RECURRING_003`           | `spending/recurring/manage-recurring.feature:24`           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RECURRING_004`           | `spending/recurring/manage-recurring.feature:37`           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RECURRING_005`           | `spending/recurring/manage-recurring.feature:45`           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RECURRING_006`           | `spending/recurring/manage-recurring.feature:53`           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RECURRING_007`           | `spending/recurring/manage-recurring.feature:69`           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RECURRING_008`           | `spending/recurring/manage-recurring.feature:77`           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RECURRING_009`           | `spending/recurring/manage-recurring.feature:86`           | Deferred: Q-004 release selection pending; no finance behavior in setup |
| `@V2_RECURRING_010`           | `spending/recurring/manage-recurring.feature:96`           | Deferred: Q-004 release selection pending; no finance behavior in setup |
