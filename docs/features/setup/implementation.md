# SETUP-001 implementation and high-level changes

Project setup now runs locally: an application screen, Java server, persistent PostgreSQL database, repeatable tests and a browser reader for agent-written Markdown. Developer checks pass. Separate independent validation and review precede your acceptance; [canonical status](status.md) records those checkpoints. No household finance feature is implemented yet.

## What changed in plain English

The screen asks the Java server whether setup is ready. On startup, a numbered database migration creates a small installation record with version `1`. The server reads that saved version and the screen displays it. Reading status never repairs or inserts missing data. If the record cannot be read, the screen explains the problem and offers retry.

The implementation gives each part one job: the screen displays state, a frontend boundary checks responses/timeouts, a Java service coordinates the status request, and a repository reads PostgreSQL. Shared failure presentation and centralized configuration avoid repeated behavior. Formatting, type and complexity checks run automatically; independent review checks that responsibilities, reuse and design remain understandable.

Development data survives normal restarts in this project's named PostgreSQL volume. Tests use fresh temporary PostgreSQL databases. MSW supplies deliberate responses only in isolated frontend tests. Full-system browser tests reach real Java and PostgreSQL, change only disposable synthetic data, and verify the displayed value follows the database. Each test run removes its own resources, including its enabled cleanup helper.

A separate reader renders the same Markdown agents save into navigable, searchable pages. It stays available when the application and database are stopped. Questions and actual decisions have separate pages. Diagrams expose their original source; saved Markdown refreshes the page and search. The reader cannot approve a feature or execute an agent.

## Final developer checks and ownership

The complete verification command passed. Java has 3 unit and 12 real-database integration tests; the frontend has 10 MSW cases; platform safety has 5 tests; documentation has 16 unit checks plus 10 browser cases. Two independent full-system runs passed with development PostgreSQL stopped, and controlled browser/startup failures cleaned their exact owned resources while existing development services stayed healthy. Required skips: 0. The final pinned npm lock installs cleanly and its audit reports 0 vulnerabilities. Exact commands, content identity and boundaries remain in the technical reports.

- [Backend implementation](backend-implementation.md): migration, read-only HTTP contract, Java boundaries, test fixtures and backend evidence.
- [Platform implementation](platform-implementation.md): frontend states, lifecycle ownership, Compose, full-system tests and integrated evidence.
- [Documentation implementation](docs-implementation.md): renderer, local search, source disclosure and immutable requirements snapshot.
- [Working demo](demo.md) and [operations](../../operations/index.md): local addresses, run/stop/test commands, diagnostics, data and backup locations.
- [Independent validation](validation.md) and [review](review.md): separately authored results; developer passing checks do not supply either role's approval.

## Boundaries of this delivery

This is localhost only, without login. Installation metadata proves the application path; it is not a household account or financial record. The captured 39 feature requirements and 262 scenario identities are source material for future scope decisions, with no finance scenario claimed complete. Mermaid's large bundle warning remains visible; there is no deployment, storage reset or automatic acceptance.
