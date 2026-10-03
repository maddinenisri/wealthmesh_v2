# WealthMesh v2

WealthMesh v2 is a greenfield application for one household to manage its finances and understand its financial health. The MVP runs on the owner's computer through localhost and has no login.

The owner approved setup packet revision 1 on October 3, 2026. The application skeleton, persistent development database, test commands and Markdown reader are implemented. [Independent validation](docs/features/setup/validation.md) passes all required setup outcomes with zero required skips; [final review](docs/features/setup/review.md) recommends presentation. **Ready for human acceptance; not accepted.** Follow [canonical status](docs/features/setup/status.md) and the [working demo](docs/features/setup/demo.md).

## Start here

- [Current setup review packet](docs/features/setup/index.md)
- [Start, stop, verify and troubleshoot](docs/operations/index.md)
- [What changed in plain English](docs/features/setup/implementation.md)
- [Working local demo](docs/features/setup/demo.md)
- [Canonical setup status and human decisions](docs/features/setup/status.md)
- [Independent validation](docs/features/setup/validation.md) and [implementation review](docs/features/setup/review.md)
- [Captured requirement inventory](docs/requirements/inventory.md)
- [Confirmed human decisions](docs/decisions.md)
- [Open and resolved questions](docs/questions.md)
- [Feature delivery workflow](docs/workflow.md)
- [Agent responsibilities](docs/agent-roles.md)
- [Coding standards](docs/coding-standards.md)
- [Approved project setup design](docs/bootstrap-design.md)
- [Feature review packet template](docs/templates/feature-packet.md)
- [Copyable prompt for the next feature session](docs/prompts/next-feature-session.md)
- [FIN-001 next-session planning package: household and first checking](docs/features/household-checking/index.md) — recommended scope, not implemented or design-approved

The source requirements are in `../wealthmesh/docs/requirements/v2`. Setup captured an immutable text-only [snapshot and provenance](docs/requirements/index.md), with [current inventory](docs/requirements/inventory.md) recording 39 feature files and 262 scenario identities. No sibling implementation was imported or source file modified. Finance scenarios remain deferred for release selection; setup implements no household finance capability. Later source changes require a new dated capture/comparison rather than overwriting the snapshot.

## Run locally

First, check prerequisites from the repository root before running npm:

```sh
/bin/sh scripts/preflight.sh
```

This shell entry detects missing Node/npm, prints the required versions, then delegates to the existing npm preflight when tools are present. Follow [first-install guidance](docs/operations/index.md#first-installation) for selecting the pinned Node/npm baseline and installing project dependencies. After prerequisites are ready, run:

```sh
npm run preflight
npm run dev
npm run status
npm run stop
```

The application uses `http://127.0.0.1:5173`; the reader uses `http://127.0.0.1:5174`. `npm run docs:dev` starts the reader independently of Java/PostgreSQL. `npm run verify` runs required quality/build/test checks. See [operations](docs/operations/index.md) for effective ports, logs, installation, data ownership and safe troubleshooting; normal stop preserves development storage.

## Required approach

Use Java 25 for the backend, Testcontainers for backend integration tests, MSW for frontend network mocks, and automated end-to-end tests. Deliver one feature at a time through separate agent sessions. The human owner reviews each design before implementation and each working feature before acceptance.

PostgreSQL runs through Docker Compose for persistent local development. Integration and real-system E2E tests use independent disposable databases. All host services bind to loopback; there is no login or network deployment in the MVP.

Chat is for communication with the owner. Agents write generation plans, architecture decisions, bounded role tasks, handoffs, evidence and explanations in repository Markdown. The implemented local reader renders that record with navigation, search, diagrams and source references. [Operations](docs/operations/index.md) documents delivered commands; final role-owned evidence distinguishes developer checks from independent results. A passing suite or agent recommendation does not supply human acceptance.
