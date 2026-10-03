# Coding standards

These standards apply to handwritten production code and tests. They implement the owner's requirement for strict software engineering principles, DRY, reusable components, purposeful design patterns, and methods with one responsibility. Framework-specific rules apply when the corresponding technology baseline is approved.

Readable code is part of delivering a feature the owner can understand and maintain. Passing tests alone does not establish compliance with these standards.

## Single responsibility

Each method performs one coherent task at one level of abstraction. Each class, module, hook, and component has a clear reason to change.

An application service may coordinate a single use case through named collaborators. It should not also implement parsing, financial arithmetic, SQL, response formatting, and UI behavior. Extract those responsibilities into their appropriate boundaries. Do not split code into meaningless one-line helpers merely to reduce method length.

Names must describe the work or domain concept. Prefer `calculateClosingBalance` or `validateTransfer` over `process`, `handleData`, or unrelated utilities collected in a `CommonHelper` class. Parameters and return types should make the contract clear.

Do not mix queries with mutation. A method that reads an overview must not create transactions, update balances, or complete reminders. Commands should make their effects explicit.

## Control flow and complexity

- Use guard clauses for invalid input and impossible states instead of wrapping the main flow in nested conditions.
- Prefer small named predicates when they explain a business condition. Avoid dense combinations of negations and boolean operators.
- Extract distinct behaviors into cohesive functions or collaborators. Use a strategy or equivalent dispatch only when real alternative behaviors justify it.
- Avoid boolean arguments that switch a method between unrelated jobs. Use explicit operations or a meaningful type.
- Avoid nested ternaries and long branching chains combining unrelated business rules.
- Represent domain states explicitly. Do not silently treat unknown balances as zero or substitute a fallback that hides incomplete information.

Initial review triggers are more than two nested control-flow levels, cyclomatic complexity above 10, or a method above 40 nonblank, noncomment lines. These are review thresholds, not proof of correctness and not a reason to fragment a coherent operation. The reviewer requires refactoring or a documented, narrow justification. Declarative markup, generated code, and data fixtures are assessed according to their structure rather than mechanically using the same line threshold.

One responsibility remains mandatory even when a method is short. Naming helpers after individual lines does not resolve a mixed-responsibility design.

## DRY and authoritative rules

Maintain one authoritative implementation of each business rule. Balance calculations, transfer classification, refund handling, rounding, and investment funding rules must not be independently reimplemented across endpoints or screens.

Extract repeated logic when the same rule or responsibility appears in multiple places. Similar-looking code with different meanings may remain separate. Reuse must preserve clear ownership and should not require unrelated feature flags or complex configuration.

Frontend validation may give immediate feedback while the backend independently validates every command. That boundary protection is intentional. Keep their contracts aligned; the frontend is not authoritative for financial integrity.

Reuse transport schemas or contract checks where useful without coupling the UI to database entities. Keep MSW handlers aligned with the API contract. Mock results do not prove that the backend follows that contract.

## Reusable UI components

When React is selected, separate reusable controls, feature components, page composition, API access, and domain presentation. A page should compose these pieces rather than contain all networking, state transitions, calculations, and markup.

Shared controls such as amount inputs, date inputs, form fields, loading indicators, and error messages should have consistent typed interfaces and accessible behavior. Feature components should own the behavior of their feature. Extract a shared component when its responsibility and actual reuse are clear.

Prefer composition to a universal component controlled by many boolean props. Avoid components that render unrelated screens according to a growing collection of flags. Keep a small shared component library grounded in current feature needs.

Every interactive component must support relevant keyboard access, labels, focus handling, validation, and disabled or loading states. Do not make shared components responsible for financial policies belonging to the domain.

## Architecture and engineering principles

Keep domain rules, use-case coordination, transport, and persistence responsibilities distinct. Dependencies should flow through explicit boundaries without cycles. A module's internal implementation should not become another module's convenient shortcut.

Use SOLID principles to preserve cohesive responsibilities and replaceable boundaries. Prefer composition, small interfaces, explicit dependencies, and immutable values where practical. Do not create an interface for every class or an inheritance tree without a concrete need.

Use simple solutions that satisfy approved behavior. Do not build speculative frameworks, plugin systems, generic repositories, or future infrastructure. Remove dead code and obsolete abstractions when changing the behavior that made them necessary.

