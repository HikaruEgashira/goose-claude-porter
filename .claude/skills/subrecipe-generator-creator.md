# Subrecipe Generator Creator

## Description
Creates Goose Shared Recipe Subrecipes for multi-step workflows. Generates organized subrecipe collections with individual YAML files and comprehensive indexing.

## Instructions

### Overview
This skill enables you to create organized collections of Goose Subrecipes:
- Individual subrecipe YAML files
- Subrecipe index documentation
- Execution order and dependencies
- Wait-for-completion configurations
- Parameter definitions for each subrecipe

### How to Use

1. **Provide Subrecipe Collection Details:**
   - Parent Recipe Name: The main recipe that owns these subrecipes
   - Number of Subrecipes: How many steps in the workflow
   - For Each Subrecipe:
     - Name: Subrecipe identifier
     - Description: What this step does
     - Parameters: Input parameters (optional)
     - Wait for Completion: Should main process wait

2. **Subrecipe Collection Structure Generated:**
   ```
   recipes/{parent-recipe-name}/subrecipes/
   ├── INDEX.md                # Overview and mapping
   ├── 1-step-one.yaml         # First subrecipe
   ├── 2-step-two.yaml         # Second subrecipe
   ├── 3-step-three.yaml       # Third subrecipe
   └── ...
   ```

3. **Individual Subrecipe Format:**
   ```yaml
   recipe: "step-name"
   description: "What this step does"
   parameters:
     - name: param_name
       type: string
       description: "Parameter description"
   wait_for_completion: true
   ```

4. **INDEX.md Structure:**
   - Lists all subrecipes
   - Shows execution order
   - Documents parameters
   - Specifies wait behavior

### Best Practices

1. **Logical Ordering**: Arrange subrecipes in execution order
2. **Clear Names**: Use descriptive names for each step
3. **Dependencies**: Document parameter flow between steps
4. **Completion Waiting**: Specify which steps must complete before next
5. **Naming Convention**: Prefix with number (1-, 2-, 3-) for ordering
6. **Documentation**: Add descriptions for each step

### Example

**Create a Data Processing Pipeline:**
```
Parent Recipe: Data Processing Pipeline
Subrecipes:
1. data-extraction
   - Description: Extract raw data from source
   - Parameters: source_path, format
   - Wait: true

2. data-validation
   - Description: Validate extracted data
   - Parameters: data, validation_rules
   - Wait: true

3. data-transformation
   - Description: Transform and standardize data
   - Parameters: data, schema
   - Wait: true

4. data-loading
   - Description: Load processed data to destination
   - Parameters: data, destination
   - Wait: true
```

### Integration

Subrecipes are:
- Part of parent Goose recipes
- Converted to subagents in Claude Code plugins
- Executed in defined order
- Can wait for completion or run async

### Output Structure

```
recipes/data-pipeline/
├── recipe.yaml                    # Parent recipe
├── subrecipes/
│   ├── INDEX.md
│   ├── 1-data-extraction.yaml
│   ├── 2-data-validation.yaml
│   ├── 3-data-transformation.yaml
│   └── 4-data-loading.yaml
└── README.md
```

## Parameters

### Required
- **parent_recipe_name**: Name of the parent recipe
- **subrecipe_count**: Number of subrecipes (1-20)

### For Each Subrecipe
- **recipe_name**: The subrecipe identifier
- **description**: What this subrecipe does
- **wait_for_completion**: Should main process wait? (default: true)

### Optional
- **parameters**: Input parameters for this subrecipe

## Examples

### Example 1: Simple 3-Step Workflow
```
Parent: Report Generation
Subrecipes:
1. data-collection - Gather required data
2. analysis - Analyze data
3. report-generation - Generate report
```

### Example 2: Data Processing Pipeline (4 steps)
```
Parent: ETL Pipeline
Subrecipes:
1. extract - Read from source
2. transform - Process data
3. validate - Check quality
4. load - Write to destination
```

### Example 3: CI/CD Pipeline (5 steps)
```
Parent: CI/CD Workflow
Subrecipes:
1. checkout - Clone repository
2. install-dependencies - Install packages
3. run-tests - Execute test suite
4. build - Build application
5. deploy - Deploy to production
```

### Example 4: Complex Workflow with Parameters
```
Parent: Image Processing Pipeline
Subrecipes:
1. image-upload
   Parameters: file_path, format

2. image-processing
   Parameters: image, filters, quality

3. image-optimization
   Parameters: image, size, compression

4. image-storage
   Parameters: image, storage_path
```

### Example 5: Parallel Processing Workflow
```
Parent: Batch Processing
Subrecipes (non-blocking):
1. task-a - wait: false
2. task-b - wait: false
3. task-c - wait: false
4. results-aggregation - wait: true
```

## Advanced Usage

### Programmatic Creation
```typescript
import { SubrecipeGenerator } from './src/skill-generator';

const subrecipes = [
  {
    recipe: "data-fetch",
    description: "Fetch data from source",
    parameters: [
      { name: "source", type: "string", description: "Data source" }
    ],
    wait_for_completion: true
  },
  {
    recipe: "data-process",
    description: "Process fetched data",
    parameters: [
      { name: "data", type: "array", description: "Input data" }
    ],
    wait_for_completion: true
  }
];

SubrecipeGenerator.createSubrecipeCollection(
  "Data Pipeline",
  subrecipes,
  "./recipes"
);
```

### CLI Generation
```bash
bun run interactive
# Select "Goose Subrecipes"
# Follow prompts for parent recipe and subrecipe details
```

### With Parent Recipe
```bash
# First create parent recipe
bun run create-recipe "Data Pipeline" ./recipes

# Then add subrecipes (automatically creates subrecipes/ directory)
bun run interactive
```

## Execution Flow

### Sequential Execution (wait_for_completion: true)
```
[Subrecipe 1] → [Subrecipe 2] → [Subrecipe 3] → [Subrecipe 4]
```

### Parallel Execution (wait_for_completion: false)
```
[Subrecipe 1]
[Subrecipe 2]  → [Aggregation]
[Subrecipe 3]
```

### Mixed Execution
```
[Fetch] → [Process 1]
         [Process 2]  → [Aggregate]
         [Process 3]
```

## Integration with Porter

When converting recipe with subrecipes to Claude Code Plugin:

```bash
bun src/porter.ts recipe-to-plugin ./recipes/data-pipeline/recipe.yaml ./plugins
```

Results in:
- `agents/` directory containing subagent files
- Each subrecipe becomes an individual agent
- `plugin.json` includes `"agents": "agents"` field

## Related Skills

- `recipe-generator-creator` - Create parent recipes
- `skill-generator-creator` - Create Claude Code skills
- Porter CLI - Convert recipes to plugins

## Notes

- Subrecipes are numbered (1-, 2-, 3-) for ordering
- Each subrecipe gets its own YAML file
- INDEX.md provides overview and documentation
- Wait configurations determine execution order
- Parameters flow between subrecipes
- Can be async or sequential
- Converted to subagents in plugins

## Support

For issues or questions:
1. Review INDEX.md in generated subrecipes/
2. Check generated YAML files
3. Consult Goose Shared Recipes documentation
4. Review Porter conversion examples
