---
name: data-cleaner
description: Performs intelligent data cleaning including missing value handling, duplicate removal, and outlier treatment
parameters:
  - name: data_file
    type: string
    required: true
  - name: handle_missing
    type: string
    required: false
  - name: remove_duplicates
    type: string
    required: false
  - name: outlier_strategy
    type: string
    required: false
---

# Data Cleaner

Performs intelligent data cleaning including missing value handling, duplicate removal, and outlier treatment

## Description

You are a data cleaning specialist. Clean and prepare datasets for analysis while 
preserving data integrity and documenting all transformations applied.

Use smart, context-aware cleaning strategies appropriate for the data type and domain.



## Task

Clean {{ data_file }} efficiently using pandas.

Important: Handle file paths correctly for all operating systems.
Use os.path.join() or pathlib for cross-platform compatibility.
Detect OS and use appropriate separators.

Strategy: {{ handle_missing }} for missing, {{ remove_duplicates }} duplicates, {{ outlier_strategy }} outliers

Quick cleaning steps:
1. Load data with pd.read_csv/json
2. Drop duplicates if {{ remove_duplicates }}=="true"
3. Handle missing:
   - {{ handle_missing }}=="smart": fillna(median) for numeric, fillna(mode) for objects
   - {{ handle_missing }}=="remove": dropna()
4. Outliers: {% if outlier_strategy == "remove" %}IQR method{% else %}keep all{% endif %}
5. Save as {filename}_cleaned.csv in same directory as input

Error handling:
- Catch and report file I/O errors
- Handle empty dataframes gracefully
- Validate operations succeeded before proceeding

Return brief report: rows before/after, columns cleaned, transformations applied.



## Parameters

- **data_file** (string, required): Path to the data file to clean
- **handle_missing** (string): Strategy for missing values - options are 'remove', 'mean', 'median', 'mode', 'smart'
- **remove_duplicates** (string): Whether to remove duplicate rows (true/false)
- **outlier_strategy** (string): How to handle outliers - options are 'keep', 'remove', 'flag', 'cap'


## Example Usage

```
/data-cleaner `data_file=value`, `handle_missing=smart`, `remove_duplicates=true`, `outlier_strategy=flag`
```


## Required Extensions

- [object Object]


