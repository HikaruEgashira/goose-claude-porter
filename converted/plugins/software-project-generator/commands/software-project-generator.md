---
name: software-project-generator
description: An advanced recipe that orchestrates complete project initialization (frontend, backend, full-stack, CLI, API) with intelligent framework detection, dependency management, code quality setup, and comprehensive documentation generation
parameters:
  - name: project_name
    type: string
    required: true
  - name: project_type
    type: string
    required: true
  - name: frontend_framework
    type: string
    required: false
  - name: backend_framework
    type: string
    required: false
  - name: database
    type: string
    required: false
  - name: include_docker
    type: string
    required: false
  - name: include_cicd
    type: string
    required: false
  - name: include_testing
    type: string
    required: false
  - name: base_directory
    type: string
    required: false
---

# Software Project Generator

An advanced recipe that orchestrates complete project initialization (frontend, backend, full-stack, CLI, API) with intelligent framework detection, dependency management, code quality setup, and comprehensive documentation generation

## Description

You are a Software Project Generator that creates production-ready project structures with best practices.
Create complete projects with frontend, backend, testing, linting, Docker, CI/CD, and documentation based on user parameters.

IMPORTANT: Detect the operating system you're running on. If on Windows, be careful with disk paths - use forward slashes or properly escape backslashes to avoid path separators being interpreted as escape characters (e.g., avoid c:\src\react-project where \r becomes a carriage return).



## Task

Initialize a {{ project_type }} project named "{{ project_name }}" with the following configuration:
- Frontend: {{ frontend_framework }}
- Backend: {{ backend_framework }}
- Database: {{ database }}
- Docker: {{ include_docker }}
- CI/CD: {{ include_cicd }}
- Testing: {{ include_testing }}

Follow these steps:

1. Create Project Structure
   Navigate to {{ base_directory }} and create the project directory structure.
   Initialize git repository with appropriate .gitignore for the tech stack.
   {% if project_type == "fullstack" %}
   Create frontend/ and backend/ directories.
   {% endif %}

{% if frontend_framework != "none" %}
2. Frontend Setup
   {% if frontend_framework == "react" %}
     Create React app with Vite and TypeScript in the frontend directory.
     Install react-router-dom and axios.
     Create src/components, src/pages, src/hooks, src/utils, src/services directories.
     Set up ESLint, Prettier, and Vitest for testing.
     Create example Welcome component and test.
   {% elif frontend_framework == "vue" %}
     Create Vue 3 app with TypeScript, Router, and Pinia.
     Install axios and dev dependencies.
     Set up linting and testing.
   {% elif frontend_framework == "nextjs" %}
     Create Next.js app with TypeScript and Tailwind.
     Install axios and swr.
   {% elif frontend_framework == "svelte" %}
     Create SvelteKit app with TypeScript.
     Install axios and configure.
   {% endif %}
   Create .env.example and README.md for frontend.
   {% if include_testing == "true" %}
   Set up testing framework:
     {% if frontend_framework == "react" %}
       Configure Vitest with React Testing Library.
       Create tests for components in __tests__ directories.
       Add integration tests for key user flows.
     {% elif frontend_framework == "vue" %}
       Configure Vitest with Vue Test Utils.
       Create component and integration tests.
     {% elif frontend_framework == "nextjs" %}
       Configure Jest with React Testing Library.
       Create unit and integration tests.
     {% elif frontend_framework == "svelte" %}
       Configure Vitest with Svelte Testing Library.
       Create component tests.
     {% endif %}
     Add test scripts to package.json (test, test:watch, test:coverage).
   {% endif %}
{% endif %}

