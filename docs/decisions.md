# WealthMesh v2 decisions

The coordinator records actual human decisions here. Questions, recommendations and unanswered alternatives belong in the separate [question register](questions.md). Updated October 3, 2026. [Setup status](features/setup/status.md) is canonical for feature approval and acceptance.

## Confirmed by the owner

These decisions were supplied in the initial interview and instructions; exact historical timestamps were not recorded. Stable IDs are assigned here without changing their meaning.

| ID    | Subject                   | Decision                                                                                                                                                           |
| ----- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D-001 | Product scope             | Financial health only for the MVP                                                                                                                                  |
| D-002 | Audience                  | The owner and their household                                                                                                                                      |
| D-003 | Accessibility             | Only on the owner's computer through localhost                                                                                                                     |
| D-004 | Authentication            | No login in the MVP                                                                                                                                                |
| D-005 | Human checkpoints         | Review before implementation and before feature acceptance                                                                                                         |
| D-006 | Agent execution           | Separate agent sessions, one feature at a time                                                                                                                     |
| D-007 | Backend runtime           | Java 25                                                                                                                                                            |
| D-008 | Development database      | PostgreSQL through Docker Compose; persistent project-owned development storage                                                                                    |
| D-009 | Backend integration tests | Testcontainers                                                                                                                                                     |
| D-010 | Frontend network mocking  | MSW                                                                                                                                                                |
| D-011 | Delivery approach         | Test driven development with E2E tests                                                                                                                             |
| D-012 | Architect authority       | Choose routine details within the agreed baseline; request human review before major additions                                                                     |
| D-013 | Human-facing TDD evidence | Provide final test results only; retain the test-first implementation process                                                                                      |
| D-014 | Validator involvement     | Prepare the acceptance test plan before coding and independently validate the implementation afterward                                                             |
| D-015 | Feature handover          | Working demo and a plain-English explanation of the feature implementation and high-level changes                                                                  |
| D-016 | Engineering quality       | Strict coding standards, DRY, reusable components, justified design patterns, single-responsibility methods, and simple control flow                               |
| D-017 | Loopback boundary         | No exposure beyond this computer without a new explicit decision                                                                                                   |
| D-018 | Human communication       | Chat communicates with the owner only; related question Q-005                                                                                                      |
| D-019 | Agent communication       | Agents write generation plans, architecture changes, bounded tasks, handoffs, decisions, evidence, and explanations in repository Markdown; related question Q-005 |
| D-020 | Requirements source       | Use sibling v2 requirements as reference; no sibling mutation or default implementation import                                                                     |

## D-021: Separate question and decision records

