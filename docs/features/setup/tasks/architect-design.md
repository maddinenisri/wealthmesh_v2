# SETUP-001 architect design assignment

Stage: authorized design work only. Sender: coordinator. Recipient: architect session. Source scenarios: none implemented; proposed acceptance cases `SETUP-AC-01`–`SETUP-AC-17` are local setup checks.

Inputs: root `AGENTS.md`, `docs/coding-standards.md`, existing workflow/role/decision drafts, source requirements text for inventory, and latest human choices: localhost/no login, Java 25, Compose PostgreSQL, independent Testcontainers, MSW, real-system E2E, Markdown agent communication, two human checkpoints, final results only.

Scope: recommend the concrete baseline; define API/persistence/process boundaries, loopback, health/persistence and test isolation, command contract, quality enforcement, dependency compatibility, snapshot policy and communication ownership. Reconcile UX/validator/reviewer artifacts without editing their reports.

Permitted changes: `AGENTS.md`, `README.md`, `docs/decisions.md`, `docs/workflow.md`, `docs/agent-roles.md`, `docs/bootstrap-design.md`, and setup-owned architecture/index/status/protocol/task/handoff Markdown. Initial status/decision drafts return to coordinator ownership after handoff.

Outputs: [setup design](../../../bootstrap-design.md), [architecture](../architecture.md), [review packet](../index.md), [protocol](../agent-protocol.md), [architecture handoff](../architecture-handoff.md). Record read-only environment checks and official references; distinguish proposal from executed compatibility.

Stop: after concrete reviewable design and reconciled handoff. No installation, executable configuration/scripts, application code, containers, servers, or implementation tests. No agent spawning. Human approval remains pending.
