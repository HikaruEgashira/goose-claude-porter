---
name: analyse-pr
description: Analyse a pr
parameters:
  - name: pr
    type: string
    required: true
  - name: repo
    type: string
    required: false
---

# Analyse PR

Analyse a pr

## Description

Your job is to analyse and explain a PR


## Task

Analyze the pr with the name {{ pr }}. Find out what has changed, try to figure out why these
changes were made and tell the user in detail what you found out.
{% if repo %}
We are working with the {{ repo }} repository, so make sure to add that to all commands.
{% endif %}

Steps:
1. Find the actual pull request. {{ pr }} is the name or part of it. You can just run
   `gh pr list`
   and see which prs are open. Note which one the user is talking about
2. Look at what is changed. You can run:
   `gh pr view <pr-number> --comments --commits --files`
   to get an overview.
3. Optionally: if this looks complicated you could check out the relevant commit and have
   a look at the files involved to get more context. If you do this, mark which branch you
   were on. If there are pending changes, do a git stash
4. Gather your thoughts and tell the user what changed, which changes look like they might
   be worth an extra look and give them an idea of maybe why these changes were needed
5. Clean up after yourself. If you cloned a repository or checked out a commit, make sure
   you return the state to what it was before. So if in step 3 you changed branch, change
   it back. If you had git stashed something, stash pop it again.



## Parameters

- **pr** (string, required): name of the pull request
- **repo** (string): name of the repo. uses the current one if not selected


## Example Usage

```
/analyse-pr `pr=value`, `repo=value`
```


## Required Extensions

- [object Object]
- [object Object]


