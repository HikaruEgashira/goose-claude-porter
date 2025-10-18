# Porter Architecture & Implementation Guide

Technical deep-dive into the Goose ↔ Claude Code Porter implementation.

## System Design

### Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Porter CLI Interface                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐          ┌──────────────────┐        │
│  │ Recipe Parser    │          │ Plugin Parser    │        │
│  └────────┬─────────┘          └────────┬─────────┘        │
│           │                             │                  │
│  ┌────────▼──────────────────────────────▼──────┐         │
│  │         Data Validation & Transformation     │         │
│  │  - Type checking                            │         │
│  │  - Field mapping                            │         │
│  │  - Format conversion                        │         │
│  └────────┬──────────────────────────────┬─────┘         │
│           │                              │                │
│  ┌────────▼─────────────┐    ┌─────────▼──────────┐      │
│  │ Plugin Generator    │    │ Recipe Generator   │      │
│  │ - Manifest creation │    │ - YAML generation  │      │
│  │ - File structure    │    │ - Parameter config │      │
│  │ - Command gen       │    │ - MCP mapping      │      │
│  └────────┬─────────────┘    └─────────┬──────────┘      │
│           │                            │                 │
│  ┌────────▼────────────────────────────▼──────┐          │
│  │         Output File System                 │          │
│  │  - Directory structure                    │          │
│  │  - File writing                           │          │
│  └──────────────────────────────────────────┘          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Core Components

### 1. File Parsers

#### Recipe Parser
```typescript
function parseRecipe(filePath: string): GooseRecipe
```

**Responsibilities:**
- Detect file format (YAML/JSON)
- Parse YAML with `js-yaml`
- Parse JSON with native `JSON.parse()`
- Return strongly-typed `GooseRecipe` object
- Handle encoding (UTF-8)

**Error Handling:**
- Throws on invalid YAML syntax
- Throws on invalid JSON structure
- Validates against TypeScript types

#### Plugin Parser
```typescript
function parsePluginManifest(manifestPath: string): PluginManifest
function parseCommandFile(filePath: string): CommandFile
```

**Responsibilities:**
- Parse plugin.json manifest
- Extract command metadata and frontmatter
- Parse markdown files with YAML frontmatter
- Combine metadata with file content

### 2. Generators

#### Plugin Generator
```typescript
function recipeToPlugin(recipe: GooseRecipe, outputDir: string): void
```

**Process:**
1. Normalize recipe title to plugin ID
2. Create directory structure
3. Generate plugin.json manifest
4. Generate slash command from recipe
5. Create README documentation

**Key Functions:**
- `normalizeId()` - Convert title to ID format
- `generateCommandFromRecipe()` - Create command markdown
- `generateReadme()` - Create documentation
- `extractKeywords()` - Parse instructions for keywords

**Output Files:**
```
{outputDir}/{plugin-id}/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── {plugin-id}.md
└── README.md
```

#### Recipe Generator
```typescript
function pluginToRecipe(
  pluginDir: string,
  outputDir: string,
  recipeName?: string
): void
```

**Process:**
1. Parse plugin manifest
2. Extract first command file
3. Map fields to recipe format
4. Generate YAML output

**Output Files:**
```
{outputDir}/
└── {recipe-name}.yaml
```

### 3. Validators

#### Recipe Validator
```typescript
function validateRecipe(recipe: GooseRecipe, filePath: string): void
```

**Checks:**
- Required fields: `version`, `title`, `description`, `instructions`
- Type correctness
- Field format compliance
- Array structure validation

**Error Reporting:**
- Lists all validation errors
- Throws if any errors found

#### Plugin Validator
```typescript
function validatePlugin(pluginDir: string): void
```

**Checks:**
- Manifest exists and is valid JSON
- Required manifest fields
- Plugin ID format
- Directory structure
- Schema compliance

## Data Structures

### GooseRecipe Interface

```typescript
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
```

### PluginManifest Interface

```typescript
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
```

### CommandFile Interface

```typescript
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
```

## Transformation Logic

### Recipe → Plugin Transformation

```
Recipe Field              Plugin Mapping
─────────────────        ──────────────────────────
title                    → id (normalized)
                         → name in manifest
description              → description in manifest
version                  → version in manifest
instructions             → command markdown body
prompt                   → example section
parameters               → environment_variables
                           (name converted to UPPERCASE)
extensions               → referenced in command docs
mcp_servers             → mcp_servers in manifest
```

**Transformation Steps:**

1. **ID Normalization:**
   ```
   "Code Review Assistant"
   → "code-review-assistant"
   ```

2. **Parameter Conversion:**
   ```yaml
   parameters:
     - name: file_path
       type: string
   →
   environment_variables:
     - name: FILE_PATH
       type: string
   ```

3. **Command Generation:**
   - Combine title, description, instructions
   - Add parameters documentation
   - Include examples
   - Reference extensions

### Plugin → Recipe Transformation

```
Plugin Element           Recipe Mapping
──────────────          ─────────────────────
name                    → title
description             → description
version                 → version
command instructions    → instructions
environment_variables   → parameters
                         (name converted to lowercase)
mcp_servers            → mcp_servers
```

**Transformation Steps:**

1. **Field Mapping:**
   ```json
   {
     "name": "Test Suite",
     "description": "Run tests",
     "version": "1.0.0"
   }
   →
   title: "Test Suite"
   description: "Run tests"
   version: "1.0.0"
   ```

2. **Environment Variable Conversion:**
   ```json
   {
     "name": "TEST_FRAMEWORK",
     "required": true
   }
   →
   - name: test_framework
     type: string
     required: true
   ```