Date: October 3, 2026. Owner: human product owner. Question: [Q-006](questions.md#q-006-separate-question-and-decision-records).

Owner's actual words:

> we need to maintian separate markdwon document for questions and descisions and also updated my descision for approval docs/features/setup/index.md

Record unanswered/resolved questions in `docs/questions.md` with stable IDs, ownership, rationale/options, supplied answers and decision links. Record actual human decisions in this file. Agents author both records; the coordinator maintains them.

## D-022: Setup design approval

Date: October 3, 2026. Owner: human product owner. Questions: [Q-007](questions.md#q-007-setup-design-checkpoint), [Q-003](questions.md#q-003-setup-framework-tool-baseline), [Q-001](questions.md#q-001-ux-review-format).

The owner's words quoted under D-021 approve [SETUP-001 packet](features/setup/index.md), revision 1 dated October 3, 2026. Approval includes the concrete setup scope, framework/tool baseline, annotated UX, acceptance plan and working viewer/demo sequence. Implementation is authorized; no additional routine approval is needed. Optional cleanup severity/escalation remains the unresolved workflow question [Q-002](questions.md#q-002-review-findings-and-disagreement-policy).

Approval is the first human checkpoint only. Implementation had not started when the owner approved the packet; current execution progress belongs in [canonical setup status](features/setup/status.md). Validation, implementation review, working demo and human acceptance remain pending. Neither an agent recommendation nor a status update grants acceptance. There remain two human checkpoints; final-results reporting does not remove TDD.

## D-023: Finish setup and simplify future workflow

Date: October 3, 2026. Owner: human product owner. Question: [Q-008](questions.md#q-008-simplify-setup-and-future-delivery).

Owner's actual answer:

> Finish setup; use the lighter workflow going forward

Finish the current setup with its existing truthful evidence, targeted VD-01 prerequisite correction, owned cleanup/restored demo and concise final results. No current infrastructure refactor, retroactive waived outcome or new supplemental test chain is authorized by this process decision.

Future features use one feature document with sequential role-owned sections, separate questions/decisions, separate role sessions, one feature at a time and the existing two human checkpoints. Use Git commits to identify tested revisions and about five behavior-focused acceptance checks grouping meaningful domain/technical tests, rather than limiting actual test count. Routine handoffs notify the feature path and stage; no separate role-report chains or fingerprint tooling are required. Strict coding standards, test-first development, PostgreSQL Testcontainers, MSW isolation and real-system E2E remain binding. See [workflow](workflow.md) and [template](templates/feature-packet.md).

## D-024: Explain feature outcomes in commit messages

Date: October 3, 2026. Owner: human product owner.

Owner's actual words:

> in commit message we need to include hight level about that feature

Use a descriptive title with the feature ID and a short plain-English body explaining the problem, user-visible result and high-level changes, followed by relevant actual validation. Avoid method/file inventories and unexecuted pass claims. Preserve pending human acceptance and feature limits when relevant. This convention improves Git history without adding another report chain or approval gate; [workflow](workflow.md#commit-messages) and `AGENTS.md` apply it to future commits.

## D-025: Prepare the combined first-feature planning package

Date: October 3, 2026. Owner: human product owner. Related question: [Q-004](questions.md#q-004-first-usable-finance-release).

Owner's actual words:

> update with your recommendation and ensure final package for next session

Prepare [FIN-001: Household and first checking account](features/household-checking/index.md) as the recommended next-session planning target, with the updated copyable prompt and knowledge links. This authorizes packaging and preapproval planning, not a completed concrete design, production implementation, final release scope or setup/feature acceptance. Role designs, validator plan and precise product questions remain for the next session. D-023's lighter workflow and existing checkpoints remain.

The owner additionally instructed:

> we need to commit all required and knowledge docs as well

Commit and push the requested handover documents and retain tracked requirements/knowledge records, including the immutable captured source; ignored runtime/tools/dependencies/build outputs and secrets remain excluded. This delivery instruction adds no feature approval.

## D-026: Accept completed project setup

Date: October 3, 2026. Owner: human product owner. Question: [Q-009](questions.md#q-009-setup-feature-acceptance).

Owner's actual answer:

> Accept completed SETUP-001

The owner accepts the completed setup after the existing working demo, plain-English explanation and final independent validation/review were presented. [Canonical setup status](features/setup/status.md) records acceptance of revision 1 with the delivered VD-01 correction and known limits. No setup validation was repeated to obtain this answer; historical evidence retains its actual tested content identity and is not retroactively attributed to a Git commit.

This resolves setup's existing acceptance checkpoint. It does not approve FIN-001's design, implementation, first-release scope or deployment. FIN-001's concrete product policies and combined design review remain pending.

## D-027: FIN-001 amount, date and member policies

Date: October 3, 2026. Owner: human product owner. Related question: [Q-004](questions.md#q-004-first-usable-finance-release).

The owner answered the concrete architect proposals:

- Opening amount: **“Use the recommended input/sign/precision policy.”** Blank/zero starts at zero; plain or correctly grouped dollar text is accepted, including a leading minus for overdrafts; more than two decimal places is rejected without rounding. Negative balances reduce the checking-only total.
- Financial dates: **“Use the recommended local-date policy.”** Default to the backend's local today, initially this computer's `America/New_York` financial zone; allow earlier dates and reject future dates.
- Member names: **“Allow duplicate names with an additional distinguishing label.”** Revise the earlier unique-name recommendation to support same-name members with distinguishable owner choices. Architecture/UX must supply the concrete label contract in the combined packet.

These actual answers settle the named policies, not the entire feature design or first release. The revised combined FIN-001 packet and validator plan still require explicit approval before production implementation. No approval is inferred for unanswered design details, feature acceptance or deployment.

## D-028: Request a recommendation after FIN-001 complexity review

Date: October 3, 2026. Owner: human product owner. Related question: [Q-004](questions.md#q-004-first-usable-finance-release).

**Correction (October 3, 2026, recorded with D-029):** an earlier version of this entry quoted “I haven't approved it” and “will leave the decision to you” as the owner's words. Those sentences were written by the reviewing assistant in its review reply, not by the owner. The owner supplied no such statement. The owner relayed the complexity-review options and made no selection until D-029.

The review offered options for keeping or trimming the revision 2 design. The coordinator prepared a trimmed revision 3 recommendation, including simpler save handling/detail edits and a member typo-correction capability. This was a recommendation only, not a human selection or approval of implementation. Concrete role proposals belong in the single FIN-001 packet and remain reviewable before coding.

Existing D-026 setup acceptance and D-027 policy answers persist. D-023's one-document future workflow retains separate role sessions and both checkpoints; setup's historical role-report chain is not carried into FIN-001. Wider release scope and the combined revision 3 design approval remain open. No implementation, deployment or feature acceptance is authorized by this direction.

## D-029: Approve FIN-001 design revision 3

Date: October 3, 2026. Owner: human product owner. Related question: [Q-004](questions.md#q-004-first-usable-finance-release).

After reviewing revision 3 of [FIN-001](features/household-checking/index.md) (commit `503b43e`), the owner answered:

> approved, lets commit andlets coordinator start issuing work

This is explicit human design approval of revision 3 as one combined packet: scope and retained original boundaries, UX, technical contract, member name/label correction, last-write-wins detail edits, bounded disposable test-fixture changes (sequential setup/finance E2E suites and the test-only `financeReset`), and the five-group acceptance plan. The packet's 28–52 hour estimate is unmeasured and not a commitment. It authorizes the bounded implementation described there.

Not approved: feature acceptance (the second human checkpoint), deferred scope, cleanup of setup tooling (D-023 stands), or the wider first-release scope, which remains open under Q-004. Implementation follows D-023: developer TDD, separate validator, independent reviewer, one feature packet plus these registers.

## D-030: Select Spring Data JPA/Hibernate persistence

Date: October 3, 2026. Owner: human product owner. Related question: [Q-010](questions.md#q-010-fin-001-spring-persistence-direction).

After asking about JPA and Spring service/repository patterns, the owner clarified:

> Switch to Spring Data JPA/Hibernate repositories

This selects Spring Data JPA/Hibernate for persistence with Spring services coordinating business operations and transactions. It supersedes revision 3's JDBC persistence choice for the affected FIN-001 work. Exact USD amounts, dates, ownership integrity, API/UX scope, Flyway, PostgreSQL and independent validation/review remain required. No new service, login, deployment or feature acceptance is implied.

The coordinator preserved the in-progress work and interrupted dependent development. The architect prepares the concrete persistence amendment, alternatives and operational/engineering cost in the existing FIN-001 packet; validator then reconciles affected acceptance checks. Concrete amended design review remains required before dependent implementation under AGENTS.md. The technology selection itself is settled and must not be asked again.

## D-031: Approve FIN-001 revision 4 persistence amendment

Date: October 3, 2026. Owner: human product owner. Related: [D-030](#d-030-select-spring-data-jpahibernate-persistence), [Q-010](questions.md#q-010-fin-001-spring-persistence-direction).

After reviewing the concrete amendment in the [FIN-001 packet](features/household-checking/index.md#persistence-amendment--spring-data-jpahibernate-revision-4) (commit `c4a5217`), the owner answered:

> Approve the amendment (revision 4).

This approves the concrete persistence design: Spring Data JPA/Hibernate for FIN-001 finance persistence with Spring services coordinating transactions; Flyway as sole schema authority with Hibernate `validate`; `open-in-view` off; DTOs separate from entities; assigned-UUID `Persistable` creates with rollback-then-replay; pessimistic account locking and ordered owner replacement; one coherent projection for list/total; accepted setup's small JDBC metadata reader and test-only JDBC fixture controls retained; and the reconciled acceptance plan with its added JPA checks. Revision 3's financial rules, API and UX scope are unchanged (D-029).

The 12–24 hour additional effort is unmeasured, not a commitment. The earlier review offered an option to re-estimate after the first vertical slice; the owner did not select it, so none is required. Developer evidence from the JDBC draft is invalidated for the persistence layer and must be re-executed on the replacement.

Not approved: feature acceptance (second checkpoint), deferred scope, setup-tooling cleanup (D-023 stands), or wider first-release scope (Q-004 stays open). The coordinator may resume the developer under the amended design.

The owner's subsequent instruction reinforced the approval and engineering requirement: **“approved, please keep clean code.”** Developer self-review and independent reviewer enforcement of the existing coding standards remain mandatory, including coherent responsibilities, DRY financial rules, composition and correction of complexity/length/nesting violations. This does not add a checkpoint or waive required tests.

## D-032: Accept FIN-001 and request UI/process correction

Date: October 3, 2026. Owner: human product owner. Delivery: `90b2016`; final reviewed application code: `a7493e8`, with unchanged financial/date evidence at `c976d69`.

After the working demo, explanation and independent results were presented, the owner answered:

> I accept this but UI is terriablely wrong compate to original version localhost:3000 or ../wealthmesh and also we are taking too long for each stry. We need to find why its taking this long or how to address process

This explicitly accepts the delivered FIN-001 capability and records dissatisfaction with its visual design and delivery time. The coordinator will compare the original UI read-only and audit the actual delivery record, keeping findings and a bounded correction proposal in the existing packet. Acceptance is not endorsement of the current visual design, approval of a replacement design, or authorization to import the sibling implementation. Deferred original clauses and Q-004 remain unchanged; original global scenario completion is not advanced by partial feature acceptance.

## D-033: Keep engineering utilities outside the product UI

Date: October 3, 2026. Owner: human product owner. Related: [Q-011](questions.md#q-011-application-ui-and-engineering-utilities).

The owner requested: “lets fix running or documenting too many hops and rework on UI with proper UX standards and keep only actual application, perfrom research how to do that UX design”. Asked whether this meant product UI only or also stopping the documentation server, the owner answered **“Product UI only.”**

Remove Setup status and Documentation from the finance navigation in the proposed UI correction. Retain direct diagnostics/documentation URLs, the documentation server, engineering records, tests and operating tools. Preserve running services and saved development records. Research and concrete visual design may proceed; the combined revision 5 screen proposal and affected acceptance plan still need the existing design approval before production changes. D-032 acceptance and financial scope remain unchanged. Reduce routine hops through compact assignments, reused architecture, early independent read-only inspection and batched findings within D-023; separate developer/validator/reviewer sessions and both human checkpoints remain required.

## D-034: Approve FIN-001 revision 5 UI correction

Date: October 3, 2026. Owner: human product owner. Reviewable revision: `618c952`, [revision 5 screens and affected plan](features/household-checking/index.md#ui-correction--revision-5-approved).

After the concrete annotated UI design and independently prepared affected plan were presented, the owner answered **“approve, lets implement”.** This explicitly approves revision 5: the original-style warm workspace/sidebar/typography, desktop account table and complete mobile cards, consistent form panels, two product navigation links, direct checking entry, route titles and removal of technical navigation/footer from the product UI. Direct setup/docs and tooling remain available under D-033. The five-group affected acceptance plan is approved, including retained diagnostics and financial assertions with revised navigation expectations.

Implementation may start within the frontend/E2E scope. Accepted Java/JPA/API/data/money/date/ownership rules are unchanged; retain their evidence and expand checks only for changed risk. No new framework, service, dependency, fixture infrastructure, sibling implementation import, source completion, Q-004 scope or correction acceptance is approved. D-032 financial acceptance remains valid; the working visual correction still needs independent validation/review and owner acceptance.

## D-035: Select the modern finance workspace style

Date: October 3, 2026. Owner: human product owner. Related: [Q-012](questions.md#q-012-visual-direction-during-fin-001-correction).

During approved revision 5 implementation the owner requested current online UX modernization research and said the visible UI was still unsatisfactory. Asked whether to use smaller sans-serif headings, tighter summary/table spacing and restrained green accents or continue the original warm serif style, the owner answered **“Modern finance workspace.”**

This selects the modern presentation direction for the existing approved shell, native navigation, account table/mobile cards and forms. It supersedes the original serif/warm styling direction while retaining D-034's structural/behavioral scope and affected acceptance plan. The coordinator's previously stated modern-style working assumption is now confirmed as a preference, not retroactively a supplied answer. Source `fb48238` implements that routine visual refinement; owner implementation acceptance still requires the working demo and completed independent evidence.

No backend/API/data/money/date/ownership change, new framework/service/dependency, wider Q-004 release scope, original-scenario completion or visual correction acceptance is implied. D-032's financial acceptance remains intact.

## D-036: Accept FIN-001 modern UI correction

Date: October 3, 2026 (America/New_York). Owner: human product owner. Reviewed delivery: `2509791`; independently tested/reviewed UI code: `f700ee8`.

After the working modern workspace, plain-English explanation, independent results and final review were presented, the owner answered **“yes, approved”** to the request to accept the updated UI or identify required changes. This accepts the finished FIN-001 revision 5 UI correction: modern typography/spacing, responsive account presentation, direct checking creation, product-only navigation and corrected standalone touch targets. D-034 remains its design approval and D-035 its selected visual direction; D-032's financial acceptance is retained.

Acceptance relies on the recorded evidence and limits: 39 isolated and 18 real-system checks at `fb48238`, three affected real-system checks at `f700ee8`, completed disposable cleanup and no remaining required reviewer finding. Unselected cases retain earlier evidence; actual browser 400% zoom was not executed. The [feature packet](features/household-checking/index.md#revision-5-demonstration-and-acceptance) records the demo and owner checkpoint.

No wider Q-004 release scope, deferred activity/savings/Update balance, original scenario completion, deployment or new feature is approved. Application code, saved records, services and tooling are unchanged by recording this acceptance.

## Architect authority boundaries

Routine choices follow the approved baseline and feature design. New deployable services, message brokers, external providers, replacement frameworks or databases, and material changes to security or deployment require a concrete explanation and human review before implementation. Routine dependency changes must remain justified and recorded. Setup revision 1 is approved; future finance scope remains unresolved under [Q-004](questions.md#q-004-first-usable-finance-release).

## Source inventory

An inspection on October 3, 2026 found 33 `.feature` files and 226 scenarios or scenario outlines with unique `@V2_...` tags. An earlier inspection during the same discussion found fewer files, and the source README states 22 files. These observations show that the source directory is changing; they are not an approved scope baseline.

A subsequent architect read-only filename scan on the same day found 39 `.feature` files. This session did not recount scenarios. Preserve historical observations as such; the approved captured snapshot inventory, including dirty/untracked source content and checksums, becomes this project's traceability baseline.

During approved setup, create a local snapshot with source location, source revision when available, content checksums, inventory, and explicit inclusion or deferral status. These observations are investigation context, not human release-scope decisions. Do not correct the sibling project's README without a separate request.
