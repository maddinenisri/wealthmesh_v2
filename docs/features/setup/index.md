# Project setup: your review packet

Feature: `SETUP-001`. Approved packet revision: 1, October 3, 2026. [Canonical status](status.md): **READY FOR HUMAN ACCEPTANCE — not accepted**. Independent validation passed with zero required skips; final reviewer recommends presenting setup. Your acceptance remains pending.

## Start with the working feature

1. Open [application](http://127.0.0.1:5173) and [documentation](http://127.0.0.1:5174); the validator restored the local demo after its checks.
2. Read [plain-English changes](implementation.md) and follow the [demo](demo.md).
3. Read [independent results](validation.md) and [final review](review.md); all required outcomes and finding closures are recorded.
4. Keep [operations](../../operations/index.md) for installation, start/stop and troubleshooting.

[Setup acceptance Q-009](../../questions.md#q-009-setup-feature-acceptance) is open. Only your answer can accept this feature; the initial local Git commit records delivery without accepting or publishing it.

## What you will receive

A local application screen that reads a synthetic setup record from PostgreSQL, commands to start/stop the project and run its checks, and a searchable browser view of the Markdown the agents write. Development data survives restarts; tests use independent temporary databases. No household finance feature or login is added in this delivery.

## Choices for this design review

Already confirmed: Java 25, PostgreSQL through Docker Compose, localhost only, no login, Testcontainers, MSW, real-system E2E, strict engineering standards, agent-authored Markdown, separate role sessions, and one feature at a time.

The owner approved the following baseline together: one Spring Boot application with Gradle wrapper, JDBC and Flyway; React/TypeScript/Vite frontend; Vitest/Testing Library for isolated tests; Playwright for real-system checks; and stable VitePress for the documentation reader. [The full design](../../bootstrap-design.md) explains the costs, exact command contract, and automated/manual quality checks. Exact compatible stable versions and locks are implementation outputs.

Default local addresses: app `127.0.0.1:5173`, Java API `127.0.0.1:8080`, documentation `127.0.0.1:5174`, PostgreSQL `127.0.0.1:5433`. Compose runs the persistent development database only; backend and frontend run on the host. Startup waits for health; shutdown preserves data and affects only this project's resources.

The annotated design is available now. The clickable working viewer is part of approved implementation and the acceptance demo. There is no separate prototype or third required human checkpoint.

## Read in this order

1. [UX proposal](ux-design.md): what the documentation browser shows and how you find agent work.
2. [Acceptance plan](acceptance-test-plan.md): checks the validator will independently run after coding.
3. [Architecture](architecture.md): plain-English connections, proposed API/data, isolation and dependency tradeoffs.
4. [Full setup design](../../bootstrap-design.md): commands, standards enforcement, source snapshot policy and scope.
5. [Independent design review](design-review.md): reconciled findings and remaining limitations.

## How agents communicate

Agents write bounded [task briefs and handoffs](agent-protocol.md) in repository Markdown. Chat is for communication with you. Agent tool messages carry document paths or readiness notifications; decisions and technical handoffs live in the files. The coordinator maintains separate [questions](../../questions.md) and [human decisions](../../decisions.md), and records canonical status; developer, validator and reviewer remain separate sessions.

## Current limitations and decisions

The initial Java-absent and Docker-blocked observations are historical. [Backend evidence](backend-implementation.md) now reports a project-local Java 25 installation and passing backend unit/integration/static/build checks; [platform evidence](platform-implementation.md) reports verified Docker access and executed frontend/real-system development checks. These are attributed developer results, not independent validation.

The [final independent validation](validation.md) establishes all required setup outcomes with zero required skips, including the targeted missing-Node prerequisite correction, persistent-data checks and exact disposable cleanup. [Final review](review.md) closes all six findings and VD-01 and recommends presenting setup. The [explanation](implementation.md) and [demo](demo.md) are ready; human acceptance remains pending. See final reports for limitations, including Mermaid's visible bundle-size warning and the printed URL needed for a docs port override. No household finance behavior or deployment is claimed.

Your design approval is recorded in [canonical status](status.md) and [D-022](../../decisions.md#d-022-setup-design-approval). Implementation proceeds within this scope. The broader handling of optional cleanup findings remains [Q-002](../../questions.md#q-002-review-findings-and-disagreement-policy); strict established coding standards continue to apply. Future finance scope remains [Q-004](../../questions.md#q-004-first-usable-finance-release).

After implementation, you will see the working system and final test results with a plain-English explanation of the changes. Only your explicit acceptance completes setup.
