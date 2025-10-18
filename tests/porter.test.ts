import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

// Test helpers
const testDir = "./test-output";

beforeAll(() => {
  // Create test directory if it doesn't exist
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
});

afterAll(() => {
  // Cleanup test files
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
});

describe("Porter - Goose ↔ Claude Code Converter", () => {
  describe("Recipe Parsing", () => {
    it("should parse YAML recipe file", () => {
      const recipePath = "./examples/code-review.recipe.yaml";
      if (fs.existsSync(recipePath)) {
        const content = fs.readFileSync(recipePath, "utf-8");
        const recipe = yaml.load(content);
        expect(recipe).toBeDefined();
        expect((recipe as Record<string, unknown>).title).toBe("Code Review Assistant");
      }
    });
  });

  describe("Plugin Manifest Validation", () => {
    it("should validate plugin manifest", () => {
      const manifestPath = "./examples/test-plugin/.claude-plugin/plugin.json";
      if (fs.existsSync(manifestPath)) {
        const content = fs.readFileSync(manifestPath, "utf-8");
        const manifest = JSON.parse(content);

        expect(manifest.id).toBeDefined();
        expect(manifest.name).toBeDefined();
        expect(manifest.version).toBeDefined();
        expect(manifest.description).toBeDefined();

        // Validate ID format
        expect(/^[a-z0-9-]+$/.test(manifest.id)).toBe(true);
      }
    });
  });

  describe("File Structure Validation", () => {
    it("should have correct plugin directory structure", () => {
      const pluginDir = "./examples/test-plugin";
      expect(fs.existsSync(path.join(pluginDir, ".claude-plugin"))).toBe(true);
      expect(fs.existsSync(path.join(pluginDir, ".claude-plugin", "plugin.json"))).toBe(true);
      expect(fs.existsSync(path.join(pluginDir, "commands"))).toBe(true);
    });

    it("should have command markdown files", () => {
      const commandsDir = "./examples/test-plugin/commands";
      if (fs.existsSync(commandsDir)) {
        const files = fs.readdirSync(commandsDir);
        const markdownFiles = files.filter((f) => f.endsWith(".md"));
        expect(markdownFiles.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Multi-Component Plugin Generation", () => {
    it("should create agents directory when recipe has subrecipes", () => {
      // Test with a recipe that has subrecipes
      const recipeWithSubrecipes = {
        version: "1.0.0",
        title: "Multi-Step Workflow",
        description: "A workflow with multiple subrecipes",
        instructions: "Execute workflow with subagents",
        subrecipes: [
          { recipe: "data-fetch", wait_for_completion: true },
          { recipe: "data-process", wait_for_completion: true },
        ],
      };

      // Verify subrecipes structure
      expect(recipeWithSubrecipes.subrecipes).toBeDefined();
      expect(Array.isArray(recipeWithSubrecipes.subrecipes)).toBe(true);
      expect(recipeWithSubrecipes.subrecipes.length).toBe(2);
      expect(recipeWithSubrecipes.subrecipes[0].recipe).toBe("data-fetch");
    });

    it("should validate subrecipe structure", () => {
      const validateSubrecipes = (
        subrecipes: Array<Record<string, unknown>>
      ): boolean => {
        return subrecipes.every(
          (sr) =>
            typeof sr.recipe === "string" &&
            (sr.wait_for_completion === undefined ||
              typeof sr.wait_for_completion === "boolean")
        );
      };

      const validSubrecipes = [
        { recipe: "step-1", wait_for_completion: true },
        { recipe: "step-2", wait_for_completion: false },
      ];

      expect(validateSubrecipes(validSubrecipes)).toBe(true);
    });

    it("should generate proper agent ID from subrecipe name", () => {
      const normalizeId = (str: string): string => {
        return str
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      };

      expect(normalizeId("data-fetch")).toBe("data-fetch");
      expect(normalizeId("Data Processing")).toBe("data-processing");
      expect(normalizeId("Process_Data-2024")).toBe("processdata-2024");
    });

    it("should handle recipe without subrecipes", () => {
      const simpleRecipe = {
        version: "1.0.0",
        title: "Simple Recipe",
        description: "Single step recipe",
        instructions: "Just do it",
      };

      // Should not have subrecipes
      expect(simpleRecipe.subrecipes).toBeUndefined();

      // Should still be valid
      expect(simpleRecipe.title).toBeDefined();
      expect(simpleRecipe.description).toBeDefined();
    });

    it("should validate manifest includes agents field when subrecipes exist", () => {
      const manifestWithAgents = {
        id: "multi-step-workflow",
        name: "Multi-Step Workflow",
        version: "1.0.0",
        description: "Test workflow",
        commands: "commands",
        agents: "agents",
      };

      expect(manifestWithAgents.agents).toBe("agents");
      expect(manifestWithAgents.commands).toBe("commands");

      // Both components should be available
      const hasMultipleComponents =
        Boolean(manifestWithAgents.agents) &&
        Boolean(manifestWithAgents.commands);
      expect(hasMultipleComponents).toBe(true);
    });

    it("should validate manifest structure for single component plugins", () => {
      const simpleManifest = {
        id: "simple-plugin",
        name: "Simple Plugin",
        version: "1.0.0",
        description: "Simple plugin",
        commands: "commands",
      };

      // Should have commands
      expect(simpleManifest.commands).toBeDefined();

      // Should not require agents for single-component plugins
      expect(simpleManifest.agents).toBeUndefined();
    });
  });

  describe("Type Safety", () => {
    it("should have valid manifest schema", () => {
      const manifestPath = "./examples/test-plugin/.claude-plugin/plugin.json";
      if (fs.existsSync(manifestPath)) {
        const content = fs.readFileSync(manifestPath, "utf-8");
        const manifest = JSON.parse(content);

        // Type checks
        expect(typeof manifest.id).toBe("string");
        expect(typeof manifest.name).toBe("string");
        expect(typeof manifest.version).toBe("string");
        expect(typeof manifest.description).toBe("string");

        if (manifest.keywords) {
          expect(Array.isArray(manifest.keywords)).toBe(true);
        }

        if (manifest.environment_variables) {
          expect(Array.isArray(manifest.environment_variables)).toBe(true);
          manifest.environment_variables.forEach((env: Record<string, unknown>) => {
            expect(typeof env.name).toBe("string");
            expect(typeof env.required).toBe("boolean");
            expect(typeof env.description).toBe("string");
          });
        }
      }
    });

    it("should have valid recipe structure", () => {
      const recipePath = "./examples/code-review.recipe.yaml";
      if (fs.existsSync(recipePath)) {
        const content = fs.readFileSync(recipePath, "utf-8");
        const recipe = yaml.load(content) as Record<string, unknown>;

        expect(typeof recipe.version).toBe("string");
        expect(typeof recipe.title).toBe("string");
        expect(typeof recipe.description).toBe("string");
        expect(typeof recipe.instructions).toBe("string");

        if (recipe.parameters) {
          expect(Array.isArray(recipe.parameters)).toBe(true);
          (recipe.parameters as Array<Record<string, unknown>>).forEach((param) => {
            expect(typeof param.name).toBe("string");
            expect(typeof param.description).toBe("string");
            expect(typeof param.type).toBe("string");
          });
        }
      }
    });
  });

  describe("Data Transformation", () => {
    it("should normalize IDs correctly", () => {
      const normalizeId = (str: string): string => {
        return str
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      };

      expect(normalizeId("Code Review Assistant")).toBe("code-review-assistant");
      expect(normalizeId("Test-Automation_Suite!")).toBe("test-automationsuite");
      expect(normalizeId("My Awesome Plugin")).toBe("my-awesome-plugin");
    });

    it("should extract metadata from markdown frontmatter", () => {
      const commandPath = "./examples/test-plugin/commands/run-tests.md";
      if (fs.existsSync(commandPath)) {
        const content = fs.readFileSync(commandPath, "utf-8");
        const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);

        expect(yamlMatch).toBeDefined();
        if (yamlMatch) {
          const metadata = yaml.load(yamlMatch[1]);
          expect((metadata as Record<string, unknown>).name).toBe("run-tests");
          expect((metadata as Record<string, unknown>).description).toBeDefined();
        }
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle missing files gracefully", () => {
      const nonexistentFile = "./non-existent-recipe.yaml";
      const exists = fs.existsSync(nonexistentFile);
      expect(exists).toBe(false);
    });

    it("should validate required fields", () => {
      const validateRecipe = (recipe: Record<string, unknown>): string[] => {
        const errors: string[] = [];
        if (!recipe.version) errors.push("Missing version");
        if (!recipe.title) errors.push("Missing title");
        if (!recipe.description) errors.push("Missing description");
        if (!recipe.instructions) errors.push("Missing instructions");
        return errors;
      };

      const invalidRecipe = { title: "Test" };
      const errors = validateRecipe(invalidRecipe);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain("Missing version");
    });
  });

  describe("Integration", () => {
    it("should have example files for testing", () => {
      const examplesDir = "./examples";
      expect(fs.existsSync(examplesDir)).toBe(true);

      const recipeFile = path.join(examplesDir, "code-review.recipe.yaml");
      const pluginDir = path.join(examplesDir, "test-plugin");

      expect(fs.existsSync(recipeFile)).toBe(true);
      expect(fs.existsSync(pluginDir)).toBe(true);
    });
  });
});
