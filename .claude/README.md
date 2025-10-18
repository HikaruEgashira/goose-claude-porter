# Claude Code Skills for Goose ↔ Claude Code Porter

This directory contains Claude Code Skills that enhance the Porter project with skill and recipe generation capabilities.

## Directory Structure

```
.claude/
├── CLAUDE.md                          # Claude Code configuration
├── README.md                          # This file
└── skills/
    ├── skill-generator-creator.md     # Skill creation skill
    ├── recipe-generator-creator.md    # Recipe creation skill
    └── subrecipe-generator-creator.md # Subrecipe creation skill
```

## Skills

### 1. skill-generator-creator

**Purpose**: Create Claude Code Skills from specifications

**Use When**:
- You need to generate a new Claude Code Skill
- You want to create skill manifests with metadata
- You need to document skills with examples and capabilities
- You want to export skills for sharing

**Generated Files**:
- `skill.json` - Skill manifest with metadata
- `instructions.md` - Detailed usage instructions
- `examples.md` - Practical usage examples
- `README.md` - Complete documentation

**Capabilities**:
- Multiple skill categories (document, automation, analysis, integration, custom)
- Environment variable configuration
- MCP server integration
- Capability mapping
- Metadata preservation

### 2. recipe-creator

**Purpose**: Create Goose Shared Recipes with flexible options for subrecipes

**Use When**:
- You need to create a simple single-step recipe
- You want to create a multi-step recipe with organized subrecipes
- You need to add subrecipes to an existing recipe
- You want to configure parameters, extensions, and error handling
- You need to define retry logic and MCP server integrations

**Generated Files** (depending on option):
- Simple recipe: `recipe.yaml` + `README.md`
- With subrecipes: `recipe.yaml` + `README.md` + `subrecipes/` (INDEX.md + N-step-name.yaml files)

**Capabilities**:
- Single-step recipe creation
- Multi-step workflow creation
- Strongly-typed parameters
- Retry configuration with backoff
- Goose extension support
- MCP server configuration
- Optional prompts and instructions
- Sequential and parallel execution patterns
- Automatic subrecipe numbering (1-, 2-, 3-...)
- Comprehensive documentation generation

## Usage

### In Claude Code (Recommended)

Reference these skills directly:

**Create a Skill:**
```
Use the skill-generator-creator skill to create a new PDF Processing skill with:
- Description: Advanced PDF manipulation
- Category: document
- Capabilities: extraction, conversion, merging
```

**Create a Simple Recipe:**
```
Use the recipe-creator skill to create a Code Formatter recipe with:
- Description: Format code according to style guide
- Parameters: file_path, style_guide (optional)
- No subrecipes
```

**Create a Recipe with Subrecipes:**
```
Use the recipe-creator skill to create a Data Pipeline recipe with:
- Description: ETL workflow
- Parameters: source_path, output_format
- Subrecipes:
  1. data-extract
  2. data-transform
  3. data-load
- Retry config: 3 attempts, 2s delay
```

**Add Subrecipes to Existing Recipe:**
```
Use the recipe-creator skill to add subrecipes to ./recipes/my-recipe/recipe.yaml:
- Add subrecipes: prepare, execute, cleanup
```

## Integration with Porter

Once you've created recipes using these skills, you can convert them to Claude Code Plugins:

```bash
# Convert recipe to plugin
bun src/porter.ts recipe-to-plugin \
  ./recipes/data-pipeline/recipe.yaml \
  ./plugins

# Result includes:
# - .claude-plugin/plugin.json (plugin manifest)
# - commands/ (slash commands from recipe)
# - agents/ (subagents from subrecipes, if applicable)
# - README.md (auto-generated documentation)
```

## Output Examples

### Generated Skill Structure
```
skills/pdf-processing/
├── skill.json
│   {
│     "version": "1.0.0",
│     "id": "pdf-processing",
│     "name": "PDF Processing",
│     "description": "Advanced PDF manipulation",
│     "category": "document",
│     "capabilities": ["extraction", "conversion", "merging"],
│     "environment_variables": [...]
│   }
├── instructions.md
│   # PDF Processing
│   ## Description
│   ## Instructions
│   ## Capabilities
│   ## Examples
│   ## Environment Variables
│   ## MCP Servers
├── examples.md
└── README.md
```

