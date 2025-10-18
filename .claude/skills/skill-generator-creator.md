# Skill Generator Creator

## Description
Creates custom Claude Code Skills from user specifications. Generates complete skill files with YAML manifests, instructions, examples, and documentation.

## Instructions

### Overview
This skill enables you to create new Claude Code Skills with the following components:
- Skill manifest (YAML/JSON)
- Detailed instructions
- Usage examples
- Complete documentation

### How to Use

1. **Provide Skill Details:**
   - Name: The skill name
   - Description: What the skill does
   - Category: document|automation|analysis|integration|custom
   - Instructions: Detailed usage instructions
   - Capabilities: List of capabilities
   - Examples: Usage examples
   - Environment Variables: Required/optional variables
   - MCP Servers: Associated MCP servers

2. **Skill Structure Generated:**
   ```
   skills/{skill-name}/
   ├── skill.json              # Skill manifest
   ├── instructions.md         # Detailed instructions
   ├── examples.md             # Usage examples
   └── README.md              # Documentation
   ```

3. **Manifest Format:**
   ```yaml
   version: "1.0.0"
   id: {normalized-name}
   name: "{skill-name}"
   description: "{description}"
   category: "custom|document|automation|analysis|integration"
   capabilities:
     - capability1
     - capability2
   environment_variables:
     - name: "VAR_NAME"
       required: true
       description: "Variable description"
   mcp_servers:
     - name: "server-name"
       version: "1.0.0"
   ```

### Best Practices

1. **Clear Names**: Use descriptive, lowercase names with hyphens
2. **Detailed Instructions**: Provide step-by-step instructions
3. **Examples**: Include practical usage examples
4. **Categories**: Choose appropriate category for discovery
5. **Environment Variables**: Document all required variables
6. **MCP Servers**: List all required MCP server dependencies

### Example

**Create a PDF Processing Skill:**
- Name: PDF Processing
- Description: Advanced PDF manipulation and analysis
- Category: document
- Capabilities:
  - pdf-extraction
  - pdf-conversion
  - page-manipulation
- Instructions: Use this skill for PDF operations...

### Integration

This skill can be used with:
- `recipe-generator-creator` - Create recipes that use this skill
- Claude Code Plugins - Reference the skill in plugins
- Bash integration - Call skill generators via CLI

### Output

The created skill is ready to:
- Be imported into Claude Code projects
- Be referenced in Goose recipes
- Be shared with other developers
- Be customized and extended

## Parameters

### Required
- **skill_name**: The name of the skill to create
- **description**: What the skill does
- **instructions**: Detailed usage instructions

### Optional
- **category**: Skill category (default: "custom")
- **capabilities**: List of capabilities
- **examples**: Usage examples
- **environment_variables**: Required/optional variables
- **mcp_servers**: Associated MCP servers

## Examples

### Example 1: Create a Data Analysis Skill
```
Skill Name: Data Analysis
Description: Analyze datasets and generate insights
Category: analysis
Capabilities: data-processing, reporting, visualization
Instructions:
- Load data from source
- Apply analysis algorithms
- Generate reports
```

### Example 2: Create a Document Processing Skill
```
Skill Name: Document Processor
Description: Process and extract data from documents
Category: document
Capabilities: ocr, text-extraction, formatting
Instructions:
- Accept document input
- Extract text/tables
- Format and export results
```

### Example 3: Create an Integration Skill
```
Skill Name: API Integration
Description: Integrate with external APIs
Category: integration
Capabilities: authentication, rate-limiting, error-handling
Environment Variables:
- API_KEY (required)
- API_ENDPOINT (optional)
```

## Advanced Usage

### Programmatic Creation
```typescript
import { SkillGenerator } from './src/skill-generator';

const input = {
  name: "PDF Processing",
  description: "Advanced PDF manipulation",
  instructions: "Process PDFs efficiently",
  category: "document",
  capabilities: ["pdf-extraction", "conversion"],
};

SkillGenerator.createSkillDirectory(input, "./skills");
```

### CLI Generation
```bash
bun run create-skill "PDF Processing" ./skills
bun run generate-skill "Data Analysis"
```

### Interactive Mode
```bash
bun run interactive
# Select "Claude Code Skill" and follow prompts
```

## Related Skills

- `recipe-generator-creator` - Create Goose recipes
- `subrecipe-generator-creator` - Create recipe subcomponents

## Notes

- Skills are created with full TypeScript type safety
- All generated files follow Claude Code standards
- Skills can be versioned and updated over time
- Capabilities define what the skill can do
- Environment variables are auto-documented

## Support

For issues or questions:
1. Check the generated README.md files
2. Review examples in `.claude/skills/`
3. Consult Claude Code Skills documentation
4. Check Goose Shared Recipes documentation