Keep side effects visible. Make clocks and external services controllable in tests when the behavior depends on them. Define transaction boundaries around a coherent operation; multi-account transfers must not save only one side of the movement.

## Design patterns

Choose a pattern because it resolves an observed design problem. Explain the problem and benefit in the feature packet when a pattern materially shapes the implementation.

| Situation | Suitable approach when justified |
| --- | --- |
| Several actual calculation behaviors share a stable contract | Strategy or explicit domain dispatch |
| Domain code needs an external or persistence dependency | Adapter behind a meaningful boundary |
| A use case coordinates domain rules and persistence | Application service |
| Values such as money need enforced invariants | Immutable value object |
| Independent UI pieces need to be assembled flexibly | Component composition |

These are options rather than required classes for every feature. Do not add patterns to meet a checklist. Prefer a straightforward function when it solves the problem clearly.

## Java and financial data

- Use meaningful domain types and explicit API request and response types. Do not expose persistence entities as public API contracts.
- Use exact decimal representations for money. In Java, use `BigDecimal` or an approved value type backed by it; do not create monetary values from binary floating-point inputs.
- Specify currency, scale, and rounding at the appropriate boundaries. Share one authoritative rounding policy for each operation.
- Distinguish a financial date from an event timestamp. Make date and timezone assumptions explicit and test month boundaries when relevant.
- Validate inputs at the API boundary and enforce financial invariants in the domain. Database constraints provide additional integrity protection.
- Prefer immutable inputs and results where practical. Avoid mutable global state and hidden dependencies.
- Handle expected failures explicitly. Do not swallow exceptions or return a successful-looking zero or empty value after an unexpected failure.

## TypeScript and frontend data

- Use strict type checking if TypeScript is selected. Do not use `any` or unchecked assertions to bypass an unclear contract.
- Validate untrusted runtime data at boundaries; compile-time types do not validate network responses.
- Keep API calls out of reusable presentation controls. Encapsulate network and asynchronous state behavior in a cohesive service or hook.
- Avoid effects that duplicate derived state or trigger circular updates. Keep a clear source of truth for each state value.
- Do not perform authoritative money arithmetic using JavaScript floating-point numbers. Use backend-calculated amounts or a deliberate exact representation when arithmetic is necessary.
- Keep display formatting separate from calculation. Currency formatting must not change stored values or hide an unknown amount.

## Errors and observability

Define actionable user-facing errors and distinguish invalid input, domain rejection, unavailable dependencies, and unexpected failures. Preserve entered form data where the approved behavior requires it.

Use structured logs and request correlation at useful boundaries. Logs should explain failures without exposing real financial records or secrets. Avoid catching every exception in individual methods; translate failures at the boundary responsible for their meaning.

## Tests and maintainability

Follow test-first development for behavior changes. Test observable behavior and business invariants rather than private method structure. Use descriptive test names and independent scenarios with deterministic dates and synthetic data.

Use Testcontainers for database integration and MSW for frontend network isolation. Full-system tests exercise the real backend. Do not mock away the financial rule a test claims to verify.

Keep test setup clear. Shared fixtures may eliminate repeated mechanics, but should not conceal the relevant starting amounts or couple scenarios to execution order. Avoid brittle timing sleeps and tests that merely repeat implementation expressions.

Provide final commands and results to the owner, according to the agreed reporting preference. A passing report must identify its tested revision and explicitly mention skipped required checks.

## Enforcement and role ownership

The architect defines domain boundaries, authoritative rules, and justified abstractions. The developer follows them and performs a self-review before handoff. The validator executes required behavior and contract checks. The reviewer checks responsibility, duplication, complexity, reuse, patterns, integrity, and readability independently.

Established standards violations require correction before the reviewer recommends acceptance. Optional improvements beyond these standards may be recorded separately; their general severity policy remains open. A reviewer may approve a narrow justified exception to a mechanical threshold and must record the reason. Exceptions must not waive a financial invariant, mix unrelated responsibilities, or silently weaken an approved requirement.

During approved project setup, configure formatting, linting, type checking, applicable static analysis, and verification commands. Document which requirements are automated and which depend on review. Do not claim automated enforcement before the configuration exists and executes. Do not suppress a finding or weaken a rule without a documented review rationale.
