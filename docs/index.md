# WealthMesh: household financial health

This project is for one household, on this computer through localhost, without login. Project setup is the current delivery. Household finance capabilities are future features; setup itself creates no accounts, balances, spending records or investments.

## Current work and your review

Open the [setup packet](features/setup/index.md) for the delivery goal and reading order. The [canonical status](features/setup/status.md) records design, implementation, independent validation, review and the next human checkpoint. Approval and acceptance are distinct recorded decisions; this reader does not infer either from tests or files.

- [Questions awaiting or retaining your answers](questions.md)
- [Human decisions and their history](decisions.md)
- [Feature index](features/index.md)
- [Requirements captured for future scope selection](requirements/index.md)

## Understand what agents build

Read the [annotated screens](features/setup/ux-design.md), [architecture](features/setup/architecture.md) and [acceptance test plan](features/setup/acceptance-test-plan.md) together. [Agent responsibilities](agent-roles.md) and [bounded tasks and handoffs](features/setup/agent-protocol.md) explain who produces and independently checks each result.

This diagram shows the communication path. Agents write repository Markdown; the local reader displays it. You use chat for questions and decisions, and the coordinator records consequential answers in the separate registers. No approval button, document editor or agent execution control is part of this reader.

```mermaid
flowchart LR
  A[Separate role agents] -->|Write| M[Repository Markdown]
  M -->|Render locally| R[Documentation reader]
  R --> H[Household owner]
  H -->|Discuss and decide in chat| C[Coordinator]
  C -->|Record human answers| M
```

The source section below the diagram retains the original text and canonical Markdown path. Diagram failure keeps that source and ordinary article text available.

## Find explanations and evidence

The developer handoffs explain the work at three boundaries: [Java backend](features/setup/backend-implementation.md), [platform and frontend](features/setup/platform-implementation.md), and [documentation reader and requirements snapshot](features/setup/docs-implementation.md). Their results are developer evidence. Independent validation and review are separately recorded before a working demo is presented for human acceptance.

Open the [plain-English implementation explanation](features/setup/implementation.md), [working demo](features/setup/demo.md) and [operating guide](operations/index.md) for the integrated delivery. Missing outputs must remain identified as unavailable in their role records; a proposed command is not a passing test.

## Use the reader

Use **Search documentation** to search local page titles and content. The sidebar leads to the current feature, questions, decisions, roles and engineering reference. Saved Markdown refreshes during the development server session; diagrams render locally and search uses no external service. The reader can run while Java and PostgreSQL are stopped.

Each page shows its canonical Markdown source path at the end. Code references outside documentation are labelled **Local source path**, with a line reference where supplied. Select and copy these paths into your editor; browser navigation follows rendered Markdown pages. The reader does not serve arbitrary disk files.

For maintenance expectations, read [coding standards](coding-standards.md) and [delivery workflow](workflow.md). For lifecycle commands and technical troubleshooting, read the [operating guide](operations/index.md).
