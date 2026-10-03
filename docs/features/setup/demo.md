# SETUP-001 working demo

The implemented demo is available on this computer through the addresses below after `npm run dev`. Developer verification passes; independent validation, reviewer closure and owner acceptance are separate checkpoints in [canonical status](status.md). The coordinator presents acceptance only after those role checks finish.

| Page                 | Local address                             | What to observe                                                     |
| -------------------- | ----------------------------------------- | ------------------------------------------------------------------- |
| Application          | `http://127.0.0.1:5173`                   | Setup ready; installation version 1 read from PostgreSQL            |
| Documentation        | `http://127.0.0.1:5174`                   | Saved Markdown, navigation, local search, diagrams and source paths |
| Read-only status API | `http://127.0.0.1:8080/api/system/status` | Actual `{ "status": "ready", "installationVersion": "1" }`          |

## Walkthrough for the owner

1. Open the application. “Setup ready” confirms the screen, Java server and persistent database work together. Refresh and see the same stored version.
2. Open documentation. Read [what changed](implementation.md), then follow architecture, agent roles/tasks/handoffs, separate questions and decisions, and the operating guide.
3. Search for `Testcontainers`. Follow a result, inspect a diagram and expand its original source. The canonical Markdown path tells you where to inspect or change the written explanation.
4. Read [final developer evidence](platform-implementation.md) and the separate [validation](validation.md)/[review](review.md) reports. Acceptance remains your decision; no browser button or agent supplies it.

No live failure exercise or calculation trace is required for this demo. The approved working pages provide the clickable design demonstration. Account, spending, debt, savings and net-worth features await their own design reviews.

## Operating reference

Run `npm run status` to inspect tracked ownership. Normal `npm run stop` preserves the database volume; `npm run dev` starts it again. `npm run docs:dev` runs the independent reader while Java/PostgreSQL are stopped. Read [operations](../../operations/index.md) for configuration, logs, tests and safe backup/restore boundaries. Screenshots and exact test-resource identities are referenced in the platform report; test data is synthetic.

The developer leaves the approved services running for the owner demo after final checks. Independent validation may temporarily stop/restart them within its bounded assignment and restores the agreed demo state; use canonical status and the role report for the latest actual readiness.
