# SETUP-001 UX architect handoff

Status: **Design draft ready for setup packet review.** This is a planning handoff, not implementation, validation, or human approval.

## Assignment and inputs

Feature: `SETUP-001`, local project setup and documentation reader. Proposed UX check IDs: `SETUP-UX-01`–`SETUP-UX-08`; no finance scenario is implemented by this task.

Permitted work was limited to [UX design](ux-design.md) and this handoff. Inputs were [agent instructions](../../../AGENTS.md), [workflow](../../workflow.md), [coding standards](../../coding-standards.md), [setup proposal](../../bootstrap-design.md), and the coordinator's bounded assignment. The baseline remains a proposal; no approved implementation revision exists for this handoff.

## Result

The design specifies a local read-only Markdown viewer with stable navigation, search, current feature and decision links, role work, plain-English changes, demo references, final results, and operating guidance. It includes annotated start and feature page wireframes, explicit content/error states, accessibility expectations, and proposed acceptance observations.

Design approval, implementation, validation, independent review and human acceptance remain distinct written facts. Missing facts stay unrecorded. An old test report keeps its revision visible. No status field or passing suite supplies human approval.

Recommend annotated sketches for the preimplementation review and the working viewer as the clickable experience within the approved setup delivery. No separate prototype is proposed for immediate execution. A separately requested preimplementation prototype would follow its own scoped authorization in the agent instructions.

The reader must remain useful while the finance backend or PostgreSQL is down. Mermaid diagrams require explicit local rendering, text descriptions and accessible source; an unrendered code fence does not meet the diagram requirement.

## Verification and limits

This task inspected the input Markdown and authored the two scoped files. A local Markdown check found no missing relative link targets and balanced fenced blocks in both files. No code, dependencies, executable tooling, server, database, prototype, browser interaction or runtime test was created or executed. Proposed checks are not passing results. Link targets in future project overview, feature index, architecture and validator artifacts must be finalized by their owners.

## Next receiving tasks

| Recipient | Required action | Completion condition |
| --- | --- | --- |
| Coordinator | Link this design into the concrete setup packet; choose canonical overview/current-feature/index paths; record human review and feedback in Markdown | Packet names the UX scope, pending decisions and source revision; explicit human approval precedes implementation |
| Architect | Reconcile viewer independence, local Markdown refresh/search, Mermaid integration and practical source-code links with [setup proposal](../../bootstrap-design.md) and its architecture artifact | Concrete approved baseline supports the reading requirements without another service or external renderer |
| Validator | Incorporate `SETUP-UX-01`–`SETUP-UX-08` into the pre-code acceptance plan and independent postimplementation checks | Human reviews the plan with the design; results later identify tested revision and skips |
| Developer, after approval | Implement the smallest viewer configuration and content navigation that meet the approved design | Working click-through, diagram and edit-refresh behavior supported by required checks and written guide |
| Reviewer | Check truthful state presentation, purposeful reuse, link behavior and readability against the approved packet | Findings resolved before acceptance recommendation |

Architect and validator artifacts are in preparation; this handoff does not claim they already exist or were reviewed. Refer to the coordinator's setup packet for their canonical paths when available.

## Unresolved UX decisions

No additional preference question is needed before the setup packet review. The owner must still approve the concrete setup design, including this proposed viewer scope. Mermaid integration, source-link mechanics, canonical content paths and final acceptance-plan consolidation are assigned technical/documentation deliverables above.
