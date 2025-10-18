#!/usr/bin/env bun
/**
 * Goose Shared Recipes ↔ Claude Code Plugins Porter
 *
 * Converts between Goose recipe format and Claude Code plugin format.
 * Enables seamless transition of workflows between the two platforms.
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

// Type definitions
interface GooseRecipe {
  version: string;
  title: string;
  description: string;
  instructions: string;
  prompt?: string;
  extensions?: string[];
  mcp_servers?: Record<string, unknown>[];
  parameters?: Array<{
    name: string;
    description: string;
    type: string;
    required?: boolean;
    default?: unknown;
  }>;
  subrecipes?: Array<{
    recipe: string;
    wait_for_completion?: boolean;
  }>;
  retry_config?: {
    max_attempts: number;
    delay_seconds: number;
    backoff_multiplier?: number;
  };
}

interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: string;
  repository?: string;
  license?: string;
  keywords?: string[];
  commands?: string;
  agents?: string;
  skills?: string;
  hooks?: string;
  mcp_servers?: Array<{
    name: string;
    config?: Record<string, unknown>;
  }>;
  environment_variables?: Array<{
    name: string;
    required: boolean;
    description: string;
  }>;
}

interface CommandFile {
  name: string;
  description: string;
  parameters?: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
  instructions: string;
  examples?: string[];
}

// Utility functions
function normalizeId(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function extractMetadata(text: string): Record<string, unknown> {
  const yamlMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (yamlMatch) {
    try {
      return yaml.load(yamlMatch[1]) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
}

function stripMetadata(text: string): string {
  return text.replace(/^---\n[\s\S]*?\n---\n/, "");
}

// Goose Recipe Parser
function parseRecipe(filePath: string): GooseRecipe {
  const content = fs.readFileSync(filePath, "utf-8");
  const ext = path.extname(filePath).toLowerCase();

  let data: Record<string, unknown>;

  if (ext === ".yaml" || ext === ".yml") {
    data = yaml.load(content) as Record<string, unknown>;
  } else if (ext === ".json") {
    data = JSON.parse(content) as Record<string, unknown>;
  } else {
    throw new Error(`Unsupported file format: ${ext}`);
  }

  // Normalize different Goose recipe formats
  const recipe = normalizeGooseRecipe(data);
  return recipe;
}

// Normalize different Goose recipe formats to standard structure
function normalizeGooseRecipe(data: Record<string, unknown>): GooseRecipe {
  // Handle both formats: direct fields and nested 'recipe' object
  const source = (data.recipe as Record<string, unknown>) || data;

  // Ensure required fields exist
  const title =
    (source.title as string) ||
    (source.name as string) ||
    "Untitled Recipe";
  const description =
    (source.description as string) ||
    (source.summary as string) ||
    "No description";
  const version = (source.version as string) || "1.0.0";

  // Handle instructions from various fields
  let instructions =
    (source.instructions as string) ||
    (source.instruction as string) ||
    (source.prompt as string) ||
    description;

  // Handle parameters from different formats
  const parameters = normalizeParameters(source.parameters as unknown);

  return {
    version,
    title,
    description,
    instructions,
    prompt: (source.prompt as string) || undefined,
    extensions: normalizeArray(source.extensions as unknown),
    mcp_servers: normalizeMcpServers(source.mcp_servers as unknown),
    parameters,
    subrecipes: normalizeSubrecipes(source.subrecipes as unknown),
    retry_config: source.retry_config as GooseRecipe["retry_config"],
  };
}

// Normalize various parameter formats
function normalizeParameters(
  params: unknown
): GooseRecipe["parameters"] | undefined {
  if (!Array.isArray(params)) return undefined;

  return params.map((p: unknown) => {
    const param = p as Record<string, unknown>;
    return {
      name: (param.name || param.key) as string,
      description: (param.description || param.desc) as string,
      type: (param.type || param.input_type || "string") as string,
      required: (param.required !== false && param.requirement !== "optional"),
      default: param.default || param.default_value,
    };
  });
}

// Normalize array fields
function normalizeArray(arr: unknown): string[] | undefined {
  if (!arr) return undefined;
  if (Array.isArray(arr)) return arr as string[];
  if (typeof arr === "string") return [arr];
  return undefined;
}

// Normalize MCP servers
function normalizeMcpServers(
  servers: unknown
): Record<string, unknown>[] | undefined {
  if (!servers) return undefined;
  if (Array.isArray(servers)) return servers as Record<string, unknown>[];
  if (typeof servers === "object") return [servers as Record<string, unknown>];
  return undefined;
}

// Normalize subrecipes
function normalizeSubrecipes(
  subrecipes: unknown
): GooseRecipe["subrecipes"] | undefined {
  if (!Array.isArray(subrecipes)) return undefined;
  return subrecipes.map((s: unknown) => {
    const sub = s as Record<string, unknown>;
    return {
      recipe: (sub.recipe || sub.name) as string,
      wait_for_completion: (sub.wait_for_completion ?? true) as boolean,
    };
  });
}

// Claude Code Plugin Generator with multi-component support
function recipeToPlugin(recipe: GooseRecipe, outputDir: string): void {
  const pluginId = normalizeId(recipe.title);
  const pluginDir = path.join(outputDir, pluginId);

  // Create directory structure
  fs.mkdirSync(pluginDir, { recursive: true });
  fs.mkdirSync(path.join(pluginDir, ".claude-plugin"), { recursive: true });
  fs.mkdirSync(path.join(pluginDir, "commands"), { recursive: true });

  // Create agents directory if subrecipes exist
  if (recipe.subrecipes && recipe.subrecipes.length > 0) {
    fs.mkdirSync(path.join(pluginDir, "agents"), { recursive: true });
  }

  // Generate plugin manifest with multi-component support
  const manifest: PluginManifest = {
    id: pluginId,
    name: recipe.title,
    version: recipe.version || "1.0.0",
    description: recipe.description,
    keywords: extractKeywords(recipe.instructions),
    commands: "commands",
    environment_variables: recipe.parameters?.map((param) => ({
      name: param.name.toUpperCase(),
      required: param.required ?? true,
      description: param.description,
    })),
  };

  // Add agents if subrecipes exist
  if (recipe.subrecipes && recipe.subrecipes.length > 0) {
    manifest.agents = "agents";
  }

  if (recipe.mcp_servers && recipe.mcp_servers.length > 0) {
    manifest.mcp_servers = recipe.mcp_servers.map((server, idx) => ({
      name: `mcp-server-${idx}`,
      config: server,
    }));
  }

  fs.writeFileSync(
    path.join(pluginDir, ".claude-plugin", "plugin.json"),
    JSON.stringify(manifest, null, 2)
  );

  // Generate slash command from recipe
  const commandContent = generateCommandFromRecipe(recipe);
  fs.writeFileSync(
    path.join(pluginDir, "commands", `${pluginId}.md`),
    commandContent
  );

  // Generate subagents from subrecipes
  if (recipe.subrecipes && recipe.subrecipes.length > 0) {
    generateSubagentsFromSubrecipes(recipe.subrecipes, pluginDir);
  }

  // Generate README
  const readme = generateReadme(recipe, pluginId);
  fs.writeFileSync(path.join(pluginDir, "README.md"), readme);

  console.log(`✅ Plugin created: ${pluginDir}`);
  console.log(`   ID: ${pluginId}`);
  if (recipe.subrecipes && recipe.subrecipes.length > 0) {
    console.log(`   Subagents: ${recipe.subrecipes.length}`);
  console.log(`   Name: ${recipe.title}`);
}

// Generate subagents from subrecipes
function generateSubagentsFromSubrecipes(
  subrecipes: Array<{ recipe: string; wait_for_completion?: boolean }>,
  pluginDir: string
): void {
  subrecipes.forEach((subrecipe, idx) => {
    const agentId = normalizeId(subrecipe.recipe);
    const agentContent = `---
description: Specialized agent for ${subrecipe.recipe}
capabilities: ["${subrecipe.recipe.toLowerCase().replace(/\s+/g, "-")}"]
wait_for_completion: ${subrecipe.wait_for_completion ?? true}
---

# ${subrecipe.recipe}

This is a specialized subagent that handles the "${subrecipe.recipe}" workflow.

## Capabilities

- Execute the ${subrecipe.recipe} workflow
- Handle task-specific requirements
- Report results and status

## When to Use

Invoke this agent when you need to:
- Run the ${subrecipe.recipe} task
- Process related workflows
- Complete specialized operations

## Context

This agent is part of a larger workflow system and coordinates with other agents and components.
`;

    fs.writeFileSync(
      path.join(pluginDir, "agents", `${agentId}.md`),
      agentContent
    );
  });
}

function generateCommandFromRecipe(recipe: GooseRecipe): string {
  const params = (recipe.parameters || [])
    .map(
      (p) => `- **${p.name}** (${p.type}${p.required ? ", required" : ""}): ${p.description}`
    )
    .join("\n");

  const examples = (recipe.parameters || [])
    .map((p) => `\`${p.name}=${p.default || "value"}\``)
    .join(", ");

  return `---
name: ${recipe.title.toLowerCase().replace(/\s+/g, "-")}
description: ${recipe.description}
${recipe.parameters && recipe.parameters.length > 0 ? `parameters:\n${recipe.parameters.map((p) => `  - name: ${p.name}\n    type: ${p.type}\n    required: ${p.required ?? true}`).join("\n")}` : ""}
---

# ${recipe.title}

${recipe.description}

## Description

${recipe.instructions}

${recipe.prompt ? `\n## Task\n\n${recipe.prompt}` : ""}

${
  params
    ? `\n## Parameters\n\n${params}`
    : ""
}

${
  examples
    ? `\n## Example Usage\n\n\`\`\`\n/${recipe.title.toLowerCase().replace(/\s+/g, "-")} ${examples}\n\`\`\``
    : ""
}

${
  recipe.extensions && recipe.extensions.length > 0
    ? `\n## Required Extensions\n\n${recipe.extensions.map((e) => `- ${e}`).join("\n")}`
    : ""
}

${
  recipe.retry_config
    ? `\n## Retry Configuration\n\n- Max Attempts: ${recipe.retry_config.max_attempts}\n- Delay: ${recipe.retry_config.delay_seconds}s\n${recipe.retry_config.backoff_multiplier ? `- Backoff Multiplier: ${recipe.retry_config.backoff_multiplier}` : ""}`
    : ""
}
`;
}

function generateReadme(recipe: GooseRecipe, pluginId: string): string {
  const commandName = recipe.title.toLowerCase().replace(/\s+/g, "-");

  return `# ${recipe.title}

${recipe.description}

## Installation

\`\`\`bash
/plugin install ${pluginId}
\`\`\`

## Usage

### Commands

\`\`\`bash
/${commandName}
\`\`\`

${
  recipe.subrecipes && recipe.subrecipes.length > 0
    ? `\n### Subagents\n\nThis plugin includes specialized subagents for:\n${recipe.subrecipes.map((sr) => `- **${sr.recipe}** (wait_for_completion: ${sr.wait_for_completion ?? true})`).join("\n")}`
    : ""
}

## Plugin Components

This plugin includes:
- ✅ **Slash Command**: \`/${commandName}\`
${recipe.subrecipes && recipe.subrecipes.length > 0 ? `- ✅ **Subagents**: ${recipe.subrecipes.length} specialized agents` : ""}
${recipe.parameters && recipe.parameters.length > 0 ? `- ✅ **Parameters**: ${recipe.parameters.length} configurable options` : ""}

## Details

### Instructions

${recipe.instructions}

${recipe.prompt ? `\n### Task\n\n${recipe.prompt}` : ""}

${
  recipe.parameters && recipe.parameters.length > 0
    ? `\n### Parameters\n\n${recipe.parameters.map((p) => `- **${p.name}** (${p.type}${p.required ? ", required" : ""})\n  ${p.description}`).join("\n\n")}`
    : ""
}

${
  recipe.extensions && recipe.extensions.length > 0
    ? `\n### Extensions\n\n${recipe.extensions.join(", ")}`
    : ""
}

${
  recipe.mcp_servers && recipe.mcp_servers.length > 0
    ? `\n### MCP Servers\n\n\`\`\`json\n${JSON.stringify(recipe.mcp_servers, null, 2)}\n\`\`\``
    : ""
}

${
  recipe.subrecipes && recipe.subrecipes.length > 0
    ? `\n### Subrecipes/Subagents\n\nThis plugin orchestrates the following subagents:\n\n${recipe.subrecipes.map((sr) => `- **${sr.recipe}**\n  - Wait for completion: ${sr.wait_for_completion ?? true}`).join("\n\n")}`
    : ""
}

${
  recipe.retry_config
    ? `\n### Retry Configuration\n\n- Max Attempts: ${recipe.retry_config.max_attempts}\n- Delay: ${recipe.retry_config.delay_seconds}s${recipe.retry_config.backoff_multiplier ? `\n- Backoff Multiplier: ${recipe.retry_config.backoff_multiplier}` : ""}`
    : ""
}

## Architecture

\`\`\`
${pluginId}/
├── .claude-plugin/plugin.json    # Plugin manifest
├── commands/
│   └── ${commandName}.md          # Main slash command
├── README.md                     # This file
\`\`\`

## Version

${recipe.version || "1.0.0"}

## Workflow

This plugin implements the following workflow:

1. Main command triggers via \`/${commandName}\`
2. Orchestrates subagents (if applicable)
3. Collects parameters from environment variables
4. Executes tasks with retry logic (if configured)
5. Reports results and status
`;
}

// Plugin Parser
function parsePluginManifest(manifestPath: string): PluginManifest {
  const content = fs.readFileSync(manifestPath, "utf-8");
  return JSON.parse(content) as PluginManifest;
}

function parseCommandFile(filePath: string): CommandFile {
  const content = fs.readFileSync(filePath, "utf-8");
  const metadata = extractMetadata(content);
  const body = stripMetadata(content);

  return {
    name: (metadata.name as string) || path.basename(filePath, ".md"),
    description: (metadata.description as string) || "",
    parameters: (metadata.parameters as unknown[])?.map((p: unknown) => {
      const param = p as Record<string, unknown>;
      return {
        name: param.name as string,
        description: param.description as string,
        required: (param.required as boolean) ?? true,
      };
    }),
    instructions: body,
    examples: extractExamples(body),
  };
}

function extractExamples(text: string): string[] {
  const examples: string[] = [];
  const exampleMatch = text.match(/## Example[s]?\n([\s\S]*?)(?=\n## |\n---|\Z)/);
  if (exampleMatch) {
    const exampleText = exampleMatch[1];
    const codeBlocks = exampleText.match(/```[\s\S]*?```/g) || [];
    examples.push(...codeBlocks);
  }
  return examples;
}

// Claude Plugin to Goose Recipe Converter
function pluginToRecipe(
  pluginDir: string,
  outputDir: string,
  recipeName?: string
): void {
  const manifestPath = path.join(pluginDir, ".claude-plugin", "plugin.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Plugin manifest not found: ${manifestPath}`);
  }

  const manifest = parsePluginManifest(manifestPath);

  // Parse first command file if available
  let command: CommandFile | null = null;
  const commandsDir = path.join(pluginDir, "commands");
  if (fs.existsSync(commandsDir)) {
    const commandFiles = fs
      .readdirSync(commandsDir)
      .filter((f) => f.endsWith(".md"));
    if (commandFiles.length > 0) {
      command = parseCommandFile(path.join(commandsDir, commandFiles[0]));
    }
  }

  // Generate recipe
  const recipe: GooseRecipe = {
    version: manifest.version || "1.0.0",
    title: manifest.name,
    description: manifest.description,
    instructions:
      command?.instructions || manifest.description ||
      "Generated from Claude Code plugin",
    mcp_servers: manifest.mcp_servers?.map((s) => s.config),
    keywords: manifest.keywords,
  };

  if (manifest.environment_variables && manifest.environment_variables.length > 0) {
    recipe.parameters = manifest.environment_variables.map((env) => ({
      name: env.name.toLowerCase(),
      description: env.description,
      type: "string",
      required: env.required,
    }));
  }

  // Write recipe
  fs.mkdirSync(outputDir, { recursive: true });

  const recipePath = path.join(
    outputDir,
    `${recipeName || normalizeId(manifest.name)}.yaml`
  );
  fs.writeFileSync(recipePath, yaml.dump(recipe, { lineWidth: -1 }));

  console.log(`✅ Recipe created: ${recipePath}`);
  console.log(`   Title: ${recipe.title}`);
  console.log(`   Version: ${recipe.version}`);
}

// Helper function to extract keywords
function extractKeywords(text: string): string[] {
  const keywords = new Set<string>();
  const commonKeywords = [
    "review",
    "test",
    "build",
    "deploy",
    "debug",
    "format",
    "analyze",
    "generate",
    "validate",
    "optimize",
  ];
  commonKeywords.forEach((keyword) => {
    if (text.toLowerCase().includes(keyword)) {
      keywords.add(keyword);
    }
  });
  return Array.from(keywords);
}

// CLI Interface
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const command = args[0];

  try {
    if (command === "recipe-to-plugin") {
      if (args.length < 2) {
        console.error("❌ Usage: recipe-to-plugin <recipe-file> [output-dir]");
        process.exit(1);
      }
      const recipeFile = args[1];
      const outputDir = args[2] || "./generated-plugins";

      if (!fs.existsSync(recipeFile)) {
        console.error(`❌ Recipe file not found: ${recipeFile}`);
        process.exit(1);
      }

      const recipe = parseRecipe(recipeFile);
      recipeToPlugin(recipe, outputDir);
      console.log(`\n📦 Plugin conversion complete!`);
      console.log(`   Output: ${path.resolve(outputDir)}`);
    } else if (command === "plugin-to-recipe") {
      if (args.length < 2) {
        console.error(
          "❌ Usage: plugin-to-recipe <plugin-dir> [output-dir] [recipe-name]"
        );
        process.exit(1);
      }
      const pluginDir = args[1];
      const outputDir = args[2] || "./generated-recipes";
      const recipeName = args[3];

      if (!fs.existsSync(pluginDir)) {
        console.error(`❌ Plugin directory not found: ${pluginDir}`);
        process.exit(1);
      }

      pluginToRecipe(pluginDir, outputDir, recipeName);
      console.log(`\n🎯 Recipe conversion complete!`);
      console.log(`   Output: ${path.resolve(outputDir)}`);
    } else if (command === "validate-recipe") {
      if (args.length < 2) {
        console.error("❌ Usage: validate-recipe <recipe-file>");
        process.exit(1);
      }
      const recipeFile = args[1];

      if (!fs.existsSync(recipeFile)) {
        console.error(`❌ Recipe file not found: ${recipeFile}`);
        process.exit(1);
      }

      const recipe = parseRecipe(recipeFile);
      validateRecipe(recipe, recipeFile);
      console.log(`✅ Recipe validation passed!`);
    } else if (command === "validate-plugin") {
      if (args.length < 2) {
        console.error("❌ Usage: validate-plugin <plugin-dir>");
        process.exit(1);
      }
      const pluginDir = args[1];

      if (!fs.existsSync(pluginDir)) {
        console.error(`❌ Plugin directory not found: ${pluginDir}`);
        process.exit(1);
      }

      validatePlugin(pluginDir);
      console.log(`✅ Plugin validation passed!`);
    } else if (command === "--help" || command === "-h") {
      printHelp();
    } else if (command === "--version" || command === "-v") {
      console.log("Goose ↔ Claude Code Porter v1.0.0");
    } else {
      console.error(`❌ Unknown command: ${command}`);
      printHelp();
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Validation functions
function validateRecipe(recipe: GooseRecipe, filePath: string): void {
  const errors: string[] = [];

  // Required fields
  if (!recipe.version) errors.push("Missing required field: version");
  if (!recipe.title) errors.push("Missing required field: title");
  if (!recipe.description) errors.push("Missing required field: description");
  if (!recipe.instructions) errors.push("Missing required field: instructions");

  // Field types
  if (typeof recipe.version !== "string")
    errors.push("Field 'version' must be a string");
  if (typeof recipe.title !== "string")
    errors.push("Field 'title' must be a string");
  if (typeof recipe.description !== "string")
    errors.push("Field 'description' must be a string");
  if (typeof recipe.instructions !== "string")
    errors.push("Field 'instructions' must be a string");

  if (errors.length > 0) {
    console.error(`❌ Recipe validation failed for ${filePath}:`);
    errors.forEach((err) => console.error(`   - ${err}`));
    throw new Error("Recipe validation failed");
  }
}

function validatePlugin(pluginDir: string): void {
  const errors: string[] = [];

  // Check manifest exists
  const manifestPath = path.join(pluginDir, ".claude-plugin", "plugin.json");
  if (!fs.existsSync(manifestPath)) {
    errors.push(
      "Missing plugin manifest: .claude-plugin/plugin.json"
    );
  } else {
    try {
      const manifest = parsePluginManifest(manifestPath);

      // Validate manifest fields
      if (!manifest.id) errors.push("Missing required field in manifest: id");
      if (!manifest.name) errors.push("Missing required field in manifest: name");
      if (!manifest.version)
        errors.push("Missing required field in manifest: version");
      if (!manifest.description)
        errors.push("Missing required field in manifest: description");

      // Validate ID format
      if (manifest.id && !/^[a-z0-9-]+$/.test(manifest.id)) {
        errors.push(
          "Plugin ID must contain only lowercase letters, numbers, and hyphens"
        );
      }
    } catch (err) {
      errors.push(
        `Invalid manifest JSON: ${err instanceof Error ? err.message : err}`
      );
    }
  }

  if (errors.length > 0) {
    console.error(`❌ Plugin validation failed for ${pluginDir}:`);
    errors.forEach((err) => console.error(`   - ${err}`));
    throw new Error("Plugin validation failed");
  }
}

function printHelp(): void {
  console.log(`
  Goose Shared Recipes ↔ Claude Code Plugins Porter

  USAGE
    porter <command> [options]

  COMMANDS
    recipe-to-plugin <recipe-file> [output-dir]
      Convert a Goose Recipe to a Claude Code Plugin

      Arguments:
        recipe-file    Path to Goose recipe file (.yaml or .json)
        output-dir     Output directory (default: ./generated-plugins)

    plugin-to-recipe <plugin-dir> [output-dir] [recipe-name]
      Convert a Claude Code Plugin to a Goose Recipe

      Arguments:
        plugin-dir     Path to Claude Code plugin directory
        output-dir     Output directory (default: ./generated-recipes)
        recipe-name    Custom recipe name (optional)

    validate-recipe <recipe-file>
      Validate a Goose Recipe file

      Arguments:
        recipe-file    Path to recipe file to validate

    validate-plugin <plugin-dir>
      Validate a Claude Code Plugin

      Arguments:
        plugin-dir     Path to plugin directory to validate

    --help, -h       Show this help message
    --version, -v    Show version information

  EXAMPLES
    # Convert Goose recipe to Claude Code plugin
    porter recipe-to-plugin ./my-recipe.yaml ./plugins

    # Convert Claude Code plugin to Goose recipe
    porter plugin-to-recipe ./my-plugin ./recipes

    # Validate recipe format
    porter validate-recipe ./my-recipe.yaml

    # Validate plugin structure
    porter validate-plugin ./my-plugin

  `);
}

// Run main
(async () => {
  try {
    await main();
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  }
})();
