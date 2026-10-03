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

Date: October 3, 2026. Owner: human product owner. Questions: [Q-007](questions.md#q-007-setup-design-checkpoint), [Q-003](questions.md#q-003-setup-frameworktool-baseline), [Q-001](questions.md#q-001-ux-review-format).

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

## Architect authority boundaries

Routine choices follow the approved baseline and feature design. New deployable services, message brokers, external providers, replacement frameworks or databases, and material changes to security or deployment require a concrete explanation and human review before implementation. Routine dependency changes must remain justified and recorded. Setup revision 1 is approved; future finance scope remains unresolved under [Q-004](questions.md#q-004-first-usable-finance-release).

## Source inventory

An inspection on October 3, 2026 found 33 `.feature` files and 226 scenarios or scenario outlines with unique `@V2_...` tags. An earlier inspection during the same discussion found fewer files, and the source README states 22 files. These observations show that the source directory is changing; they are not an approved scope baseline.

A subsequent architect read-only filename scan on the same day found 39 `.feature` files. This session did not recount scenarios. Preserve historical observations as such; the approved captured snapshot inventory, including dirty/untracked source content and checksums, becomes this project's traceability baseline.

During approved setup, create a local snapshot with source location, source revision when available, content checksums, inventory, and explicit inclusion or deferral status. These observations are investigation context, not human release-scope decisions. Do not correct the sibling project's README without a separate request.
