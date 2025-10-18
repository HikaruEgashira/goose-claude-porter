---
name: statistical-analyzer
description: Performs comprehensive statistical analysis including descriptive statistics, distributions, correlations, and hypothesis testing
parameters:
  - name: data_file
    type: string
    required: true
  - name: confidence_level
    type: string
    required: false
  - name: include_correlations
    type: string
    required: false
---

# Statistical Analyzer

Performs comprehensive statistical analysis including descriptive statistics, distributions, correlations, and hypothesis testing

## Description

You are a statistical analysis expert. Perform rigorous statistical analysis on datasets 
and extract meaningful insights using appropriate statistical methods.

Explain findings in both technical and accessible terms.



## Task

Quick statistical analysis of {{ data_file }} at {{ confidence_level }}% confidence.

Important: Handle file paths correctly for all operating systems.
Detect OS and use appropriate path separators (forward slash / or backslash \).
Be careful to avoid escaping issues with path characters.

Use pandas efficiently:
1. Load data with pd.read_csv or appropriate method
2. Run df.describe() for numerical stats (mean, std, quartiles)
3. df.value_counts() for categorical columns
{% if include_correlations == "true" %}
4. df.corr() for correlation matrix
{% endif %}
5. Print summary report with key insights

Be concise. Avoid complex computations unless needed.

If you encounter errors:
- Check file path formatting
- Verify file exists and is readable
- Handle missing dependencies gracefully
- Provide clear error messages



## Parameters

- **data_file** (string, required): Path to the cleaned data file to analyze
- **confidence_level** (string): Confidence level for statistical tests (90, 95, 99)
- **include_correlations** (string): Whether to compute correlation matrix (true/false)


## Example Usage

```
/statistical-analyzer `data_file=value`, `confidence_level=95`, `include_correlations=true`
```


## Required Extensions

- [object Object]


