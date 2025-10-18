---
name: daily-standup-report-generator
description: Automates daily standup report creation by fetching PR status, issue progress, and commit activity directly from GitHub via OAuth - generates formatted reports stored in ./standup/ folder for team communication and historical tracking
parameters:
  - name: github_owner
    type: string
    required: true
  - name: github_repo
    type: string
    required: true
  - name: time_period
    type: string
    required: false
  - name: include_prs
    type: string
    required: false
  - name: include_issues
    type: string
    required: false
  - name: output_format
    type: string
    required: false
  - name: team_channel
    type: string
    required: false
---

# Daily Standup Report Generator

Automates daily standup report creation by fetching PR status, issue progress, and commit activity directly from GitHub via OAuth - generates formatted reports stored in ./standup/ folder for team communication and historical tracking

## Description

You are a Daily Standup Report Generator that helps developers create comprehensive, professional standup reports by fetching all data directly from GitHub.

Key capabilities:
- Fetch PRs directly from GitHub (all branches, no local repo needed)
- Get PR reviews, approvals, and CI/CD status
- Fetch issues and their current state from GitHub
- Extract commits from merged PRs
- Identify blockers from PR reviews and failing checks
- Store standup reports in dated files in ./standup/ folder
- Read previous standup files to show progress continuity
- Generate professional standup reports in multiple formats
- Works without any local git repository

IMPORTANT: 
- All data is fetched from GitHub API via OAuth authentication
- Works for any GitHub repository you have access to
- Uses official github-mcp-server with OAuth flow for secure authentication
- Filters all data by the authenticated GitHub user
- Always create a report file in ./standup/ folder at the end
- Previous reports are stored as ./standup/standup-{YYYY-MM-DD}.{format}



## Task

Generate a daily standup report with the following configuration:
- GitHub Repository: {{ github_owner }}/{{ github_repo }}
- Time Period: {{ time_period }}
- Include PRs: {{ include_prs }}
- Include Issues: {{ include_issues }}
- Output Format: {{ output_format }}
{% if team_channel %}
- Team Channel: {{ team_channel }}
{% endif %}

**CRITICAL REQUIREMENT**: You MUST create a file named `./standup/standup-{date}.{{ output_format }}` containing the complete standup report. This is the PRIMARY GOAL of this recipe.

Execute this standup report generation workflow (fetch everything from GitHub):

## Phase 1: Context Gathering & User Identification

1. **Read previous standup reports for context:**
   - Check if ./standup/ directory exists (if not, create it)
   - Scan for previous standup files matching pattern: ./standup/standup-*.{{ output_format }}
   - Read the most recent 3-5 standup files (by date) to understand:
     * What was accomplished in previous standups
     * Ongoing tasks and their progress
     * Previously mentioned blockers and their status
   - Use this context to show progress continuity in today's report

2. **Identify the authenticated GitHub user:**
   - The GitHub MCP server authenticates using OAuth
   - When you fetch PRs and issues, the API returns data for the authenticated user
   - Note: You'll need to filter results to show only items where the authenticated user is the author or assignee

## Phase 2: Fetch PRs from GitHub

{% if include_prs == "true" %}
3. **Fetch PRs from GitHub:**
   - Use GitHub extension tool `list_pull_requests` with these parameters:
     * owner: {{ github_owner }}
     * repo: {{ github_repo }}
     * state: all (to get both open and closed PRs)
     * per_page: 100 (maximum allowed)
     * page: 1
   {% if time_period == "24h" %}
   - After fetching, filter PRs updated in last 24 hours by checking the `updated_at` timestamp
   {% elif time_period == "48h" %}
   - After fetching, filter PRs updated in last 48 hours by checking the `updated_at` timestamp
   {% elif time_period == "week" %}
   - After fetching, filter PRs updated in last week by checking the `updated_at` timestamp
   {% endif %}
   - **IMPORTANT**: Filter to show only PRs where the authenticated user is the author (check PR.user field)
   - Categorize by status:
     * ✅ Merged (shows completed work - check if `merged_at` is not null)
     * ✅ Ready to merge (check review_decision field for 'APPROVED' and mergeable_state)
     * 👀 Awaiting review (no reviews yet or review count is 0)
     * 🔄 In review (has reviews, may need changes based on review state)
     * 🚧 Blocked (has conflicts or failing checks - check mergeable field)
   - For merged PRs, you can use `get_pull_request` tool to get detailed commit information if needed
{% endif %}

