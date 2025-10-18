# Setup Guide - Goose ↔ Claude Code Porter

Complete guide to set up and use the Porter tool.

## Prerequisites

- **Bun** >= 1.0.0 - [Install Bun](https://bun.sh)
- **Node.js** >= 18 (optional, for npm compatibility)
- **Git** (for version control)

## Installation

### Step 1: Clone or Download

```bash
# Clone the repository
git clone <repository-url> goose-claude-porter
cd goose-claude-porter

# Or download and extract manually
```

### Step 2: Install Dependencies

```bash
# Using Bun
bun install

# Alternatively (using npm)
npm install
```

### Step 3: Verify Installation

```bash
# Check Bun version
bun --version

# Show help
bun porter.ts --help
```

**Expected output:**
```
  Goose Shared Recipes ↔ Claude Code Plugins Porter

  USAGE
    porter <command> [options]
  ...
```

## Quick Test

Validate the example files:

```bash
# Test recipe validation
bun porter.ts validate-recipe examples/code-review.recipe.yaml

# Test plugin validation
bun porter.ts validate-plugin examples/test-plugin

# Expected: ✅ validation passed!
```

## Configuration

### Environment Variables

Optional environment variables for advanced usage:

```bash
# Set default output directory
export PORTER_OUTPUT_DIR="./converted"

# Enable verbose logging
export PORTER_DEBUG=true

# Set custom author name
export PORTER_AUTHOR="Your Name"
```

### Configuration File (Optional)

Create `.porterrc.json` in project root:

```json
{
  "output": {
    "plugins": "./generated-plugins",
    "recipes": "./generated-recipes"
  },
  "author": "Your Name",
  "license": "MIT",
  "repository": "https://github.com/yourusername/repo",
  "verbose": false
}
```

## Directory Structure

After installation, your structure should look like:

```
goose-claude-porter/
├── porter.ts              # Main script
├── porter.test.ts         # Test suite
├── package.json          # Dependencies
├── bunfig.toml          # Bun configuration (auto-generated)
├── README.md            # Full documentation
├── SETUP.md             # This file
├── examples/            # Example files
│   ├── code-review.recipe.yaml
│   └── test-plugin/
│       ├── .claude-plugin/plugin.json
│       ├── commands/run-tests.md
│       └── agents/
├── dist/                # Compiled output (after build)
└── node_modules/        # Dependencies
```

## Basic Workflow

### Convert a Recipe to Plugin

1. **Prepare your recipe file** (`my-recipe.yaml`):
   ```yaml
   version: "1.0.0"
   title: "My Workflow"
   description: "What this workflow does"
   instructions: "Detailed instructions"
   ```

2. **Run conversion**:
   ```bash
   bun porter.ts recipe-to-plugin my-recipe.yaml ./plugins
   ```

3. **Verify output**:
   ```bash
   bun porter.ts validate-plugin ./plugins/my-workflow
   ```

### Convert a Plugin to Recipe

1. **Ensure plugin is valid**:
   ```bash
   bun porter.ts validate-plugin ./my-plugin
   ```

2. **Run conversion**:
   ```bash
   bun porter.ts plugin-to-recipe ./my-plugin ./recipes
   ```

3. **Verify output**:
   ```bash
   bun porter.ts validate-recipe ./recipes/my-plugin.yaml
   ```

## Advanced Setup

### Development Setup

For contributing or extending the tool:

```bash
# Clone with git
git clone <repo> --depth=1

# Install dev dependencies
bun install

# Run tests
bun test

# Watch for changes (development)
bun --watch porter.ts --help

# Build for production
bun build ./porter.ts --outdir dist --format esm
```

### Docker Setup (Optional)

Create `Dockerfile`:

```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package.json bunfig.toml ./
COPY porter.ts .
COPY examples ./examples

RUN bun install

ENTRYPOINT ["bun", "porter.ts"]
```

Build and run:

```bash
docker build -t porter .
docker run porter recipe-to-plugin examples/code-review.recipe.yaml /output
```

### Integration with Goose

1. **Install Goose** (if not already installed):
   ```bash
   # Follow Goose installation guide
   ```

2. **Create recipes directory**:
   ```bash
   mkdir -p ~/.goose/recipes
   ```

3. **Convert and place recipes**:
   ```bash
   bun porter.ts plugin-to-recipe ./my-plugin ~/.goose/recipes
   ```

4. **Use in Goose**:
   ```bash
   goose run --recipe ~/.goose/recipes/my-plugin.yaml
   ```

### Integration with Claude Code

1. **Create plugins directory**:
   ```bash
   mkdir -p ~/.claude/plugins
   ```

2. **Convert and place plugins**:
   ```bash
   bun porter.ts recipe-to-plugin ./my-recipe.yaml ~/.claude/plugins
   ```

3. **Install in Claude Code**:
   ```bash
   /plugin install ~/.claude/plugins/my-workflow
   ```

## Scripting and Automation

### Batch Conversion Script

Create `batch-convert.sh`:

```bash
#!/bin/bash

RECIPE_DIR="${1:-.}/recipes"
OUTPUT_DIR="${2:-.}/plugins"

if [ ! -d "$RECIPE_DIR" ]; then
  echo "Recipe directory not found: $RECIPE_DIR"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

count=0
for recipe in "$RECIPE_DIR"/*.yaml; do
  if [ -f "$recipe" ]; then
    echo "Converting: $(basename $recipe)"
    if bun porter.ts recipe-to-plugin "$recipe" "$OUTPUT_DIR"; then
      ((count++))
    else
      echo "  ❌ Failed"
    fi
  fi
done

echo "✅ Converted $count recipes"
```

Usage:

```bash
chmod +x batch-convert.sh
./batch-convert.sh ./recipes ./plugins
```

### Validation Script

Create `validate-all.sh`:

```bash
#!/bin/bash

echo "🔍 Validating recipes..."
recipes_ok=0
recipes_fail=0

for recipe in recipes/*.yaml; do
  if bun porter.ts validate-recipe "$recipe" > /dev/null 2>&1; then
    ((recipes_ok++))
  else
    echo "  ❌ $recipe"
    ((recipes_fail++))
  fi
done

echo "🔍 Validating plugins..."
plugins_ok=0
plugins_fail=0

for plugin in plugins/*/; do
  if bun porter.ts validate-plugin "$plugin" > /dev/null 2>&1; then
    ((plugins_ok++))
  else
    echo "  ❌ $plugin"
    ((plugins_fail++))
  fi
done

echo ""
echo "📊 Results:"
echo "  Recipes: $recipes_ok valid, $recipes_fail failed"
echo "  Plugins: $plugins_ok valid, $plugins_fail failed"

if [ $recipes_fail -gt 0 ] || [ $plugins_fail -gt 0 ]; then
  exit 1
fi
```

Usage:

```bash
chmod +x validate-all.sh
./validate-all.sh
```

## Troubleshooting

### Bun Not Found

```bash
# Install Bun globally
curl -fsSL https://bun.sh/install | bash

# Add to PATH
export PATH=$HOME/.bun/bin:$PATH

# Verify
bun --version
```

### Dependency Issues

```bash
# Clean install
rm -rf node_modules bunfig.toml
bun install

# Or use --force
bun install --force
```

### File Permission Errors

```bash
# Make script executable
chmod +x porter.ts

# Run with bun explicitly
bun ./porter.ts recipe-to-plugin ...
```

### Invalid YAML

```bash
# Validate YAML syntax
yamllint my-recipe.yaml

# Or use online validator
# https://www.yamllint.com/
```

### Invalid JSON in Plugin Manifest

```bash
# Validate JSON
jq . .claude-plugin/plugin.json

# Or use online validator
# https://jsonlint.com/
```

## Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test porter.test.ts

# Watch mode (re-run on changes)
bun test --watch

# With coverage (if supported)
bun test --coverage
```

## Building for Production

```bash
# Build to dist directory
bun build ./porter.ts --outdir dist --format esm

# Run built version
node dist/porter.js recipe-to-plugin my-recipe.yaml ./plugins
```

## Performance Tips

1. **Batch Operations**: Convert multiple files in sequence for better resource usage
2. **Validate First**: Always validate before converting to catch errors early
3. **Use Cache**: Generated files can be reused if source hasn't changed
4. **Parallel Processing**: For large batches, split conversion across multiple processes

## Getting Help

1. **View Help**:
   ```bash
   bun porter.ts --help
   ```

2. **Check Examples**:
   ```bash
   ls examples/
   ```

3. **Read Documentation**:
   - `README.md` - Comprehensive guide
   - `SETUP.md` - This file
   - Examples in `examples/` directory

4. **Debug Issues**:
   ```bash
   # Enable debug output
   export PORTER_DEBUG=true
   bun porter.ts <command>
   ```

## Next Steps

1. ✅ Installation complete
2. Run example conversions to understand workflow
3. Convert your first recipe or plugin
4. Automate with batch scripts
5. Integrate with Goose and Claude Code
6. Share converted workflows with your team

## Support

For issues or questions:

1. Check the [main README.md](./README.md)
2. Review example files in `examples/`
3. Run validation to identify problems
4. Check troubleshooting section above

---

Happy converting! 🚀