### Generated Recipe Structure
```
recipes/data-pipeline/
├── recipe.yaml
│   version: "1.0.0"
│   title: "Data Pipeline"
│   description: "ETL workflow"
│   instructions: |
│     - Extract data
│     - Transform data
│     - Load data
│   parameters:
│     - name: source_path
│       type: string
│       required: true
│   subrecipes:
│     - recipe: data-extract
│       wait_for_completion: true
│     - recipe: data-transform
│       wait_for_completion: true
│     - recipe: data-load
│       wait_for_completion: true
│   retry_config:
│     max_attempts: 3
│     delay_seconds: 2
└── README.md
```

### Generated Subrecipe Collection
```
recipes/data-pipeline/subrecipes/
├── INDEX.md
│   # Subrecipes for Data Pipeline
│   ## Subrecipes
│   ### 1. data-extract
│   Description: Extract raw data from source
│   ...
│   ### 2. data-transform
│   ### 3. data-load
├── 1-data-extract.yaml
│   recipe: "data-extract"
│   description: "Extract raw data from source"
│   parameters:
│     - name: source_path
│       type: string
│   wait_for_completion: true
├── 2-data-transform.yaml
└── 3-data-load.yaml
```

## Features

### skill-generator-creator
- ✅ Multiple skill categories
- ✅ Full manifest generation
- ✅ Environment variable support
- ✅ MCP server integration
- ✅ Capability mapping
- ✅ Auto-generated documentation

### recipe-generator-creator
- ✅ Strongly-typed parameters
- ✅ Retry configuration
- ✅ Goose extensions support
- ✅ MCP server configuration
- ✅ Optional prompts
- ✅ Multi-step recipe support

### subrecipe-generator-creator
- ✅ Organized file structure
- ✅ Automatic numbering
- ✅ Execution order definition
- ✅ Step-specific parameters
- ✅ Comprehensive indexing
- ✅ Sequential/parallel patterns

## Best Practices

1. **Skill Creation**
   - Use descriptive names (lowercase with hyphens)
   - Provide clear, concise descriptions
   - Document all capabilities
   - List required environment variables
   - Include practical examples

2. **Recipe Creation**
   - Break down complex workflows into steps
   - Use strongly-typed parameters
   - Configure retry logic for resilience
   - Document all extensions and dependencies
   - Create subrecipes for multi-step processes

3. **Subrecipe Creation**
   - Order subrecipes logically (1-, 2-, 3-...)
   - Clearly describe each step's purpose
   - Define inter-step parameters
   - Specify wait behavior appropriately
   - Document dependencies between steps

## Workflow

### Complete Workflow Example

```bash
# Step 1: Create a new skill
bun run interactive
# → Select "Claude Code Skill"
# → Follow prompts

# Step 2: Create a new recipe
bun run interactive
# → Select "Goose Recipe"
# → Follow prompts

# Step 3: Add subrecipes to the recipe (optional)
bun run interactive
# → Select "Goose Subrecipes"
# → Follow prompts

# Step 4: Convert recipe to plugin
bun src/porter.ts recipe-to-plugin \
  ./recipes/my-recipe/recipe.yaml \
  ./plugins

# Step 5: Validate the generated plugin
bun src/porter.ts validate-plugin ./plugins/my-recipe
```

## Troubleshooting

**Q: Can I modify generated files?**
A: Yes! All generated files are fully editable. You can customize:
- Manifest metadata
- Instructions and examples
- Parameters and configurations
- Documentation

**Q: How do I add more capabilities to a skill?**
A: Edit `skill.json` and add to the `capabilities` array.

**Q: Can I create recipes without subrecipes?**
A: Yes! Subrecipes are optional. Simple recipes work without them.

**Q: How do I convert generated recipes to plugins?**
A: Use the Porter CLI:
```bash
bun src/porter.ts recipe-to-plugin <recipe.yaml> <output-dir>
```

## Related Documentation

- [Porter README](../README.md) - Main project documentation
- [CLAUDE.md](./CLAUDE.md) - Claude Code configuration
- [Goose Shared Recipes](https://block.github.io/goose/docs/guides/recipes/)
- [Claude Code Plugins](https://docs.claude.com/en/docs/claude-code/plugins)

## Support

For help:
1. Review the skill descriptions in this directory
2. Check generated README.md files
3. Consult the main Porter documentation
4. Review examples in the repository
