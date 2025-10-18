# migrate from poetry to uv

migrate from poetry to uv

## Installation

```bash
/plugin install migrate-from-poetry-to-uv
```

## Usage

### Command

```bash
/migrate-from-poetry-to-uv
```

## Details

### Instructions

Follow the instructions to move the project from using `poetry` to `uv`


### Task

The current project uses `poetry` for Python environment and dependency management. We want to use `uv` instead.

First, verify that the above is true. If the project is actually already using `uv`, you can stop.

Start by running `uvx migrate-to-uv`. If you don't have `uv` installed, use `hermit install uv` to add it. If hermit isn't set up, use `hermit init` to do so.

Once `migrate-to-uv` has run, delete any local virtualenvs (often located at ./.venv) and run `uv sync`.

Grep for other uses of `poetry` in the project. If you can switch these commands to `uv`, do so. If not, just make a note of it.





### Extensions

[object Object]





## Version

1.0.0
