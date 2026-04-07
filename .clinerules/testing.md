---
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "**/__tests__/**"
  - "**/tests/**"
---

# Testing Standards

When creating or modifying tests:
- Use descriptive test names: "should [expected behavior] when [condition]"
- One assertion per test when possible
- Mock external dependencies, not internal modules
- Use factories for test data, not fixtures
- Follow TDD: RED → GREEN → REFACTOR
  1. Write a failing test first
  2. Write minimum code to pass
  3. Refactor, confirm all tests still pass
