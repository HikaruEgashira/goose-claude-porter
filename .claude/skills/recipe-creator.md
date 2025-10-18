# Recipe Creator

## Description
Creates Goose Shared Recipes with optional multi-step subrecipes. Generates complete recipe structures with YAML manifests, parameters, configurations, and organized workflow components. Supports creating recipes from scratch or adding subrecipes to existing recipes.

## Instructions

### Overview
This skill enables you to create Goose Shared Recipes with flexible options:
- Single-step recipes (simple workflows)
- Multi-step recipes with subrecipes (complex workflows)
- Add subrecipes to existing recipes
- Full parameter and configuration support

### How to Use

#### Option 1: Create a Simple Recipe (No Subrecipes)
```
Apply recipe-creator skill:
1. Recipe Name: "Simple Task"
2. Description: "What this recipe does"
3. Instructions: "Step-by-step execution instructions"
4. Skip subrecipes step
→ Output: recipes/simple-task/recipe.yaml
```

#### Option 2: Create Recipe with Subrecipes (Recommended for complex workflows)
```
Apply recipe-creator skill:
1. Recipe Name: "Data Pipeline"
2. Description: "ETL workflow"
3. Instructions: "Process data through multiple steps"
4. Add Subrecipes:
   - Step 1: data-extract
   - Step 2: data-transform
   - Step 3: data-load
→ Output:
   - recipes/data-pipeline/recipe.yaml
   - recipes/data-pipeline/subrecipes/
     ├── INDEX.md
     ├── 1-data-extract.yaml
     ├── 2-data-transform.yaml
     └── 3-data-load.yaml
```

#### Option 3: Add Subrecipes to Existing Recipe
```
Apply recipe-creator skill:
1. Select: "Add subrecipes to existing recipe"
2. Path: "./recipes/my-recipe/recipe.yaml"
3. Add Subrecipes:
   - fetch
   - process
   - store
→ Output: recipes/my-recipe/subrecipes/ (created/updated)
```

---

## Recipe Structure

### Simple Recipe (Without Subrecipes)
```
recipes/simple-task/
├── recipe.yaml          # Single recipe definition
└── README.md            # Documentation
```

### Complex Recipe (With Subrecipes)
```
recipes/data-pipeline/
├── recipe.yaml              # Parent recipe with subrecipe references
├── README.md                # Documentation
└── subrecipes/              # Multi-step workflow
    ├── INDEX.md             # Overview and execution order
    ├── 1-data-extract.yaml  # First subrecipe
    ├── 2-data-transform.yaml # Second subrecipe
    └── 3-data-load.yaml     # Third subrecipe
```

---

## Parameters

### Required
- **recipe_name**: The name of the recipe to create
- **description**: What the recipe accomplishes
- **instructions**: Detailed execution instructions

### Optional
- **prompt**: Task prompt for execution
- **parameters**: Input parameters with types and defaults
- **extensions**: Required Goose extensions
- **mcp_servers**: MCP server configurations
- **retry_config**: Error handling (max_attempts, delay_seconds, backoff)
- **subrecipes**: Multi-step workflow components (optional)

### Subrecipe Fields (Optional)
- **recipe_name**: Subrecipe identifier
- **description**: What this step does
- **parameters**: Step-specific parameters
- **wait_for_completion**: Should main process wait? (default: true)

---

## Recipe YAML Format

### Simple Recipe Example
```yaml
version: "1.0.0"
title: "Code Formatter"
description: "Format code according to style guide"
instructions: |
  1. Read source files
  2. Apply formatting rules
  3. Save formatted output
parameters:
  - name: file_path
    type: string
    required: true
    description: "Path to file to format"
  - name: style_guide
    type: string
    required: false
    default: "standard"
    description: "Style guide to use"
```

### Complex Recipe with Subrecipes Example
```yaml
version: "1.0.0"
title: "Data Pipeline"
description: "ETL workflow with multiple steps"
instructions: "Process data through extract, transform, and load steps"
parameters:
  - name: source_path
    type: string
    required: true
    description: "Source data location"
  - name: output_format
    type: string
    required: false
    default: "json"
    description: "Output format"

subrecipes:
  - recipe: data-extract
    wait_for_completion: true
  - recipe: data-transform
    wait_for_completion: true
  - recipe: data-load
    wait_for_completion: true

retry_config:
  max_attempts: 3
  delay_seconds: 2
  backoff_multiplier: 1.5
```

---

## Examples

### Example 1: Simple Single-Step Recipe
```
Recipe Name: Code Formatter
Description: Format code according to style guide
Instructions:
- Read source files
- Apply formatting rules
- Save formatted output
Parameters:
- file_path (string, required)
- style_guide (string, optional, default: standard)
Result: recipes/code-formatter/recipe.yaml
```

