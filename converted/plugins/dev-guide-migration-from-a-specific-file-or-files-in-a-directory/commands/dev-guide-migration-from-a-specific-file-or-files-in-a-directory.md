---
name: dev-guide-migration-from-a-specific-file-or-files-in-a-directory
description: dev guide migration from a specific file or files in a directory
parameters:
  - name: source_file
    type: file
    required: true
  - name: target_folder
    type: file
    required: true
  - name: example_file
    type: file
    required: true
  - name: sidebar_file
    type: file
    required: true
---

# dev guide migration from a specific file or files in a directory

dev guide migration from a specific file or files in a directory

## Description

Follow the prompts to migrate the doc page from source file(s) to target folder.


## Task

Migrate the doc page from source file(s) at {{source_file}} to {{target_folder}}.  Please follow the instructions below:  
1. Create the parent directory if the parent directory of the target file does not exist
2. use {{example_file}} as a reference for the doc format
3. retain all the information of the source file(s) in the target file 
4. If the page is not in the sidebar, add it in {{sidebar_file}}
5. Ensure the target files 
      - has preserved the original content
      - has correct formatting
      - has clear and well-organized file structure



## Parameters

- **source_file** (file, required): the source file(s) or the folder to migrate
- **target_folder** (file, required): the target folder to migrate
- **example_file** (file, required): the example file to follow the doc format
- **sidebar_file** (file, required): the sidebar file to add the new doc page


## Example Usage

```
/dev-guide-migration-from-a-specific-file-or-files-in-a-directory `source_file=value`, `target_folder=value`, `example_file=value`, `sidebar_file=value`
```


## Required Extensions

- [object Object]


