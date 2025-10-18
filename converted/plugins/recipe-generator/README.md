# Recipe Generator

Creates other recipes

## Installation

```bash
/plugin install recipe-generator
```

## Usage

### Command

```bash
/recipe-generator
```

## Details

### Instructions

Recipes are a set of instructions.

Here is what a recipe should look like:
```yaml
version: 1.0.0
title: Title of my recipe
description: Recipe Template
prompt: Write your prompt in here
extensions:
  - type: builtin
    name: developer
    display_name: Developer
    timeout: 300
    bundled: true
#only required if recipe description asks for user input
#parameters are used in within prompt like \{\{ key }} and must be present
parameters:
  - key: example_parameter
    input_type: string or number
    requirement: required or optional
    description: Description of the paramater.
```

Important notes:
- title is the name of the recipe
- description is a short summary of what the recipe does
- parameters are used within prompt like \{\{ key }} and must be present if mentioned in the recipe description

Under prompt can you write instructions that achieve
{{ prompt }}

If the above is a file path, read the file to determine the goal.



### Task

Recipes are a set of instructions.

Here is what a recipe should look like:
```yaml
version: 1.0.0
title: Title of my recipe
description: Recipe Template
prompt: Write your prompt in here
extensions:
  - type: builtin
    name: developer
    display_name: Developer
    timeout: 300
    bundled: true
#only required if recipe description asks for user input
#parameters are used in within prompt like \{\{ key }} and must be present
parameters:
  - key: example_parameter
    input_type: string or number
    requirement: required or optional
    description: Description of the paramater.
```

Important notes:
- title is the name of the recipe
- description is a short summary of what the recipe does
- parameters are used within prompt like \{\{ key }} and must be present if mentioned in the recipe description

Under prompt can you write instructions that achieve
{{ prompt }}

If the above is a file path, read the file to determine the goal.



### Parameters

- **prompt** (string, required)
  Description of what I want the recipe to do. Could be a file path


### Extensions

[object Object]





## Version

1.0.0
