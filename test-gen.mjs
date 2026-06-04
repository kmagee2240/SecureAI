#!/usr/bin/env node
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { glob } from "glob";
import chalk from "chalk";
import ora from "ora";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert JavaScript/TypeScript test engineer. 
Given source code, generate comprehensive Jest tests that cover:
- Happy path (expected behavior)
- Edge cases (empty inputs, null, undefined, boundary values)
- Error cases (invalid inputs, thrown errors)
- Any async behavior

Rules:
- Use Jest syntax (describe, it/test, expect, beforeEach, afterEach)
- Use jest.fn() for mocking dependencies
- Import the module using the correct relative path (use PLACEHOLDER_PATH as the import path)
- Write clear test descriptions
- Do NOT include markdown code fences or explanations — output raw test code only
- Ensure tests are runnable and self-contained`;

async function generateTests(sourceCode, filePath) {
  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate Jest tests for this file (${path.basename(filePath)}):\n\n${sourceCode}`,
      },
    ],
  });

  return response.content[0].text;
}

function getTestOutputPath(sourcePath, outputDir) {
  const dir = outputDir || path.dirname(sourcePath);
  const base = path.basename(sourcePath, path.extname(sourcePath));
  const ext = sourcePath.endsWith(".ts") ? ".test.ts" : ".test.js";
  return path.join(dir, `${base}${ext}`);
}

function fixImportPath(testCode, sourcePath, testOutputPath) {
  const relPath = path.relative(path.dirname(testOutputPath), sourcePath);
  const importPath = relPath.startsWith(".") ? relPath : `./${relPath}`;
  const withoutExt = importPath.replace(/\.(ts|js|tsx|jsx)$/, "");
  return testCode.replace(/PLACEHOLDER_PATH/g, withoutExt);
}

async function processFile(filePath, options) {
  const spinner = ora(`Generating tests for ${chalk.cyan(path.basename(filePath))}`).start();

  try {
    const sourceCode = fs.readFileSync(filePath, "utf-8");

    if (sourceCode.trim().length === 0) {
      spinner.warn(`Skipping empty file: ${filePath}`);
      return;
    }

    const testCode = await generateTests(sourceCode, filePath);
    const testOutputPath = getTestOutputPath(filePath, options.outDir);
    const fixedTestCode = fixImportPath(testCode, filePath, testOutputPath);

    if (!options.dryRun) {
      fs.mkdirSync(path.dirname(testOutputPath), { recursive: true });
      fs.writeFileSync(testOutputPath, fixedTestCode);
      spinner.succeed(`${chalk.green("✓")} ${chalk.cyan(path.basename(filePath))} → ${chalk.gray(testOutputPath)}`);
    } else {
      spinner.succeed(`${chalk.yellow("[dry-run]")} Would write → ${chalk.gray(testOutputPath)}`);
      console.log(chalk.gray("─".repeat(60)));
      console.log(fixedTestCode);
      console.log(chalk.gray("─".repeat(60)));
    }
  } catch (err) {
    spinner.fail(`Failed: ${filePath} — ${err.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    console.log(`
${chalk.bold("test-gen")} — AI-powered Jest test generator

${chalk.bold("Usage:")}
  node test-gen.mjs <file-or-glob> [options]

${chalk.bold("Options:")}
  --out-dir <dir>   Write tests to a specific directory (default: same as source)
  --dry-run         Print tests without writing files
  --help            Show this help

${chalk.bold("Examples:")}
  node test-gen.mjs src/utils.js
  node test-gen.mjs src/**/*.ts --out-dir __tests__
  node test-gen.mjs src/api.ts --dry-run
`);
    process.exit(0);
  }

  const options = {
    outDir: null,
    dryRun: false,
  };

  const patterns = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--out-dir" && args[i + 1]) {
      options.outDir = args[++i];
    } else if (args[i] === "--dry-run") {
      options.dryRun = true;
    } else {
      patterns.push(args[i]);
    }
  }

  // Resolve files from patterns
  let files = [];
  for (const pattern of patterns) {
    if (fs.existsSync(pattern) && fs.statSync(pattern).isFile()) {
      files.push(pattern);
    } else {
      const matched = await glob(pattern, { ignore: ["**/*.test.*", "**/*.spec.*", "**/node_modules/**"] });
      files.push(...matched);
    }
  }

  // Filter out test files
  files = [...new Set(files)].filter(
    (f) => !f.includes(".test.") && !f.includes(".spec.")
  );

  if (files.length === 0) {
    console.log(chalk.yellow("No matching source files found."));
    process.exit(1);
  }

  console.log(`\n${chalk.bold("test-gen")} — generating tests for ${chalk.cyan(files.length)} file(s)\n`);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(chalk.red("Error: ANTHROPIC_API_KEY environment variable is not set."));
    process.exit(1);
  }

  for (const file of files) {
    await processFile(file, options);
  }

  console.log(`\n${chalk.green("Done!")}\n`);
}

main().catch((err) => {
  console.error(chalk.red("Fatal error:"), err.message);
  process.exit(1);
});
