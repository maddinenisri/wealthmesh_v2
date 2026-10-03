# SETUP-001 documentation viewer UX design

Status: **Draft for human design review.** No viewer, prototype, application code, or runtime check has been implemented by this task.

## Bounded task brief

| Field | Assignment |
| --- | --- |
| Role | `ux_architect`, in a separate agent session |
| Feature | `SETUP-001`: reproducible project setup and local documentation viewer |
| Scenario IDs | Proposed setup checks `SETUP-UX-01` through `SETUP-UX-08` below; these are not finance requirement IDs |
| Approved scope | Investigate and draft the viewer design. Production implementation awaits explicit human approval of the setup packet. |
| Inputs | [Agent instructions](../../../AGENTS.md), [workflow](../../workflow.md), [coding standards](../../coding-standards.md), [setup proposal](../../bootstrap-design.md), and the coordinator's bounded assignment |
| Permitted changes | This design and [UX handoff](ux-handoff.md) only |
| Required output | Annotated text wireframes, navigation, content states, review boundaries, and a written handoff |
| Stop conditions | Stop after the design and handoff. Do not add code, install packages, start servers, create an executable prototype, or change coordinator-owned status/decisions. |

## Reading goal

The owner should be able to open one local page and answer: what exists, what needs my decision, what are agents working on, what changed, what final checks establish, and where do I look when something breaks?

The documentation viewer reads repository Markdown. Markdown remains the record of decisions, role tasks, handoffs, explanations, and operating guidance. The viewer does not execute agents, edit files, accept features, or supply approval. Human communication stays in chat; the coordinator records consequential answers in the written packet.

The reader opens documentation without requiring the finance backend or PostgreSQL to be healthy. Operating instructions must remain accessible while diagnosing those services. Bind its development server to loopback, under the approved setup commands.

## Navigation and content ownership

| Navigation item | First content shown | Written source and owner |
| --- | --- | --- |
| Start here | Project purpose, actual state, how to start the local services | Coordinator-owned project overview; operations guide |
| Current feature | Goal, lifecycle, next human checkpoint, relevant role outputs | Coordinator-owned feature packet |
| Decisions | Questions awaiting an answer first, then recorded decisions | Coordinator-owned [decision record](../../decisions.md) |
| Features | Setup and later features, each with its own explicit state | Coordinator-owned feature index and packets |
| Agent work | Responsibilities, current bounded tasks, role handoffs | [Role contracts](../../agent-roles.md) and agent-authored feature artifacts |
| Architecture | Plain-English overview before API, storage, and decision details | Architect-authored design and references |
| Operations | Start, stop, diagnose, configuration, backup and restore when implemented | Developer-authored, validator-checked operating guides |
| Standards | Engineering and testing expectations | [Coding standards](../../coding-standards.md), [workflow](../../workflow.md) |

Use the same primary navigation on every page. On wider screens, show a left navigation column, the article, and a compact right contents list. On narrow screens, put navigation behind a labelled button and retain the page heading and status at the top. Provide keyboard access, visible focus, a skip-to-content link, semantic headings, and readable text contrast.

Search covers rendered Markdown titles and content, including role tasks and handoffs. Group results by page title, show a short excerpt and path, and keep status visible in the resulting article. Search is for documentation; it does not query household records or application data.

Implementation may use ordinary Markdown pages and links rather than custom dashboard widgets. Keep state and decision facts in their authoritative coordinator-owned records; feature pages link to them rather than maintaining independent copies of approvals. The viewer must not infer a state by counting files or passing tests.

## Annotated start page

