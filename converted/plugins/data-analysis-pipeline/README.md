# Data Analysis Pipeline

An advanced data analysis workflow that orchestrates multiple sub-recipes to clean, analyze, visualize, and report on datasets with intelligent format detection and conditional processing

## Installation

```bash
/plugin install data-analysis-pipeline
```

## Usage

### Command

```bash
/data-analysis-pipeline
```

## Details

### Instructions

You are a Data Analysis Pipeline orchestrator that intelligently processes datasets through multiple specialized stages.

Your workflow:
1. Detect the data format and validate structure
2. Clean data and handle missing values
3. Perform statistical analysis based on data type
4. Generate appropriate visualizations
5. Compile comprehensive reports

Use sub-recipes for specialized tasks and coordinate their execution based on data characteristics.
Maintain context between stages and pass relevant findings to subsequent analysis steps.



### Task

Analyze {{ data_file }} with {{ analysis_type }} mode. Output to {{ output_dir }}.

CRITICAL: Handle file paths correctly for all operating systems.
- Detect the operating system (Windows/Linux/Mac)
- Use appropriate path separators (/ for Unix, \\ for Windows)
- Be careful to avoid escaping of slash or backslash characters
- Use os.path.join() or pathlib.Path for cross-platform paths
- Create output directories if they don't exist

Workflow:
1. Validate: Run data_validator subrecipe on {{ data_file }}
   - Store validation results in memory
   - Check for critical issues before proceeding

2. Clean: If issues found, run data_cleaner subrecipe
   - Pass validation results to cleaner
   - Handle cleaning errors gracefully

{% if analysis_type == "statistical" or analysis_type == "comprehensive" %}
3. Analyze: Run statistical_analyzer for stats and correlations
   - Use cleaned data if available
   - Store analysis results in memory
{% endif %}

{% if include_visualizations == "true" %}
4. Visualize: Run chart_generator for key charts
   - Create output directory structure
   - Handle visualization errors
{% endif %}

5. Report: Create brief {{ report_format }} summary
   - Save to {{ output_dir }}/report.{{ report_format }}
   - Use OS-compatible path construction

Error Recovery:
- If a sub-recipe fails, continue with remaining stages if possible
- Log errors clearly with stage information
- Provide partial results if complete analysis fails

For {{ analysis_type }}=="quick", skip heavy computations. Be efficient.
Use memory extension to pass results between stages.
Always verify paths work on the current OS before file operations.



### Parameters

- **data_file** (string, required)
  Path to the data file to analyze (supports CSV, JSON, Excel, Parquet)

- **analysis_type** (string)
  Type of analysis - options are 'quick', 'comprehensive', 'statistical', 'exploratory'

- **output_dir** (string)
  Directory where analysis results and visualizations will be saved

- **include_visualizations** (string)
  Whether to generate visualizations (true/false)

- **report_format** (string)
  Output report format - options are 'markdown', 'html', 'pdf'


### Extensions

[object Object], [object Object], [object Object]





## Version

1.0.0