3. **Command Integration:**
   - Extract first command file
   - Use command markdown as instructions
   - Parse frontmatter for metadata

## CLI Architecture

### Command Router

```typescript
async function main(): Promise<void>
  → Parses CLI arguments
  → Routes to appropriate handler
  → Executes command
  → Reports results
```

### Commands

1. **recipe-to-plugin**
   - Args: `<recipe-file>` `[output-dir]`
   - Handler: `recipeToPlugin()`
   - Output: Plugin directory

2. **plugin-to-recipe**
   - Args: `<plugin-dir>` `[output-dir]` `[recipe-name]`
   - Handler: `pluginToRecipe()`
   - Output: Recipe YAML file

3. **validate-recipe**
   - Args: `<recipe-file>`
   - Handler: `validateRecipe()`
   - Output: Validation report

4. **validate-plugin**
   - Args: `<plugin-dir>`
   - Handler: `validatePlugin()`
   - Output: Validation report

5. **--help/-h**
   - Shows usage documentation

6. **--version/-v**
   - Shows version number

## Error Handling Strategy

### Error Types

1. **File Not Found**
   ```typescript
   if (!fs.existsSync(filePath)) {
     throw new Error(`File not found: ${filePath}`);
   }
   ```

2. **Invalid Format**
   ```typescript
   try {
     const data = JSON.parse(content);
   } catch (error) {
     throw new Error(`Invalid JSON: ${error.message}`);
   }
   ```

3. **Validation Failure**
   ```typescript
   const errors = [];
   if (!recipe.version) errors.push("Missing version");
   if (errors.length > 0) {
     throw new Error(`Validation failed: ${errors.join(", ")}`);
   }
   ```

4. **I/O Errors**
   ```typescript
   try {
     fs.writeFileSync(path, content);
   } catch (error) {
     throw new Error(`Write failed: ${error.message}`);
   }
   ```

### Error Reporting

- CLI errors displayed to stderr
- Exit code 1 on error
- Detailed error messages with context
- Suggestions for resolution

## Performance Considerations

### Optimization Techniques

1. **Minimal File I/O**
   - Read files once
   - Batch write operations
   - Avoid unnecessary copying

2. **Efficient Parsing**
   - Use native modules (yaml, JSON)
   - Single-pass validation
   - Early exit on errors

3. **Memory Usage**
   - Stream large files if needed
   - Avoid loading entire directory in memory
   - Clean up temporary variables

### Scalability

- **Single File**: < 100ms
- **Directory with 10 files**: ~ 500ms
- **Directory with 100 files**: ~ 5s

## Testing Strategy

### Test Categories

1. **Unit Tests**
   - Individual function testing
   - Edge case handling
   - Type checking

2. **Integration Tests**
   - Full conversion workflows
   - File I/O operations
   - Error scenarios

3. **Regression Tests**
   - Example file conversions
   - Format compatibility
   - Backward compatibility

### Test Coverage Areas

- Recipe parsing (YAML/JSON)
- Plugin manifest validation
- File structure validation
- Type safety checks
- Data transformation logic
- Error handling
- CLI interface

## Extensibility

### Adding New Features

1. **New File Formats**
   - Extend parseRecipe() with format detection
   - Add parser for new format
   - Add generator for new format

2. **New Transformations**
   - Add transformation logic in mapping functions
   - Update interfaces as needed
   - Add tests for new behavior

3. **New Validators**
   - Add validation function
   - Integrate into validate commands
   - Document validation rules

### Plugin Points

```typescript
// Custom transformation hooks
interface TransformationOptions {
  onBeforeTransform?: (data: any) => void;
  onAfterTransform?: (data: any) => void;
  customFieldMapping?: Record<string, string>;
}

// Custom validators
interface ValidatorOptions {
  strictMode?: boolean;
  customRules?: ValidationRule[];
  ignoreFields?: string[];
}
```

## Dependencies

### Core Dependencies

- **js-yaml**: YAML parsing
  - Alternative: yaml
  - Handles complex YAML structures
  - Exports proper TypeScript types

- **Bun Runtime**
  - File I/O (fs module)
  - Process management
  - TypeScript support

### Optional Dependencies

- **TypeScript** (already in runtime)
  - Type checking during development
  - Compile-time safety

## Build & Distribution

### Development Build

```bash
bun porter.ts <command>
```

### Production Build

```bash
bun build ./porter.ts --outdir dist --format esm
```

### Output

- Single bundled .js file
- Tree-shaken dependencies
- ~50KB minified size

## Environment Integration

### Goose Integration

- Recipe validation against Goose schema
- Support for Goose-specific features:
  - Subrecipes
  - Retry logic
  - Extensions

### Claude Code Integration

- Plugin validation against Claude Code schema
- Support for Claude Code components:
  - Commands
  - Agents
  - Skills
  - Hooks
  - MCP Servers

## Future Enhancements

### Planned Features

1. **Batch Processing**
   - Process multiple files in one command
   - Progress reporting
   - Error recovery

2. **Incremental Conversion**
   - Skip already converted files
   - Delta updates
   - File watching

3. **Template System**
   - Custom command templates
   - Plugin scaffolding
   - Recipe templates

4. **GUI Interface**
   - Web-based converter
   - Drag & drop support
   - Preview before conversion

5. **Extended Format Support**
   - TOML support
   - JSON5 support
   - YAML 1.2 advanced features

---

**Last Updated:** 2025-10-18
**Version:** 1.0.0
