# Recipe Generator Creator

## Description
Creates Goose Shared Recipes and Subrecipes from user specifications. Generates complete recipe files with YAML manifests, parameters, retry configurations, and multi-step workflows.

## Instructions

### Overview
This skill enables you to create Goose Shared Recipes with:
- Recipe YAML manifests
- Configurable parameters
- Subrecipes for multi-step workflows
- Retry configurations
- MCP server integrations
- Extension support

### How to Use

1. **Provide Recipe Details:**
   - Name: The recipe name
   - Description: What the recipe does
   - Instructions: Step-by-step execution instructions
   - Prompt: Task prompt for execution (optional)
   - Parameters: Input parameters with types
   - Extensions: Required Goose extensions
   - MCP Servers: Associated MCP servers
   - Retry Config: Error handling configuration
   - Subrecipes: Multi-step workflow components

2. **Recipe Structure Generated:**
   ```
   recipes/{recipe-name}/
   ├── recipe.yaml             # Recipe manifest
   ├── README.md              # Documentation
   └── subrecipes/            # (if applicable)
       ├── INDEX.md           # Overview
       ├── 1-step-one.yaml
       ├── 2-step-two.yaml
       └── 3-step-three.yaml
   ```

3. **Manifest Format:**
   ```yaml
   version: "1.0.0"
   title: "{recipe-name}"
   description: "{description}"
   instructions: |
     {step-by-step instructions}
   prompt: "{optional task prompt}"

   parameters:
     - name: param1
       type: string
       required: true
       description: "Parameter description"
       default: "value"

   extensions:
     - extension-name

   mcp_servers:
     - name: server-name
       config:
         key: value

   subrecipes:
     - recipe: step-one
       wait_for_completion: true
     - recipe: step-two
       wait_for_completion: true

   retry_config:
     max_attempts: 3
     delay_seconds: 5
     backoff_multiplier: 1.5
   ```

### Best Practices

1. **Clear Instructions**: Provide detailed, step-by-step instructions
2. **Typed Parameters**: Use proper parameter types (string, number, boolean, array)
3. **Subrecipes**: Break complex workflows into logical steps
4. **Retry Logic**: Add retry configs for unreliable operations
5. **Extensions**: Document all required Goose extensions
6. **MCP Servers**: Configure MCP server dependencies

### Example

**Create a Data Pipeline Recipe:**
- Name: Data Processing Pipeline
- Description: Extract, transform, and load data
- Parameters:
  - source_path (string, required)
  - output_format (string, optional, default: "json")
- Subrecipes:
  1. data-extraction
  2. data-validation
  3. data-transformation
  4. data-loading
- Retry Config: 3 attempts, 2s delay, 1.5x backoff

### Integration

This recipe can be:
- Converted to Claude Code Plugins using Porter
- Executed by Goose AI assistants
- Shared in Goose Cookbook
- Versioned and updated independently

### Output

The created recipe is ready to:
- Be executed by Goose
- Be converted to Claude Code plugins
- Be shared with the community
- Be integrated into larger workflows

## Parameters

### Required
- **recipe_name**: The name of the recipe to create
- **description**: What the recipe accomplishes
- **instructions**: Detailed execution instructions

### Optional
- **prompt**: Task prompt for execution
- **parameters**: Input parameters array
- **extensions**: Required Goose extensions
- **mcp_servers**: MCP server configurations
- **subrecipes**: Multi-step workflow components
- **retry_config**: Error handling configuration

## Examples

### Example 1: Simple Recipe
```
Recipe Name: Code Formatter
Description: Format code according to style guide
Instructions:
- Read source files
- Apply formatting rules
- Save formatted output
Parameters:
- file_path (string, required)
- style_guide (string, optional, default: "standard")
```

### Example 2: Multi-Step Recipe with Subrecipes
```
Recipe Name: CI/CD Pipeline
Description: Complete continuous integration workflow
Subrecipes:
1. code-checkout (wait: true)
2. dependency-installation (wait: true)
3. test-execution (wait: true)
4. build-creation (wait: true)
5. deployment (wait: true)
Retry Config:
- Max Attempts: 3
- Delay: 5 seconds
- Backoff: 1.5x
```

### Example 3: Recipe with MCP Servers
```
Recipe Name: Database Operations
Description: Query and update database records
Instructions:
- Connect to database
- Execute operations
- Return results
MCP Servers:
- name: postgres-server
  config:
    host: localhost
    port: 5432
Environment Variables:
- DB_PASSWORD (required)
- DB_USER (required)
```

### Example 4: Data Processing Recipe
```
Recipe Name: Image Processing
Description: Batch process images with filters
Parameters:
- input_dir (string, required)
- output_dir (string, required)
- filter_type (string, optional, default: "grayscale")
- quality (number, optional, default: 90)
Extensions:
- image-processing
Retry Config:
- Max Attempts: 5
- Delay: 2 seconds
```

## Advanced Usage

### Programmatic Creation
```typescript
import { RecipeGenerator } from './src/skill-generator';

const input = {
  name: "Data Pipeline",
  description: "ETL workflow",
  instructions: "Extract, transform, load data",
  parameters: [
    { name: "source", type: "string", required: true },
    { name: "format", type: "string", default: "json" }
  ],
  retry_config: {
    max_attempts: 3,
    delay_seconds: 2,
    backoff_multiplier: 1.5
  }
};

RecipeGenerator.createRecipeDirectory(input, "./recipes");
```

### CLI Generation
```bash
bun run create-recipe "Data Pipeline" ./recipes
bun run generate-recipe "Report Generator"
```

### Interactive Mode
```bash
bun run interactive
# Select "Goose Recipe" and follow prompts
```

### Subrecipes Creation
```bash
bun run interactive
# Select "Goose Subrecipes" and follow prompts
```

```typescript
import { SubrecipeGenerator } from './src/skill-generator';

const subrecipes = [
  { recipe: "data-fetch", description: "Fetch data", wait_for_completion: true },
  { recipe: "data-process", description: "Process data", wait_for_completion: true }
];

SubrecipeGenerator.createSubrecipeCollection(
  "Data Pipeline",
  subrecipes,
  "./recipes"
);
```

## Related Skills

- `skill-generator-creator` - Create Claude Code skills
- Porter CLI - Convert recipes to plugins

## Conversion to Plugins

Once created, recipes can be converted to Claude Code Plugins:

```bash
bun src/porter.ts recipe-to-plugin ./recipes/my-recipe.yaml ./plugins
```

This creates:
- `.claude-plugin/plugin.json` - Plugin manifest
- `commands/{recipe-name}.md` - Slash command
- `agents/` - Subagents (if subrecipes exist)
- `README.md` - Documentation

## Notes

- Recipes use YAML format for human readability
- Parameters are strongly typed
- Subrecipes enable complex workflows
- Retry configs handle transient failures
- Extensions provide additional capabilities
- MCP servers enable external integrations
- All generated files follow Goose standards

## Support

For issues or questions:
1. Check generated README.md files
2. Review examples in `.claude/skills/`
3. Consult Goose Shared Recipes documentation
4. Check Claude Code documentation
5. Use Porter to convert between formats
