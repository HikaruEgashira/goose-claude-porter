---
name: run-tests
description: Execute test suite with customizable options and coverage reporting
parameters:
  - name: test_type
    type: string
    description: "Type of tests to run (unit, integration, e2e, all)"
    required: true
  - name: coverage
    type: boolean
    description: "Generate coverage report"
    required: false
  - name: watch
    type: boolean
    description: "Watch mode for development"
    required: false
---

# Run Tests

Execute test suite with comprehensive reporting and coverage analysis.

## Description

This command runs your project's test suite with support for multiple testing frameworks and detailed reporting options. It can run unit tests, integration tests, end-to-end tests, or all tests together.

## Task

Execute the test suite for the current project with the specified test type and options. Provide detailed results including pass/fail status, coverage metrics, and performance data.

## Parameters

- **test_type** (string, required): Type of tests to run
  - `unit` - Unit tests only
  - `integration` - Integration tests only
  - `e2e` - End-to-end tests only
  - `all` - All test types (default)

- **coverage** (boolean, optional): Generate code coverage report

- **watch** (boolean, optional): Enable watch mode for development

## Example Usage

```
/run-tests test_type=unit coverage=true watch=false
/run-tests test_type=all coverage=true
/run-tests test_type=e2e
```

## Supported Frameworks

- Jest
- Vitest
- Pytest
- Mocha
- RSpec
- Go testing
- Rust testing

## Output

The command generates:
- Test results summary
- Pass/fail details
- Coverage report (if enabled)
- Performance metrics
- Failed test details with stack traces
