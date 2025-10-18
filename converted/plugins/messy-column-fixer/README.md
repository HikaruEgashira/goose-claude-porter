# Messy Column Fixer

Fixes messy columns: normalizes and cleans CSV data.

## Installation

```bash
/plugin install messy-column-fixer
```

## Usage

### Command

```bash
/messy-column-fixer
```

## Details

### Instructions

1. Provide the path to your CSV file.
2. The recipe will scan all columns for type mismatches and missing values.
3. It will suggest fixes (or automatically apply them, depending on your choice).
4. Review the output and save your cleaned file.



### Task

You are a CSV cleaning assistant.
1.  First, validate that the file at {{ file_path }} exists and is a readable CSV. If not, inform the user and stop.
2.  Scan the file to identify columns with mixed data types, missing values, or formatting issues.
3.  Based on the {{ auto_fix_decision }} parameter, either suggest or apply fixes for the detected issues.
4.  For each fix, briefly explain the reasoning (e.g., "Converted 'Age' column to Integer because many values are numeric.").
5.  Provide a comprehensive summary of the changes and output the cleaned dataset.



### Parameters

- **file_path** (string, required)
  Path to the CSV file you want to clean.

- **auto_fix_decision** (string)
  Describe how fixes should be applied (e.g., 'apply automatically', 'suggest only').


### Extensions

[object Object]





## Version

1.0.0