```text
+-----------------------------------------------------------------------+
| WealthMesh documentation                         [Search documentation]|
+--------------------+--------------------------------------------------+
| Start here         | WealthMesh: household financial health           |
| Current feature    | Localhost only • no login                        |
| Decisions          |                                                  |
| Features           | CURRENT WORK: Project setup                      |
| Agent work         | Design: Draft • Implementation: Not started      |
| Architecture       | Validation: Not run • Human acceptance: Pending  |
| Operations         | [Read setup packet]                              |
| Standards          |                                                  |
|                    | YOUR NEXT REVIEW                                 |
|                    | Review setup design + acceptance test plan       |
|                    | [Read pending decisions]                         |
|                    |                                                  |
|                    | GET STARTED                                      |
|                    | [Start / stop] [How the system connects]         |
|                    | [What agents do]                                 |
+--------------------+--------------------------------------------------+
```

Annotations:

1. The first screen states the purpose and the current feature without presenting finance capabilities as implemented.
2. Design, implementation, validation, and human acceptance are separate facts. The displayed values above are examples for this draft, not a feature-status change.
3. The next review links to a concrete packet and validator plan. It never offers an approval button.
4. Operations links describe their own readiness. A proposed start command is labelled proposed and cannot be presented as tested.
5. Search and short navigation support returning to a particular failure guide without reading every handoff.

## Annotated feature page

```text
Features > Project setup

Project setup
Design: Draft | Implementation: Not started
Validation: Not run | Human acceptance: Pending
Source revision: [recorded revision]     Updated: [document date]

WHAT THIS DELIVERY ENABLES
A repeatable local way to run the app, database, documentation, and tests.

HUMAN REVIEW
[Design proposal] [UX design] [Acceptance test plan] [Pending decisions]

WORKING DEMO AND WHAT CHANGED
[Demo instructions and evidence when implemented]
[Plain-English explanation when implemented]

FINAL TEST RESULTS
Not run. Proposed checks: [acceptance test plan]

ROLE TASKS AND HANDOFFS
[Architect] [UX architect] [Developer] [Validator] [Reviewer]

REFERENCE
[System diagram] [API / data] [Code links] [Troubleshooting]
```

Lead the implemented feature explanation with what the owner can do and the visible screen change. Then explain the request, backend checks, saved information, and relevant money rules in plain English. Put final results near that explanation; keep command transcripts and code references on linked pages. The owner does not need a red/green test history or a live failure exercise to review the delivery.

Before implementation, replace absent demo/results sections with explicit availability text. Do not create fabricated screenshots, demo links, or success badges. A handoff lists role, bounded task, inputs, outputs, findings, and next recipient. Technical reasoning belongs in its written artifact; do not render private reasoning transcripts.

## Status and evidence states

| Dimension | Display examples | Required evidence |
| --- | --- | --- |
| Design | Draft; Awaiting human review; Approved at revision X | Coordinator-recorded human decision for approval |
| Implementation | Not started; In progress; Implemented at revision X | Developer handoff identifying changed files and scope |
| Validation | Not run; Failed; Passed at revision X; Needs rerun | Independent validator report with commands, results, skips and tested revision |
| Review | Not started; Changes required; Acceptance recommended | Independent reviewer findings and unresolved issues |
| Human acceptance | Pending; Accepted at revision X; Revisions requested | Explicit human decision recorded by coordinator |

These are labels for written facts, not an automated workflow engine. The coordinator maps them to the existing workflow stages. Show unrecorded facts as **Not recorded**, never as approval or success. Distinguish a test that passed with a required check skipped from complete passing validation; name the unresolved required check.

If relevant code changed after validation, show **Needs rerun** in the current packet and retain the older report as historical evidence. A report for an older revision must show that revision prominently. Do not imply the browser has detected relevant code changes unless that mechanism has actually been implemented; the coordinator and validation handoff own freshness in the initial scope.

## Local editing, diagrams, and reference links

