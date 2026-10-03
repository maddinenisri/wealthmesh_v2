# WealthMesh v2 questions

The coordinator owns this register. Questions have stable IDs and remain here after resolution. Actual human decisions live in [decisions](decisions.md); setup approval and acceptance facts are canonical in [setup status](features/setup/status.md). Updated October 3, 2026.

Agents propose questions and alternatives in their role handoffs. The coordinator records them here, communicates with the owner in chat, and records the supplied answer and decision link. An open question blocks only work that depends on its answer. Do not infer answers from silence or add another mandatory checkpoint.

## Q-001: UX review format

- Owner: human product owner; coordinator records the answer.
- Status: resolved for SETUP-001; future feature prototype scope is decided in its design packet.
- Question: should design review use annotated sketches, a clickable prototype, or both?
- Rationale/options: annotated screens make states and wording visible; a clickable experience reveals navigation. The owner originally answered “recommend between 1 and 2 or both.” Setup revision 1 proposes annotated design followed by the working viewer during implementation/acceptance, without a separate executable prototype or third gate.
- Answer: approval of setup revision 1 on October 3, 2026 accepts that setup-specific sequence.
- Decision: [D-022](decisions.md#d-022-setup-design-approval).

## Q-002: Review findings and disagreement policy

- Owner: human product owner; coordinator gathers reviewer/validator proposals.
- Status: open; nonblocking for approved setup implementation.
- Question: which optional cleanup findings block acceptance, and when should role disagreements escalate?
- Rationale/options: [workflow proposal](workflow.md#proposed-disagreement-policy) suggests escalation after two unsuccessful correction cycles. Alternatives include immediate escalation for scope disputes or role resolution of optional cleanup before escalation. No option has been selected.
- Answer: not supplied. Existing required behavior, test evidence, data integrity and coding-standard obligations remain binding; this question cannot waive them.
- Decision: none yet.

## Q-003: Setup framework/tool baseline

- Owner: human product owner; architect supplies the proposal.
- Status: resolved for SETUP-001 revision 1.
- Question: which backend/frontend tools and documentation renderer establish the baseline?
- Rationale/options: the [approved packet](features/setup/index.md) and [architecture tradeoffs](features/setup/architecture.md#tradeoffs-for-the-owner) compare Spring Boot/Gradle/JDBC/Flyway, React/TypeScript/Vite, Playwright and stable VitePress with simpler alternatives.
- Answer: setup revision 1 approved October 3, 2026. Exact compatible stable patches and locks are implementation outputs under that baseline.
- Decision: [D-022](decisions.md#d-022-setup-design-approval).

## Q-004: First usable finance release

- Owner: human product owner; coordinator gathers requirement inventory and feature proposals.
- Status: open; does not block setup.
- Question: which requirement scenarios belong in the first usable finance release and first finance feature?
- Rationale/options: select a narrow usable slice or a larger group of related capabilities after the immutable requirement inventory is available. No finance scope is implied by setup approval.
- Answer: not supplied.
- Decision: none yet.

## Q-005: Browser editing and human communication

- Owner: human product owner; coordinator records the answer.
- Status: resolved for setup.
- Question: should the browser viewer edit documents or collect approvals?
- Rationale/options: read-only Markdown viewing is the setup proposal; browser editing/approval controls would add application behavior and operational cost.
- Answer: owner directed chat for human communication and agent-authored Markdown for generation and architecture records. Approved setup excludes browser editing, approval buttons and agent controls.
- Decisions: [D-018/D-019](decisions.md#confirmed-by-the-owner), [D-022](decisions.md#d-022-setup-design-approval).

## Q-006: Separate question and decision records

- Owner: human product owner; coordinator maintains the records.
- Status: resolved October 3, 2026.
- Question: where do unanswered questions and supplied human decisions live?
- Rationale/options: separate registers preserve unresolved alternatives without presenting them as decisions. Stable IDs link a question to its eventual answer.
- Answer: “we need to maintian separate markdwon document for questions and descisions and also updated my descision for approval docs/features/setup/index.md”.
- Decision: [D-021](decisions.md#d-021-separate-question-and-decision-records).

## Q-007: Setup design checkpoint

- Owner: human product owner; coordinator records the response.
- Status: resolved October 3, 2026; feature acceptance remains pending.
- Question: approve or revise SETUP-001 packet revision 1 and its acceptance plan before coding?
- Rationale/options: approve the concrete packet or request a revised design at the established first checkpoint.
- Answer: the owner's latest words, recorded under Q-006, explicitly approve `docs/features/setup/index.md` revision 1. They authorize its implementation and do not accept the unbuilt feature.
- Decision: [D-022](decisions.md#d-022-setup-design-approval); canonical [status](features/setup/status.md).

## Q-008: Simplify setup and future delivery

- Owner: human product owner; coordinator records the answer.
- Status: resolved October 3, 2026.
- Question: finish the current setup with a lighter workflow for future features, or simplify the existing infrastructure now?
- Rationale: the owner raised concern that setup became too complex and slow, including custom supervision, repeated checks/fingerprints and many handoffs. Pasted suggested options are discussion material, not a selected decision.
- Options/proposed guidance: finish the remaining bounded setup work, then use one feature document, separate questions/decisions, commits and about five behavior-focused checks for future delivery; alternatively simplify existing infrastructure now, with concrete retained/removed scope recorded after the owner chooses. These are proposals, not authorization to remove approved code or checks.
- Answer: “Finish setup; use the lighter workflow going forward”.
- Current bounded work: missing-Node prerequisite correction, cleanup/restored demo and concise consolidation of actual final results. No new supplemental tests. This constraint does not turn incomplete or failed checks into passes.
- Decision: [D-023](decisions.md#d-023-finish-setup-and-simplify-future-workflow). Current setup retains truthful evidence and targeted VD-01 correction; no infrastructure refactor or retroactive outcome waiver. Setup approval and human acceptance remain distinct in [canonical status](features/setup/status.md).

## Q-009: Setup feature acceptance

- Owner: human product owner; coordinator records the answer.
- Status: open, October 3, 2026; ready for human acceptance review.
- Question: accept completed SETUP-001 after reviewing the working demo, plain-English explanation and final independent evidence, or request changes?
- Rationale/options: [validation](features/setup/validation.md) passes required outcomes with zero required skips; [review](features/setup/review.md) recommends presentation. Review the [demo](features/setup/demo.md), [changes](features/setup/implementation.md) and limits before accepting or identifying required changes.
- Answer: not supplied. Setup remains **not accepted**.
- Decision: none; record only the owner's actual answer in [decisions](decisions.md). Design approval and local Git bookkeeping are separate from acceptance.