{% if backend_framework != "none" %}
3. Backend Setup
   {% if backend_framework == "nodejs" %}
     Initialize Node.js backend with Express and TypeScript.
     Install express, cors, dotenv, helmet, morgan, and types.
     {% if database == "postgresql" %}Install pg and @types/pg{% elif database == "mongodb" %}Install mongoose{% elif database == "mysql" %}Install mysql2{% elif database == "sqlite" %}Install better-sqlite3{% endif %}.
     Create src/ with routes, controllers, models, middleware, config, utils directories.
     Create src/index.ts with Express server and health endpoint.
     Set up TypeScript, ESLint, Prettier, Jest, and Supertest.
     Create example health check test.
   {% elif backend_framework == "python-fastapi" %}
     Create Python backend with virtual environment.
     Create requirements.txt with FastAPI, Uvicorn, and database drivers.
     Install dependencies.
     Create app/ with routers, models, schemas, services, core directories.
     Create app/main.py with FastAPI and health endpoint.
     Set up Black, Flake8, Mypy, and Pytest.
   {% elif backend_framework == "go" %}
     Initialize Go module.
     Install Gin and database libraries.
     Create cmd/api, internal/handlers, internal/models directories.
     Create main.go with Gin server and health endpoint.
     Set up golangci-lint and tests.
   {% elif backend_framework == "rust-actix" %}
     Create Rust project with cargo.
     Add Actix-web dependencies to Cargo.toml.
     Create main.rs with Actix server and health endpoint.
     Set up rustfmt and clippy.
   {% endif %}
   Create .env.example and README.md for backend.
   {% if include_testing == "true" %}
   Set up testing framework:
     {% if backend_framework == "nodejs" %}
       Configure Jest and Supertest for API testing.
       Create tests for routes, controllers, and services.
       Add integration tests for database operations.
       Create __tests__ directories alongside source files.
     {% elif backend_framework == "python-fastapi" %}
       Configure Pytest with pytest-asyncio and httpx.
       Create tests for endpoints, services, and models.
       Add integration tests for database operations.
       Set up test fixtures and mocks.
     {% elif backend_framework == "go" %}
       Set up Go testing with testify.
       Create _test.go files for handlers and services.
       Add integration tests for API endpoints.
     {% elif backend_framework == "rust-actix" %}
       Configure cargo test with actix-web test utilities.
       Create unit and integration tests.
       Add test modules in src files.
     {% endif %}
     Add test scripts with coverage reporting.
   {% endif %}
{% endif %}

4. Quality Tools
   Create .editorconfig for consistent formatting across editors.
   Create .vscode/settings.json with language-specific formatters.
   Create .vscode/extensions.json with recommended extensions.
   Add lint and test scripts to package.json files.
   Create check-quality.sh script to run all linters and tests.

5. Docker Setup
   {% if include_docker == "true" %}
   Create Dockerfile for each component (frontend/backend).
   Create docker-compose.yml with services for:
   {% if frontend_framework != "none" %}- Frontend{% endif %}
   {% if backend_framework != "none" %}- Backend{% endif %}
   {% if database != "none" %}- {{ database }} database{% endif %}
   Configure volumes, environment variables, and port mappings.
   Create .dockerignore file.
   {% endif %}

6. CI/CD Setup
   {% if include_cicd == "true" %}
   Create .github/workflows/ci.yml with jobs for:
   - Checkout and setup
   - Install dependencies
   - Run linters
   {% if include_testing == "true" %}
   - Run unit tests with coverage
   - Run integration tests
   {% endif %}
   - Build artifacts
   {% if include_docker == "true" %}- Build Docker images{% endif %}
   {% endif %}

7. Documentation
   Create comprehensive README.md with:
   - Project overview and tech stack
   - Prerequisites and installation
   - Development and testing instructions
   - Deployment guide
   Create CONTRIBUTING.md with development guidelines.
   Create QUICKSTART.md with common commands.
   {% if project_type != "frontend" %}Create docs/API.md with endpoint documentation.{% endif %}
   {% if database != "none" %}Create docs/DATABASE.md with schema info.{% endif %}

8. Install and Verify
   Install all dependencies for frontend and backend.
   Run linters to verify configuration.
   Run initial tests to ensure everything works.
   Display summary of created project structure and next steps.

Work through these steps systematically. Use shell commands to create files and directories.

Detect the operating system that I'm on, and use appropriate disk path separators, being careful to avoid 'escaping' of slash or backslash characters as appropriate for my operating system when interpreting or using string values for filenames.



## Parameters

- **project_name** (string, required): Name of the project to initialize (alphanumeric and dashes only)
- **project_type** (string, required): Type of project - options are 'fullstack', 'frontend', 'backend', 'cli', 'api'
- **frontend_framework** (string): Frontend framework to use (react, vue, svelte, nextjs, none)
- **backend_framework** (string): Backend framework to use (nodejs, python-fastapi, go, rust-actix, none)
- **database** (string): Database to integrate (postgresql, mongodb, mysql, sqlite, none)
- **include_docker** (string): Whether to include Docker configuration (true/false)
- **include_cicd** (string): Whether to include CI/CD pipeline (true/false)
- **include_testing** (string): Whether to include testing setup with unit and integration tests (true/false)
- **base_directory** (string): Base directory where the project should be created


## Example Usage

```
/software-project-generator `project_name=value`, `project_type=value`, `frontend_framework=react`, `backend_framework=nodejs`, `database=postgresql`, `include_docker=true`, `include_cicd=true`, `include_testing=true`, `base_directory=.`
```


## Required Extensions

- [object Object]


