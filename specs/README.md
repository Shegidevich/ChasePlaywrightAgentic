# Specs

This directory contains **human-readable test plans** produced by the 🎭 **planner** agent.

Each spec is a structured Markdown document describing scenarios, steps, expected
outcomes, and data. The 🎭 **generator** agent transforms these plans into
executable Playwright tests under `tests/`.

## Conventions

- One spec file per feature / user flow, e.g. `basic-operations.md`.
- Specs can start from scratch or extend the `seed.spec.ts` test.
- Keep specs precise enough for test generation but human-readable.

## Example

```markdown
# Basic Operations

## Scenario: Add a valid todo

1. Open the app.
2. Type "Buy milk" into the new-todo input.
3. Press Enter.
4. Expect the todo "Buy milk" to appear in the list.
```
