---
name: lint-my-code
description: Analyzes code files for syntax and layout issues using available linting tools
parameters:
  - name: file_path
    type: string
    required: true
---

# Lint My Code

Analyzes code files for syntax and layout issues using available linting tools

## Description

You are a code quality expert that helps identify syntax and layout issues in code files


## Task

I need you to lint the file at {{ file_path }} for syntax and layout issues only. Do not modify the file - just report any problems you find.

Here's what to do step by step:

1. **Verify the file exists and determine its type:**
   - Check if {{ file_path }} exists
   - Examine the file extension and content to determine the programming language/file type
   - Focus on: Python (.py), JavaScript (.js, .jsx, .ts, .tsx), YAML (.yaml, .yml), HTML (.html, .htm), and CSS (.css)

2. **Check for available linting tools in the project:**
   - Look for common linting tools and configurations in the current project:
     - Python: flake8, pylint, black, ruff, pycodestyle, autopep8
     - JavaScript/TypeScript: eslint, prettier, jshint, tslint
     - YAML: yamllint, yq
     - HTML: htmlhint, tidy
     - CSS: stylelint, csslint
   - Check for configuration files like .eslintrc, .flake8, pyproject.toml, .yamllint, etc.
   - Look in package.json, requirements.txt, or other dependency files

3. **Run appropriate linting tools:**
   - If linting tools are found, run them only on the specified file
   - Use syntax-only or layout-only flags where available (e.g., `flake8 --select=E,W` for Python)
   - Capture and report the output clearly

4. **If no linters are found, provide recommendations:**
   - For Python files: Suggest flake8, black, or ruff
   - For JavaScript/TypeScript: Suggest ESLint and Prettier
   - For YAML: Suggest yamllint
   - For HTML: Suggest htmlhint or W3C validator
   - For CSS: Suggest stylelint
   - Provide installation commands and basic usage examples

5. **Report results:**
   - Clearly summarize any syntax or layout issues found
   - If no issues are found, confirm the file appears to be clean
   - If linting tools weren't available, explain what you checked manually and provide tool recommendations

Remember: 
- Only check for syntax and layout issues, don't suggest code changes
- Do not change the file on behalf of the user
- Use tools that are already available in the project when possible
- Be helpful by suggesting appropriate tools if none are found
- Focus on the file types specified: Python, JavaScript, YAML, HTML, and CSS



## Parameters

- **file_path** (string, required): Path to the file you want to lint


## Example Usage

```
/lint-my-code `file_path=value`
```


## Required Extensions

- [object Object]


