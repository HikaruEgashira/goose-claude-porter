#!/usr/bin/env bun
/**
 * Batch Converter - Convert multiple Goose recipes and Claude skills
 * Handles conversion of real-world repositories
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import { spawnSync } from "child_process";

interface ConversionResult {
  source: string;
  target: string;
  status: "success" | "error" | "skipped";
  message: string;
  time: number;
}

interface ConversionStats {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  results: ConversionResult[];
}

// Batch conversion for Goose recipes
async function batchConvertRecipes(
  sourceDir: string,
  outputDir: string
): Promise<ConversionStats> {
  const stats: ConversionStats = {
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    results: [],
  };

  // Find all recipe files
  const recipeFiles = findFiles(sourceDir, [".yaml", ".yml"]);

  console.log(`\n📋 Found ${recipeFiles.length} recipe files\n`);

  for (const recipeFile of recipeFiles) {
    const startTime = Date.now();
    stats.total++;

    try {
      // Read and validate recipe
      const content = fs.readFileSync(recipeFile, "utf-8");
      const recipe = yaml.load(content);

      if (!recipe || typeof recipe !== "object") {
        stats.skipped++;
        stats.results.push({
          source: recipeFile,
          target: "",
          status: "skipped",
          message: "Invalid recipe format",
          time: Date.now() - startTime,
        });
        console.log(`⏭️  SKIP: ${path.basename(recipeFile)}`);
        continue;
      }

      const recipeObj = recipe as Record<string, unknown>;
      if (!recipeObj.title || !recipeObj.description) {
        stats.skipped++;
        stats.results.push({
          source: recipeFile,
          target: "",
          status: "skipped",
          message: "Missing required fields",
          time: Date.now() - startTime,
        });
        console.log(`⏭️  SKIP: ${path.basename(recipeFile)} (missing fields)`);
        continue;
      }

      // Run porter conversion
      const result = spawnSync("bun", [
        "porter.ts",
        "recipe-to-plugin",
        recipeFile,
        outputDir,
      ]);

      if (result.status === 0) {
        stats.successful++;
        stats.results.push({
          source: recipeFile,
          target: path.join(
            outputDir,
            normalizeId(recipeObj.title as string)
          ),
          status: "success",
          message: `Converted: ${recipeObj.title}`,
          time: Date.now() - startTime,
        });
        console.log(`✅ OK: ${path.basename(recipeFile)}`);
      } else {
        stats.failed++;
        stats.results.push({
          source: recipeFile,
          target: "",
          status: "error",
          message: result.stderr?.toString() || "Unknown error",
          time: Date.now() - startTime,
        });
        console.log(`❌ ERROR: ${path.basename(recipeFile)}`);
      }
    } catch (error) {
      stats.failed++;
      stats.results.push({
        source: recipeFile,
        target: "",
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        time: Date.now() - startTime,
      });
      console.log(`❌ ERROR: ${path.basename(recipeFile)}`);
    }
  }

  return stats;
}

// Batch conversion for Claude skills to plugins
async function batchConvertSkills(
  sourceDir: string,
  outputDir: string
): Promise<ConversionStats> {
  const stats: ConversionStats = {
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    results: [],
  };

  // Find all skill directories
  const skillDirs = findSkillDirs(sourceDir);

  console.log(`\n🎯 Found ${skillDirs.length} skill directories\n`);

  for (const skillDir of skillDirs) {
    const startTime = Date.now();
    stats.total++;

    try {
      const skillMdFile = path.join(skillDir, "SKILL.md");
      if (!fs.existsSync(skillMdFile)) {
        stats.skipped++;
        stats.results.push({
          source: skillDir,
          target: "",
          status: "skipped",
          message: "SKILL.md not found",
          time: Date.now() - startTime,
        });
        console.log(`⏭️  SKIP: ${path.basename(skillDir)}`);
        continue;
      }

      // Convert skill to recipe format
      const skillName = path.basename(skillDir);
      const recipeContent = convertSkillToRecipe(skillMdFile, skillName);

      // Save as YAML recipe
      const recipePath = path.join(outputDir, `${skillName}.yaml`);
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(recipePath, recipeContent);

      stats.successful++;
      stats.results.push({
        source: skillDir,
        target: recipePath,
        status: "success",
        message: `Converted skill to recipe: ${skillName}`,
        time: Date.now() - startTime,
      });
      console.log(`✅ OK: ${skillName}`);
    } catch (error) {
      stats.failed++;
      stats.results.push({
        source: skillDir,
        target: "",
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        time: Date.now() - startTime,
      });
      console.log(`❌ ERROR: ${path.basename(skillDir)}`);
    }
  }

  return stats;
}

// Helper functions
function normalizeId(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function findFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
    try {
      const entries = fs.readdirSync(currentDir);
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (
          stat.isFile() &&
          extensions.some((ext) => entry.endsWith(ext))
        ) {
          files.push(fullPath);
        }
      }
    } catch {
      // Skip inaccessible directories
    }
  }

  traverse(dir);
  return files;
}

function findSkillDirs(dir: string): string[] {
  const skillDirs: string[] = [];

  function traverse(currentDir: string) {
    try {
      const entries = fs.readdirSync(currentDir);
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Check if this directory contains SKILL.md
          if (fs.existsSync(path.join(fullPath, "SKILL.md"))) {
            skillDirs.push(fullPath);
          }
          traverse(fullPath);
        }
      }
    } catch {
      // Skip inaccessible directories
    }
  }

  traverse(dir);
  return skillDirs;
}

function convertSkillToRecipe(skillMdPath: string, skillName: string): string {
  const content = fs.readFileSync(skillMdPath, "utf-8");

  // Extract metadata from frontmatter
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
  let metadata: Record<string, unknown> = {};

  if (yamlMatch) {
    try {
      metadata = (yaml.load(yamlMatch[1]) as Record<string, unknown>) || {};
    } catch {
      // Continue with empty metadata
    }
  }

  // Extract body
  const body = content.replace(/^---\n[\s\S]*?\n---\n/, "");

  // Create recipe structure
  const recipe = {
    version: "1.0.0",
    title: (metadata.name as string) || skillName,
    description:
      (metadata.description as string) ||
      `Converted from Claude Code skill: ${skillName}`,
    instructions: body,
    prompt: `Apply the ${skillName} skill to the current task.`,
  };

  return yaml.dump(recipe, { lineWidth: -1 });
}

function printStats(
  label: string,
  stats: ConversionStats,
  duration: number
): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📊 ${label} Results`);
  console.log(`${"=".repeat(60)}`);
  console.log(`Total:      ${stats.total}`);
  console.log(`✅ Success: ${stats.successful}`);
  console.log(`❌ Failed:  ${stats.failed}`);
  console.log(`⏭️  Skipped: ${stats.skipped}`);
  console.log(`⏱️  Time:    ${(duration / 1000).toFixed(2)}s`);
  console.log(`${"=".repeat(60)}\n`);
}

async function main() {
  console.log("\n🚀 Batch Conversion: Real-World Repositories\n");

  const gooseRecipesDir = "/tmp/goose/documentation/src/pages/recipes/data/recipes";
  const skillsDir = "/tmp/skills";

  const outputPluginsDir = "./converted-plugins";
  const outputRecipesDir = "./converted-recipes";

  // Check if source directories exist
  if (!fs.existsSync(gooseRecipesDir)) {
    console.error(`❌ Goose recipes directory not found: ${gooseRecipesDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(skillsDir)) {
    console.error(`❌ Skills directory not found: ${skillsDir}`);
    process.exit(1);
  }

  console.log("📂 Source Directories:");
  console.log(`   Goose Recipes: ${gooseRecipesDir}`);
  console.log(`   Skills:        ${skillsDir}`);
  console.log(`\n📁 Output Directories:`);
  console.log(`   Plugins: ${outputPluginsDir}`);
  console.log(`   Recipes: ${outputRecipesDir}`);

  // Create output directories
  fs.mkdirSync(outputPluginsDir, { recursive: true });
  fs.mkdirSync(outputRecipesDir, { recursive: true });

  // Convert Goose recipes to plugins
  console.log("\n" + "=".repeat(60));
  console.log("🔄 Converting Goose Recipes → Claude Code Plugins");
  console.log("=".repeat(60));

  const recipeStart = Date.now();
  const recipeStats = await batchConvertRecipes(
    gooseRecipesDir,
    outputPluginsDir
  );
  const recipeDuration = Date.now() - recipeStart;
  printStats("Goose Recipes", recipeStats, recipeDuration);

  // Convert Claude Skills to Recipes
  console.log("\n" + "=".repeat(60));
  console.log("🔄 Converting Claude Skills → Goose Recipes");
  console.log("=".repeat(60));

  const skillStart = Date.now();
  const skillStats = await batchConvertSkills(skillsDir, outputRecipesDir);
  const skillDuration = Date.now() - skillStart;
  printStats("Claude Skills", skillStats, skillDuration);

  // Generate summary report
  const totalDuration = recipeDuration + skillDuration;
  console.log(`\n📈 Overall Summary`);
  console.log(`${"=".repeat(60)}`);
  console.log(`Total Items:  ${recipeStats.total + skillStats.total}`);
  console.log(`Converted:    ${recipeStats.successful + skillStats.successful}`);
  console.log(`Errors:       ${recipeStats.failed + skillStats.failed}`);
  console.log(`Skipped:      ${recipeStats.skipped + skillStats.skipped}`);
  console.log(`Total Time:   ${(totalDuration / 1000).toFixed(2)}s`);
  console.log(`${"=".repeat(60)}\n`);

  // Save detailed report
  const reportPath = "./conversion-report.json";
  const report = {
    timestamp: new Date().toISOString(),
    sources: {
      gooseRecipes: gooseRecipesDir,
      skills: skillsDir,
    },
    outputs: {
      plugins: outputPluginsDir,
      recipes: outputRecipesDir,
    },
    summary: {
      recipes: recipeStats,
      skills: skillStats,
    },
    statistics: {
      totalDuration: totalDuration / 1000,
      totalItems: recipeStats.total + skillStats.total,
      successRate:
        ((recipeStats.successful + skillStats.successful) /
          (recipeStats.total + skillStats.total)) *
        100,
    },
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`✅ Report saved: ${reportPath}\n`);

  // Print success/failure details
  if (recipeStats.failed > 0 || skillStats.failed > 0) {
    console.log(`⚠️  Failed Conversions:\n`);
    for (const result of [...recipeStats.results, ...skillStats.results]) {
      if (result.status === "error") {
        console.log(`  ❌ ${path.basename(result.source)}`);
        console.log(`     ${result.message}\n`);
      }
    }
  }

  // Exit with appropriate code
  if (
    recipeStats.failed > 0 ||
    skillStats.failed > 0 ||
    (recipeStats.successful === 0 && skillStats.successful === 0)
  ) {
    console.log(`\n⚠️  Some conversions failed or were skipped`);
    process.exit(1);
  } else {
    console.log(`\n✅ Batch conversion completed successfully!`);
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