## Phase 3: Fetch Issues from GitHub

{% if include_issues == "true" %}
4. **Fetch issues from GitHub:**
   - Use GitHub extension tool `list_issues` with these parameters:
     * owner: {{ github_owner }}
     * repo: {{ github_repo }}
     * state: all (to get both open and closed issues)
     * per_page: 100 (maximum allowed)
     * page: 1
   - **IMPORTANT**: Filter to show only issues where the authenticated user is either:
     * The assignee (check assignees array)
     * The creator (check user field)
   - Filter by activity in {{ time_period }} by checking `updated_at` timestamp
   - Categorize:
     * ✅ Closed (state is 'closed' and closed within the time period)
     * 🔄 In progress (state is 'open' and recently updated)
     * 🆕 Created (state is 'open' and created within the time period)
{% endif %}

## Phase 4: Identify Blockers

5. **Identify blockers:**
   - For open PRs: 
     * Use `get_pull_request_status` tool to check for failing CI/CD checks
     * Check the `mergeable` field - if false, there are merge conflicts
     * Check review state - if "CHANGES_REQUESTED", it needs updates
   - For open issues:
     * Look for "blocked" label in the labels array
     * Search comments for keywords like "blocked", "waiting", "dependency"
   - Summarize each blocker with:
     * What is blocked (PR# or Issue#)
     * Why it's blocked
     * What's needed to unblock

## Phase 5: Generate Report

6. **Create the standup report:**
   
   {% if output_format == "markdown" %}
   Write a Markdown report with:
   - **Header**: Date, Repository ({{ github_owner }}/{{ github_repo }})
   - **✅ Completed**: Merged PRs and closed issues from {{ time_period }}
   {% if include_prs == "true" %}
   - **🔄 Open PRs**: Current status of open PRs
   {% endif %}
   {% if include_issues == "true" %}
   - **📋 Active Issues**: Issues you're working on
   {% endif %}
   - **🎯 Next Steps**: Based on open PRs and issues
   - **🚧 Blockers**: List or "None"
   {% elif output_format == "slack" %}
   Write Slack format with Completed, Today, Blockers sections
   {% elif output_format == "json" %}
   Write JSON with: date, repo, merged_prs[], closed_issues[], open_prs[], open_issues[], blockers[]
   {% else %}
   Write plain text with clear sections
   {% endif %}

## Phase 6: Save Report

6. **Save the file:**
    - Ensure the ./standup/ directory exists (create if needed)
    - **MUST DO**: Use the developer extension's file writing capability to create the file `./standup/standup-{date}.{{ output_format }}`
    - The file must contain the complete standup report generated above
    - Do NOT store summaries in memory - the file system is the source of truth
    - Display confirmation message: "✅ Report saved: ./standup/standup-{date}.{{ output_format }}"
    - Include file location in the confirmation



## Parameters

- **github_owner** (string, required): GitHub repository owner/organization (e.g., 'ARYPROGRAMMER', 'block')
- **github_repo** (string, required): GitHub repository name (e.g., 'goose')
- **time_period** (string): Time period to analyze: '24h' (last 24 hours), '48h', 'week'
- **include_prs** (string): Include PR status in the report (true/false)
- **include_issues** (string): Include issue progress in the report (true/false)
- **output_format** (string): Report format: 'markdown', 'slack', 'text', 'json'
- **team_channel** (string): Team channel name to mention in the report (e.g., '#engineering')


## Example Usage

```
/daily-standup-report-generator `github_owner=value`, `github_repo=value`, `time_period=24h`, `include_prs=true`, `include_issues=true`, `output_format=markdown`, `team_channel=value`
```


## Required Extensions

- [object Object]
- [object Object]