### Example 2: Multi-Step Data Pipeline
```
Recipe Name: Data Pipeline
Description: ETL workflow
Subrecipes:
1. data-extract - Extract data from source
2. data-validate - Validate data quality
3. data-transform - Transform to target format
4. data-load - Load to destination
Retry Config: 3 attempts, 2s delay, 1.5x backoff
Result:
- recipes/data-pipeline/recipe.yaml
- recipes/data-pipeline/subrecipes/ (4 files)
```

### Example 3: CI/CD Pipeline
```
Recipe Name: CI/CD Workflow
Description: Complete continuous integration pipeline
Subrecipes:
1. code-checkout - Clone repository
2. dependency-install - Install packages
3. test-run - Execute tests
4. build-create - Build application
5. deploy - Deploy to production
Result:
- recipes/ci-cd-workflow/recipe.yaml
- recipes/ci-cd-workflow/subrecipes/ (5 files)
```

### Example 4: Image Processing with Parameters
```
Recipe Name: Image Processing
Description: Batch process images with filters
Parameters:
- input_dir (string, required)
- output_dir (string, required)
- filter_type (string, optional, default: grayscale)
- quality (number, optional, default: 90)
Subrecipes:
1. image-upload - Upload images
2. image-process - Apply filters
3. image-optimize - Optimize size
4. image-store - Store results
Result: recipes/image-processing/ + subrecipes/
```

### Example 5: Adding Subrecipes to Existing Recipe
```
Existing Recipe: ./recipes/simple-task/recipe.yaml
Action: Add subrecipes
New Subrecipes:
1. prepare - Prepare environment
2. execute - Execute task
3. cleanup - Clean up resources
Result: recipes/simple-task/subrecipes/ (created with 3 files)
```

---

## Advanced Usage

### Creating Only Recipe (No Subrecipes)
- Fast for simple, single-step workflows
- Suitable for tasks that don't need decomposition
- Can be extended with subrecipes later

### Creating Recipe + Subrecipes Together
- Best for complex, multi-step workflows
- Enables parallel execution tracking
- Clear step dependencies
- Organized execution order (1-, 2-, 3-...)

### Sequential vs Parallel Execution
**Sequential (wait_for_completion: true):**
```
[Step 1] → [Step 2] → [Step 3] → [Step 4]
```

**Parallel (mixed wait settings):**
```
[Prepare]
[Task 1]
[Task 2] → [Aggregate]
[Task 3]
```

---

## Integration with Porter

Created recipes can be converted to Claude Code Plugins:

```bash
# Convert simple recipe
bun src/porter.ts recipe-to-plugin ./recipes/code-formatter/recipe.yaml ./plugins

# Convert complex recipe with subrecipes
bun src/porter.ts recipe-to-plugin ./recipes/data-pipeline/recipe.yaml ./plugins
# Result includes:
# - .claude-plugin/plugin.json
# - commands/ (from recipe)
# - agents/ (from subrecipes, if applicable)
```

---

## Best Practices

### Recipe Design
1. **Clear Names**: Use descriptive, lowercase names with hyphens
2. **Detailed Instructions**: Provide step-by-step execution instructions
3. **Type Parameters**: Use proper parameter types (string, number, boolean, array)
4. **Defaults**: Provide sensible defaults for optional parameters

### Subrecipe Design
1. **Logical Ordering**: Arrange subrecipes in execution order (1-, 2-, 3-...)
2. **Clear Descriptions**: Describe what each step does
3. **Wait Configuration**: Specify which steps must complete before next
4. **Parameter Flow**: Document how data flows between steps

### Error Handling
1. **Retry Logic**: Add retry configs for resilience
2. **Delays**: Use appropriate delays between retries
3. **Backoff**: Implement exponential backoff for reliability

---

## Workflow Comparison

### When to Use Simple Recipe
- Single-step workflows
- No decomposition needed
- Simple task execution
- Quick prototyping

### When to Use Recipe + Subrecipes
- Multi-step workflows
- Complex processes
- Need execution order control
- Step-specific configurations
- Parallel/sequential mixing
- Better organization

---

## Related Skills

- **skill-generator-creator** - Create Claude Code Skills
- **Porter CLI** - Convert recipes to plugins
- **Batch Convert** - Convert multiple recipes at once

---

## Notes

- Recipes use YAML format for human readability
- Subrecipes are automatically numbered (1-, 2-, 3-...)
- Each subrecipe gets its own YAML file
- INDEX.md provides overview and documentation
- Parameters are strongly typed
- Retry configs handle transient failures
- All generated files follow Goose standards
- Recipes can be versioned and updated

## Support

For help:
1. Review generated README.md files
2. Check examples in `.claude/skills/`
3. Consult Goose Shared Recipes documentation
4. Review Porter conversion examples
5. Check multi-step workflow patterns