- Opening a linked page and using browser Back must preserve ordinary browser navigation. Deep links target meaningful headings such as `#final-test-results` and `#diagnose-database-startup`.
- After saving a Markdown edit, the open viewer updates locally without a manual rebuild. Search must reflect the change after the viewer refreshes its content. Verify this behavior for both ordinary documentation and the setup packet.
- Render tables, fenced code, links, and diagrams as part of the setup acceptance checks. Mermaid rendering is an explicit integration requirement, not an assumption about the Markdown theme.
- A rendered Mermaid diagram must have an adjacent plain-English description and a link to its Markdown source. Keep source available for maintenance without replacing the readable diagram with code.
- If diagram rendering fails, show the source with a visible **Diagram did not render** message and preserve the rest of the article. The reader can still use the text description. Treat this as a failed diagram requirement during setup validation, not a passing fallback.
- Use repository-relative links for Markdown pages and assets. The implementation must provide a documented way to open referenced source files: a repository source link when a suitable repository URL exists, or an explicitly labelled copyable local path and line reference. Do not claim a browser can navigate arbitrary filesystem paths through the docs server.
- No diagrams, fonts, analytics, or documentation rendering should require an external account or remote rendering service. The reader works locally with checked-in assets and installed dependencies.

## Empty, error, and recovery states

| State | Reader experience |
| --- | --- |
| No finance feature implemented | Show setup as current work and say finance features are pending |
| No pending decisions | Say “No recorded decisions await your answer”; retain link to decision history |
| Role output not yet written | Show “Not available yet” and the responsible role; do not use a broken link as the status |
| Search finds no match | Explain there are no matching documentation pages and suggest broader terms or navigation |
| Missing page | Identify the missing document and link back to Start here and the feature index |
| Markdown or diagram problem | Keep readable article text available and identify the affected section |
| Viewer not running | Written setup instructions explain how to start it and where its logs are; this cannot be an in-viewer screen |
| Evidence is old or incomplete | Name the tested revision, changed scope, failed/skipped checks, and responsible next role |

Status uses text as well as any color. Long tables and code examples may scroll horizontally without forcing the entire page wider than the viewport. Heading order and link wording must make sense when read without the visual layout.

## Sketches and clickable experience

Use these annotated wireframes for the setup design review. Include the functional viewer and its navigation in the approved setup implementation, then demonstrate clicking through the setup packet, final test evidence, diagram, and operating guide before acceptance. This gives the owner both annotated design and a clickable working result within the existing two checkpoints.

There is no separate executable prototype in this task. If the owner needs a clickable mock before approving production work, scope that prototype and obtain its approval under the agent instructions; do not begin it implicitly.

## Proposed UX acceptance checks

The validator owns the final acceptance plan and may consolidate these IDs there. The descriptions below are proposals, not executed results.

| ID | Expected observation |
| --- | --- |
| SETUP-UX-01 | Start page explains localhost scope, actual setup state, and next human checkpoint |
| SETUP-UX-02 | Reader can reach the setup design, pending decisions, role tasks/handoffs, and acceptance plan through navigation |
| SETUP-UX-03 | Editing an existing Markdown page updates the open reader and its searchable content locally |
| SETUP-UX-04 | Mermaid renders, adjacent text explains it, and its source remains accessible; failure is visibly identified |
| SETUP-UX-05 | Final results identify commands, revision, failures and skips; no passing result or agent recommendation implies acceptance |
| SETUP-UX-06 | Keyboard navigation, focus, heading structure, search and narrow-screen reading work on representative pages |
| SETUP-UX-07 | Reader can follow demo, plain-English changes, operations and technical reference links without backend/database availability |
| SETUP-UX-08 | Empty states and missing pages remain understandable and offer a route to the project overview |

## Pending decisions and constraints

The concrete viewer implementation and technology baseline still require the human setup design review. Recommend the navigation and annotated wireframes above as that review's UX scope. No additional UX decision blocks drafting the architect design or validator plan.

The architect must specify the Mermaid rendering integration and the practical source-code link behavior within the chosen local viewer. The coordinator must establish canonical project overview, feature packet and index paths before implementation. The validator must incorporate these reading checks into the setup acceptance plan. These are role deliverables, not new human approval gates.
