# Claude Code Configuration for Goose ↔ Claude Code Porter

This project includes custom skills for generating Claude Code Skills and Goose Shared Recipes.

## Available Skills

### skill-generator-creator
Creates Claude Code Skills from specifications. Use this skill when you need to:
- Generate new skill files with complete structure
- Create skill manifests with capabilities
- Document skills with examples and instructions
- Export skills for sharing

**Usage:**
```
Apply the skill-generator-creator skill to create a new Claude Code Skill
```

### recipe-creator
Creates Goose Shared Recipes with optional multi-step subrecipes. Use this skill when you need to:
- Generate simple single-step recipes
- Create multi-step recipes with organized subrecipes
- Configure parameters, extensions, MCP servers
- Set up retry logic and error handling
- Add subrecipes to existing recipes
- Choose between simple or complex workflows

**Usage:**
```
Apply the recipe-creator skill to create a new Goose Recipe (with or without subrecipes)
```

**Options:**
- Create simple recipe (no subrecipes)
- Create recipe with subrecipes (multi-step workflow)
- Add subrecipes to existing recipe

## Integration

These skills work with the Porter tool in this repository:

```bash
# Create a skill or recipe
Apply skill-generator-creator or recipe-generator-creator

# Convert recipe to plugin
bun src/porter.ts recipe-to-plugin ./recipes/my-recipe.yaml ./plugins

# Convert plugin to recipe
bun src/porter.ts plugin-to-recipe ./plugins/my-plugin ./recipes
```

## Examples

### Create a PDF Processing Skill
```
Use skill-generator-creator to create:
- Name: PDF Processing
- Description: Advanced PDF manipulation
- Category: document
- Capabilities: pdf-extraction, conversion, page-manipulation
```

### Create a Data Pipeline Recipe
```
Use recipe-generator-creator to create:
- Name: Data Processing Pipeline
- Description: ETL workflow
- Subrecipes: data-fetch, data-validate, data-transform, data-load
- Retry Config: 3 attempts, 2s delay
```

## Project Commands

```bash
# Interactive generation
bun run interactive

# CLI generation
bun run create-skill "Skill Name" ./output
bun run create-recipe "Recipe Name" ./output

# Testing
bun test

# Conversion
bun src/porter.ts recipe-to-plugin <input> <output>
bun src/porter.ts plugin-to-recipe <input> <output>
```

## Notes

- Skills are located in `.claude/skills/`
- All generated files follow official standards
- Skills can be referenced in slash commands
- Recipes can be converted to plugins via Porter
