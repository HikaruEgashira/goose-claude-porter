# Goose ↔ Claude Code Porter

Seamlessly convert between **Goose Shared Recipes** and **Claude Code Plugins**. This Bun-based tool enables teams to leverage the same workflows across both AI platforms.

## 🎯 Purpose

**Porter** bridges the gap between two powerful workflow automation platforms:

- **Goose Recipes**: Reusable, shareable AI workflow configurations
- **Claude Code Plugins**: Extensible command collections for Claude Code

Convert your recipes into plugins and vice versa to maximize workflow portability and team productivity.

## ✨ Features

- **Bidirectional Conversion**: Recipe ↔ Plugin transformations
- **Format Support**: YAML and JSON for Goose recipes
- **Validation**: Built-in validation for both formats
- **Automated Structure**: Auto-generates directory layouts and manifests
- **Metadata Preservation**: Maintains all configuration details during conversion
- **CLI Interface**: Simple, intuitive command-line tools
- **TypeScript**: Full type safety with TypeScript

## 📋 Quick Start

### Installation

```bash
# Clone or download the porter
git clone <repo-url>
cd goose-claude-porter

# Install dependencies
bun install
```

### Basic Usage

```bash
# Convert Goose recipe to Claude Code plugin
bun porter.ts recipe-to-plugin ./my-recipe.yaml ./output-plugins

# Convert Claude Code plugin to Goose recipe
bun porter.ts plugin-to-recipe ./my-plugin ./output-recipes

# Validate recipe format
bun porter.ts validate-recipe ./my-recipe.yaml

# Validate plugin structure
bun porter.ts validate-plugin ./my-plugin
```

## 📚 Detailed Documentation

### Recipe to Plugin Conversion

**What happens:**
- Recipe YAML/JSON is parsed
- Plugin directory structure is created (`.claude-plugin/`, `commands/`, etc.)
- Recipe content is converted to a slash command
- `plugin.json` manifest is auto-generated
- README documentation is created

**Example:**

```bash
bun porter.ts recipe-to-plugin examples/code-review.recipe.yaml ./plugins
```

**Output Structure:**
```
plugins/code-review-assistant/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── commands/
│   └── code-review-assistant.md    # Slash command
└── README.md               # Documentation
```

### Plugin to Recipe Conversion

**What happens:**
- Plugin manifest (plugin.json) is parsed
- Commands are extracted from the `commands/` directory
- Plugin configuration is mapped to recipe format
- Recipe YAML is generated

**Example:**

```bash
bun porter.ts plugin-to-recipe ./my-plugin ./recipes
```

**Output:**
```
recipes/
└── my-plugin.yaml    # Generated recipe
```

### Validation Commands

**Validate Recipe:**
```bash
bun porter.ts validate-recipe ./my-recipe.yaml
```

Checks:
- Required fields present (version, title, description, instructions)
- Correct data types
- Field format compliance

**Validate Plugin:**
```bash
bun porter.ts validate-plugin ./my-plugin
```

Checks:
- Manifest exists and is valid JSON
- Required manifest fields present
- Plugin ID format (lowercase, hyphens only)
- Directory structure compliance

## 🏗️ Architecture

### Goose Recipe Structure

```yaml
version: "1.0.0"
title: "Recipe Name"
description: "What this recipe does"
instructions: "Detailed instructions for the AI"
prompt: "Task prompt for execution"

parameters:
  - name: param1
    type: string
    required: true
    description: "Parameter description"

extensions:
  - extension-name

mcp_servers:
  - name: server-name
    config: {...}

retry_config:
  max_attempts: 3
  delay_seconds: 5
```

### Claude Code Plugin Structure

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── command.md
├── agents/
│   └── agent.md
├── skills/
│   └── skill/SKILL.md
├── hooks/
│   └── pre-commit
└── README.md
```

### Plugin Manifest (plugin.json)

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Plugin description",
  "commands": "commands",
  "environment_variables": [
    {
      "name": "VAR_NAME",
      "required": true,
      "description": "Variable description"
    }
  ]
}
```

## 🔄 Data Mapping

### Recipe → Plugin Mapping

| Recipe Field | Plugin Mapping | Notes |
|---|---|---|
| `title` | `name` in plugin.json | Normalized to plugin ID |
| `description` | `description` in manifest | |
| `version` | `version` in manifest | Preserved as-is |
| `instructions` | Command markdown body | Main command content |
| `parameters` | `environment_variables` | Converted to uppercase |
| `mcp_servers` | `mcp_servers` in manifest | Preserved with config |
| `extensions` | Command documentation | Referenced in examples |

### Plugin → Recipe Mapping

| Plugin Element | Recipe Field | Notes |
|---|---|---|
| `plugin.json` name | `title` | |
| `plugin.json` description | `description` | |
| `plugin.json` version | `version` | |
| `commands/*.md` | `instructions` | First command used |
| `environment_variables` | `parameters` | Converted to lowercase |
| `mcp_servers` | `mcp_servers` | Preserved with config |

## 📖 Examples

### Example 1: Convert Code Review Recipe to Plugin

**Input Recipe** (`code-review.recipe.yaml`):
```yaml
version: "1.0.0"
title: "Code Review Assistant"
description: "Automated code review with best practices"
instructions: "You are a professional code reviewer..."
parameters:
  - name: file_path
    type: string
    required: true
```

**Command:**
```bash
bun porter.ts recipe-to-plugin code-review.recipe.yaml ./plugins
```

**Output:** Plugin with:
- Plugin ID: `code-review-assistant`
- Command: `/code-review-assistant`
- Manifest with environment variable `FILE_PATH`

### Example 2: Convert Test Plugin to Recipe

