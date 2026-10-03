# SETUP-001 validator assignment

Sender: coordinator. Recipient: independent validator session. Cases: `SETUP-AC-01`–`SETUP-AC-17`, including UX cases identified in [plan](../acceptance-test-plan.md). No finance source scenarios are delivered by setup.

Inputs: `AGENTS.md`, coding standards, workflow, [design](../../../bootstrap-design.md), [architecture](../architecture.md), [UX](../ux-design.md), [canonical status](../status.md), and actual design approval when supplied.

Pre-coding scope, currently authorized: prepare acceptance outcomes, layer coverage, failure cases, isolation checks, and final evidence format. Reconcile contracts with architect/reviewer in Markdown. Permitted writes now: `acceptance-test-plan.md` and `validator-handoff.md` only. Stop before execution or implementation until approved design and delivered implementation are provided.

Later scope, after implementation: independently run delivered commands and the approved plan; inspect real loopback bindings including cleanup helpers, migrations, persistent marker, disposable DB isolation, MSW boundaries and docs usability. Write `validation.md` and update own handoff; do not repair production code silently or edit another role's findings/status.

Required final evidence: command/working directory/exit, exact tested revision plus dirty-content fingerprints, cases/test links, environment, final results, failures/skips, screenshots/traces where useful, defects and next recipient. Never supply passing unexecuted results or human acceptance. The developer owns test-first implementation tests.
