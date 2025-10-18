# Generate Change Logs from Git Commits

Generate Change Logs from Git Commits

## Installation

```bash
/plugin install generate-change-logs-from-git-commits
```

## Usage

### Command

```bash
/generate-change-logs-from-git-commits
```

## Details

### Instructions

Follow the prompts to generate change logs from the provided git commits


### Task

Task: Add change logs from Git Commits
1. Please retrieve all commits between SHA {{start_sha}} and SHA {{end_sha}} (inclusive) from the repository.

2. For each commit:
  - Extract the commit message
  - Extract the commit date
  - Extract any referenced issue/ticket numbers (patterns like #123, JIRA-456)

3. Organize the commits into the following categories:
  - Features: New functionality added (commits that mention "feat", "feature", "add", etc.)
  - Bug Fixes: Issues that were resolved (commits with "fix", "bug", "resolve", etc.)
  - Performance Improvements: Optimizations (commits with "perf", "optimize", "performance", etc.)
  - Documentation: Documentation changes (commits with "doc", "readme", etc.)
  - Refactoring: Code restructuring (commits with "refactor", "clean", etc.)
  - Other: Anything that doesn't fit above categories

4. Format the release notes as follows:
  
  # [Version/Date]
  
  ## Features
  - [Feature description] - [PR #number](PR link)
  
  
  ## Bug Fixes
  - [Bug fix description] - [PR #number](PR link)
  
  [Continue with other categories...]
  
  Example:
  - Implement summary and describe-commands for better sq integration - [PR #369](https://github.com/squareup/dx-ai-toolbox/pull/369)
  
5. Ensure all the commit items has a PR link. If you cannot find it, try again. If you still cannot find it, use the commit sha link instead. For example: [commit sha](commit url)

6. If commit messages follow conventional commit format (type(scope): message), use the type to categorize and include the scope in the notes.

7. Ignore merge commits and automated commits (like those from CI systems) unless they contain significant information.

8. For each category, sort entries by date (newest first).

9. formatted change logs as a markdown document

10. Create an empty CHANGELOG.md file if it does not exist

11. Read CHANGELOG.md and understand its format.

11. Insert the formatted change logs at the beginning of the CHANGELOG.md, and adjust its format to match the existing CHANGELOG.md format. Do not change any existing CHANGELOG.md content.



### Parameters

- **start_sha** (string, required)
  the start sha of the git commits

- **end_sha** (string, required)
  the end sha of the git commits


### Extensions

[object Object]





## Version

1.0.0
