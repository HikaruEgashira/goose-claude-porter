# Use OpenMetadata

Interact with OpenMetadata in Goose via OpenMetadata MCP Server to generate SQL or propagate classifications

## Installation

```bash
/plugin install use-openmetadata
```

## Usage

### Command

```bash
/use-openmetadata
```

## Details

### Instructions

Utilize OpenMetadata tools to search for, retrieve, and modify metadata related to data assets such as tables, dashboards, and glossaries. Adhere to specified output formats like JSON for search queries and maintain structured responses using Markdown for human-readable information.


### Task

Take classifications from {{ fqn }} and apply them to all the tables that are listed in {{ fqn }}

Here's what to do step by step:

1. **Verify {{ fqn }} exists in openmetadata**
2. **Ask user if they will be propagating the {{ fqn }} owner/certification or a particular tag**
3. **Get details of {{ fqn }} in openmetadata**
  - the owner/certification/tag to be applied to other assets
4. **List tables of {{ fqn }}**
5. **Patch all tables that are returned**



### Parameters

- **fqn** (string, required)
  The fully qualified name of the asset in openmetadata you'd like an agent to act on


### Extensions

[object Object]





## Version

1.0.0
