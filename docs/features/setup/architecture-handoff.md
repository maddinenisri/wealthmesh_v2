# SETUP-001 architecture handoff

Sender: architect session. Receiver: coordinator, validator and reviewer; developer receives the approved packet afterward. Stage: design only. Packet revision: 1, October 3, 2026. Human approval: pending. No implementation or finance requirement completion is claimed.

## Assignment and inputs

Bounded [architect task](tasks/architect-design.md) uses `AGENTS.md`, workflow/roles/standards, current owner choices, read-only environment/source observations, official compatibility references, [UX handoff](ux-handoff.md), [validator plan/handoff](validator-handoff.md), and [independent design review](design-review.md). Local cases `SETUP-AC-01`–`SETUP-AC-17` establish setup only.

Permitted changes were project instructions/overview, decision/workflow/role drafts, the setup design and architect-owned setup Markdown. No other role's reports were changed; no sub-agents spawned.

## Outputs and recorded choices

- [Concise human packet](index.md), [full setup design](../../bootstrap-design.md), and [architecture](architecture.md) propose the exact slice, baseline/tradeoffs, API/data flow, ports, migrations, lifecycle, independent databases, command contract, viewer integration, and quality enforcement.
- [Status](status.md), [agent protocol](agent-protocol.md), and `tasks/` establish canonical ownership and bounded tasks. Coordinator owns status/decisions after this initial draft and records actual human decisions.
- Root instructions/overview and [decisions](../../decisions.md) record confirmed Compose PostgreSQL and agent-authored Markdown communication. Framework choices and optional cleanup severity remain proposals/open decisions.
- Read-only source counts are historical observations; the approved source-text snapshot will record Git revision plus dirty/untracked content, checksums and scenario inventory. No sibling implementation was copied or changed.

## Reconciliation evidence

DR-01: architecture now proposes a test-classpath Testcontainers `CreateContainerCmdModifier` service provider for PostgreSQL and Ryuk loopback publishing, with pinned-source verification and actual binding checks. It retains resource cleanup and avoids daemon-wide changes. This is a source-based feasibility proposal, not a passed execution check.

DR-02: persisted version is explicitly read as stored text; disposable fixtures change it to `2` or remove it to establish database dependence and no GET side effects. Development restart evidence uses a uniquely named validator-owned nonfinancial marker plus migration history/volume identity, then removes only that marker. Validator incorporated these in AC-03/04/07.

DR-03: the full design names public commands and automated/manual standards enforcement. Architecture specifies local Mermaid rendering through a docs-theme component and stable VitePress Markdown hook, client rendering, accessible source sections, and copyable local source paths. The reader works independently of Java/PostgreSQL and uses Markdown as its source.

The independent reviewer has now recorded DR-01/02/03 checked closure and packet revision 1 readiness in [design review](design-review.md) and [reviewer handoff](reviewer-handoff.md). The validator has confirmed stored-version and command alignment in its own handoff. At the coordinator's direction, canonical status now records design review complete and human approval pending. This handoff attributes role findings without editing their reports or supplying human approval.

## Checks actually performed and limits

Read-only commands observed active Java 21.0.11 (Java 17 also installed), no detected Java 25, Node 26.4.0, npm 11.17.0, Docker client 28.4.0, Compose 2.39.4-desktop.1, and source Git revision `c2527c056de7c1f19d60d3dbde9830cc68bac4a1`. Docker daemon access failed due to an execution-sandbox socket permission error; container/daemon operation remains unverified. Filename inventory subsequently counted 39 source `.feature` files; scenarios were not recounted.

Consulted primary official framework/build/database/mock/rendering/analyzer documentation, with direct links recorded beside claims in the design/architecture. Current documentation may contain preview examples; the design explicitly requires verified stable artifact pins during approved implementation.

A local Python Markdown check inspected relative link targets and balanced triple-backtick fences. Final documentation-only result will be recorded below after role artifacts stabilize. This checks file references, not browser rendering or application correctness.

No Java 25 install, dependencies, executable code/configuration, container, server, browser demo, runtime build, application test, or automated quality configuration was executed or created. Proposed commands are not yet available. Final-results reporting does not remove the developer's test-first responsibility.

## Next actions and stop conditions

| Recipient | Required action | Completion condition |
| --- | --- | --- |
| Validator | Alignment completed; finalize own readiness record against design review | Plan ready for owner review; all implementation checks remain not run |
| Reviewer | Completed reconciled design review and checked closure | No unresolved design blocker; executed compatibility remains deferred to implementation |
| Coordinator | Reconcile initial decision/status drafts; present packet paths to owner | Explicit human approval of packet revision 1 or requested revisions recorded |
| Developer, only after approval | Implement approved setup with TDD, documentation, final results and demo | Independent validation/review can execute against identified content |
| Human owner | Review proposed scope/baseline and plan now; working demo/results later | Two explicit checkpoints; no agent supplies either |

Architect work stops at this design handoff. Implementation approval and optional cleanup policy remain owner decisions. Java 25/Docker prerequisites must be resolved before runtime validation; missing prerequisites cannot be reported as passes.

## Final documentation check

Read-only Python source check from the repository root inspected 24 Markdown files (`AGENTS.md`, `README.md`, and all `docs/**/*.md`), exited `0`, and reported no missing relative file targets, unbalanced triple-backtick fences, or trailing whitespace. This is basic source validation only. The actual script iterated files with `Path.rglob('*.md')`, extracted Markdown link targets, skipped HTTP/fragment links, checked target existence, counted fence parity, and compared each line with its right-trimmed value. No docs build, rendering, runtime tests or application checks have run.
