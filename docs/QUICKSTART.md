# QuickStart - Porter in 5 Minutes

Get up and running with Goose ↔ Claude Code Porter instantly.

## Installation (30 seconds)

```bash
# Ensure Bun is installed
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Verify
bun porter.ts --help
```

## Try Examples (1 minute)

```bash
# Validate example recipe
bun porter.ts validate-recipe examples/code-review.recipe.yaml
# Output: ✅ Recipe validation passed!

# Validate example plugin
bun porter.ts validate-plugin examples/test-plugin
# Output: ✅ Plugin validation passed!
```

## Convert a Recipe to Plugin (1 minute)

```bash
# Convert
bun porter.ts recipe-to-plugin examples/code-review.recipe.yaml ./my-plugins

# View output
ls -la my-plugins/code-review-assistant/
# Output:
# .claude-plugin/plugin.json
# commands/code-review-assistant.md
# README.md
```

## Convert a Plugin to Recipe (1 minute)

```bash
# Convert
bun porter.ts plugin-to-recipe examples/test-plugin ./my-recipes

# View output
cat my-recipes/test-automation.yaml

# Or validate
bun porter.ts validate-recipe my-recipes/test-automation.yaml
```

## Common Commands

### Recipe ↔ Plugin

```bash
# Recipe → Plugin
bun porter.ts recipe-to-plugin <recipe.yaml> [output-dir]

# Plugin → Recipe
bun porter.ts plugin-to-recipe <plugin-dir> [output-dir] [recipe-name]

# Validate Recipe
bun porter.ts validate-recipe <recipe.yaml>

# Validate Plugin
bun porter.ts validate-plugin <plugin-dir>
```

### Automation

```bash
# Batch convert all recipes
for recipe in recipes/*.yaml; do
  bun porter.ts recipe-to-plugin "$recipe" ./plugins
done

# Validate all plugins
for plugin in plugins/*/; do
  bun porter.ts validate-plugin "$plugin"
done
```

## File Structure After Conversion

### Recipe → Plugin Output

```
my-plugins/my-workflow/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── my-workflow.md
└── README.md
```

### Plugin → Recipe Output

```
my-recipes/
└── my-plugin.yaml
```

## Integration

### Use in Goose

```bash
# Copy generated recipe to Goose
cp my-recipes/my-plugin.yaml ~/.goose/recipes/

# Run with Goose
goose run --recipe ~/.goose/recipes/my-plugin.yaml
```

### Use in Claude Code

```bash
# Install generated plugin
/plugin install ./my-plugins/my-workflow

# Use the command
/<command-from-plugin>
```

## Next Steps

1. ✅ Installation complete
2. 📖 Read [README.md](./README.md) for detailed guide
3. 🔧 Check [SETUP.md](./SETUP.md) for configuration
4. 🏗️ See [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
5. 🧪 Run `bun test` to test the tool

## Common Questions

**Q: Where do I put my recipes?**
A: Create a `recipes/` directory, add `.yaml` or `.json` files.

**Q: Can I use JSON recipes?**
A: Yes! Both YAML and JSON are supported.

**Q: What if conversion fails?**
A: Run validation first: `bun porter.ts validate-recipe <file>`

**Q: Can I customize the output?**
A: Yes! Manual edits are supported after conversion.

**Q: Can I convert back and forth?**
A: Yes! Recipe → Plugin → Recipe maintains most data.

## Troubleshooting

```bash
# Bun not found?
export PATH=$HOME/.bun/bin:$PATH

# Dependencies missing?
bun install --force

# Permission denied?
chmod +x porter.ts

# Validation fails?
cat <file> | yamllint - (for YAML)
jq . <file> (for JSON)
```

## Performance

- Single file conversion: < 100ms
- 10 files: ~ 500ms
- 100 files: ~ 5s

---

**Ready to convert? Start with:**
```bash
bun porter.ts recipe-to-plugin examples/code-review.recipe.yaml ./test-output
```

For detailed help: `bun porter.ts --help`