**Input Plugin** (`test-plugin/`):
```
test-plugin/
├── .claude-plugin/
│   └── plugin.json (id: test-automation)
└── commands/
    └── run-tests.md
```

**Command:**
```bash
bun porter.ts plugin-to-recipe test-plugin ./recipes
```

**Output:** `recipes/test-automation.yaml`
- Title from plugin name
- Parameters from environment variables
- Instructions from command documentation

## 🧪 Testing

Run the test suite:

```bash
bun test
```

Tests cover:
- Recipe parsing (YAML/JSON)
- Plugin manifest validation
- File structure validation
- Type safety checks
- Data transformation logic
- Error handling
- Integration scenarios

## 🛠️ CLI Reference

### Commands

```
porter <command> [options]

recipe-to-plugin <recipe-file> [output-dir]
  Convert Goose recipe to Claude Code plugin

  recipe-file    Path to .yaml or .json recipe
  output-dir     Output directory (default: ./generated-plugins)

plugin-to-recipe <plugin-dir> [output-dir] [recipe-name]
  Convert Claude Code plugin to Goose recipe

  plugin-dir     Path to plugin directory
  output-dir     Output directory (default: ./generated-recipes)
  recipe-name    Custom recipe name (optional)

validate-recipe <recipe-file>
  Validate Goose recipe format

validate-plugin <plugin-dir>
  Validate Claude Code plugin structure

--help, -h
  Show help message

--version, -v
  Show version information
```

### Examples

```bash
# Convert and validate in one workflow
bun porter.ts validate-recipe ./my-recipe.yaml && \
  bun porter.ts recipe-to-plugin ./my-recipe.yaml ./plugins

# Convert with custom output name
bun porter.ts plugin-to-recipe ./my-plugin ./recipes my-custom-recipe

# Batch convert multiple recipes
for recipe in recipes/*.yaml; do
  bun porter.ts recipe-to-plugin "$recipe" ./plugins
done
```

## 🔌 Integration

### With Goose

1. Create or export a recipe
2. Use `plugin-to-recipe` if converting from a plugin
3. Place recipe in `~/.goose/recipes/`
4. Run: `goose run --recipe <recipe-name>`

### With Claude Code

1. Create or export a plugin
2. Use `recipe-to-plugin` if converting from a recipe
3. Install plugin: `/plugin install <plugin-dir>`
4. Use commands: `/<command-name>`

## 📦 Dependencies

- **js-yaml**: YAML parsing and generation
- **Bun**: Runtime and build tool
- **TypeScript**: Type safety

## 🤝 Contributing

Contributions welcome! Areas for enhancement:

- Additional format support (TOML, JSON5, etc.)
- Advanced transformation options
- GUI interface
- CI/CD integration templates
- Community recipes/plugins library

## 📝 License

MIT - Feel free to use, modify, and distribute

## 🆘 Troubleshooting

### Recipe validation fails

- Check required fields: `version`, `title`, `description`, `instructions`
- Verify YAML syntax (use `yamllint` if available)
- Ensure file encoding is UTF-8

### Plugin validation fails

- Verify `plugin.json` exists in `.claude-plugin/`
- Check JSON syntax: `jq . .claude-plugin/plugin.json`
- Validate plugin ID format (lowercase + hyphens only)
- Ensure directory structure is correct

### Conversion produces unexpected output

- Check data types in source file
- Verify all required fields are populated
- Review generated files for correctness
- Use validation commands to identify issues

## 📚 Resources

- [Goose Documentation](https://block.github.io/goose/docs/)
- [Claude Code Plugins](https://docs.claude.com/en/docs/claude-code/plugins)
- [Goose Recipes Guide](https://block.github.io/goose/docs/guides/recipes/)
- [Claude Code Skills](https://docs.claude.com/en/docs/claude-code/skills)

## 🎓 Additional Notes

### When to Use Recipe → Plugin

- Share workflows within Claude Code environment
- Build team-specific command collections
- Integrate with VS Code/Terminal Claude Code
- Distribute via plugin marketplace

### When to Use Plugin → Recipe

- Share workflows within Goose environment
- Package for headless/CLI Goose usage
- Integrate with Goose session management
- Use Goose recipe features (subrecipes, retry logic)

### Best Practices

1. **Validate Before Converting**: Always validate source files first
2. **Preserve Metadata**: Keep version info updated
3. **Test After Conversion**: Verify converted files work correctly
4. **Document Changes**: Note any manual adjustments needed
5. **Version Control**: Track converted files in git
6. **Maintain Source**: Keep original files as reference

## 🚀 Advanced Usage

### Scripting Conversions

```bash
#!/bin/bash
# Convert all recipes in a directory

RECIPE_DIR="./recipes"
OUTPUT_DIR="./plugins"

for recipe in "$RECIPE_DIR"/*.yaml; do
  echo "Converting: $recipe"
  bun porter.ts recipe-to-plugin "$recipe" "$OUTPUT_DIR"
done
```

### Batch Validation

```bash
#!/bin/bash
# Validate all recipes and plugins

echo "Validating recipes..."
for recipe in ./recipes/*.yaml; do
  bun porter.ts validate-recipe "$recipe" || echo "❌ Failed: $recipe"
done

echo "Validating plugins..."
for plugin in ./plugins/*/; do
  bun porter.ts validate-plugin "$plugin" || echo "❌ Failed: $plugin"
done
```

### CI/CD Integration

```yaml
# GitHub Actions example
name: Validate Conversions
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Validate all recipes
        run: |
          for recipe in recipes/*.yaml; do
            bun porter.ts validate-recipe "$recipe"
          done

      - name: Validate all plugins
        run: |
          for plugin in plugins/*/; do
            bun porter.ts validate-plugin "$plugin"
          done
```

---

**Made with ❤️ for seamless AI workflow portability**
