---
name: chart-generator
description: Creates professional, publication-ready visualizations and interactive charts from data analysis results
parameters:
  - name: data_file
    type: string
    required: true
  - name: chart_style
    type: string
    required: false
  - name: color_scheme
    type: string
    required: false
  - name: output_format
    type: string
    required: false
  - name: interactive
    type: string
    required: false
---

# Chart Generator

Creates professional, publication-ready visualizations and interactive charts from data analysis results

## Description

You are a data visualization expert. Create clear, informative, and aesthetically pleasing 
visualizations that effectively communicate data insights.

Use best practices in data visualization and choose appropriate chart types for different data patterns.



## Task

Create simple, clear visualizations for {{ data_file }}.
Style: {{ chart_style }}, Colors: {{ color_scheme }}

Important: Handle file paths correctly for all operating systems.
Use os.path.join() or pathlib for directory creation.
Detect OS for proper path separators.

Quick viz workflow:
1. Load data with pandas
2. Create visualizations directory if not exists
3. Create 2-3 essential charts:
   - Histogram for numerical columns
   - Bar chart for categorical columns
   - Correlation heatmap if multiple numeric columns
4. Save as PNG to ./visualizations/ with OS-compatible paths

Error handling:
- Create output directory if missing
- Handle matplotlib backend issues
- Skip charts if data insufficient
- Report any visualization errors

Use matplotlib or seaborn. Keep it simple and fast.

3. Visualization Standards
   Apply these best practices:
   - Clear, descriptive titles
   - Labeled axes with units
   - Legends when multiple series
   - Grid lines for readability (subtle)
   - Appropriate aspect ratios
   - Consistent color usage
   - Annotations for key insights

4. Style Application
   {% if chart_style == "modern" %}
   - Clean, minimalist design
   - Sans-serif fonts
   - Subtle grid lines
   - High contrast colors
   - White/light backgrounds
   {% elif chart_style == "classic" %}
   - Traditional academic style
   - Serif fonts
   - Visible grid lines
   - Conservative colors
   - Formal layout
   {% elif chart_style == "minimal" %}
   - Absolute minimum decoration
   - No grid lines
   - Simple colors
   - Maximum data-ink ratio
   {% elif chart_style == "publication" %}
   - Journal-ready formatting
   - High DPI
   - Grayscale-safe colors
   - Clear for print
   {% endif %}

5. Interactive Features (if enabled)
   {% if interactive == "true" %}
   Create interactive HTML visualizations with:
   - Hover tooltips showing exact values
   - Zoom and pan capabilities
   - Toggle legend items
   - Download buttons
   - Responsive layout
   Use Plotly or Bokeh for interactivity.
   {% endif %}

6. Chart Gallery Generation
   Create the following visualization set:
   
   A. Distribution Analysis (for each numerical column)
      - Histogram with KDE overlay
      - Box plot
      - Q-Q plot for normality
   
   B. Relationship Analysis
      - Correlation heatmap (if multiple numerical columns)
      - Scatter plots for top correlated pairs
      - Pair plot matrix
   
   C. Category Analysis (if categorical data exists)
      - Bar charts for categorical frequencies
      - Grouped bar charts for relationships
      - Proportional visualizations
   
   D. Time Series (if temporal data exists)
      - Line plots with trend lines
      - Seasonal decomposition
      - Moving averages
   
   E. Overview Dashboard
      - Combined multi-panel figure
      - Key metrics summary
      - Highlight important patterns

7. Save Visualizations
   - Save each chart with descriptive filename
   - Use {{ output_format }} format
   - Organize in subdirectories by type
   - Create index.html gallery if interactive
   - Generate thumbnail versions

8. Visualization Report
   Create a summary document with:
   - List of all generated visualizations
   - Description of each chart
   - Key insights visible in each viz
   - Recommendations for interpretation
   - Technical notes (libraries, settings used)

Focus on clarity and insight communication over decorative elements.
Ensure all visualizations are self-explanatory and publication-ready.



## Parameters

- **data_file** (string, required): Path to the data file to visualize
- **chart_style** (string): Visual style - options are 'modern', 'classic', 'minimal', 'publication'
- **color_scheme** (string): Color palette - options are 'viridis', 'plasma', 'blues', 'greens', 'categorical'
- **output_format** (string): Image format - options are 'png', 'svg', 'pdf', 'html'
- **interactive** (string): Generate interactive visualizations using Plotly (true/false)


## Example Usage

```
/chart-generator `data_file=value`, `chart_style=modern`, `color_scheme=viridis`, `output_format=png`, `interactive=false`
```


## Required Extensions

- [object Object]


