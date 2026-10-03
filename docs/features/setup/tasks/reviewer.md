# SETUP-001 reviewer assignment

Sender: coordinator. Recipient: independent reviewer session. Cases: `SETUP-AC-01`–`SETUP-AC-17`; no finance scenario completion. Inputs: `AGENTS.md`, coding standards, workflow/role contracts, [design](../../../bootstrap-design.md), [architecture](../architecture.md), [UX](../ux-design.md), [plan](../acceptance-test-plan.md) and [status](../status.md).

Current authorized scope: independently review the setup design for feasibility, isolation, readability, compatibility claims, test quality, standards enforcement and human checkpoints. Permitted writes now: `design-review.md` and `reviewer-handoff.md`. Check role resolutions and name open findings; do not change their reports or author implementation.

Later scope after delivered implementation and independent evidence: inspect code, tests, migrations, lifecycle ownership, actual quality enforcement, manual single responsibility/DRY/reuse/patterns, docs and operating guidance. Write own `review.md` with findings, checked resolutions, scope, tested revision and recommendation.

The reviewer cannot approve implementation it authored, waive financial invariants, weaken required checks, or supply human approval/acceptance. Established coding standards apply; optional cleanup severity remains open. Narrow mechanical exceptions require recorded rationale under the standards.

Stop: after scoped review and handoff. No production changes, container/server operations, installs or execution before authorized implementation validation. Notify paths/readiness; substantive findings belong in Markdown.
