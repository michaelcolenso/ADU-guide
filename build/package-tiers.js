#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const DIST_GUIDE_ROOT = path.join("dist", "guide", "chapters");
const DIST_TOOLS_ROOT = path.join("dist", "tools");
const DIST_TIERS_ROOT = path.join("dist", "tiers");

const FOUNDATION_CHAPTERS = [
  "front-matter/cover.md",
  "front-matter/how-to-use-this-guide.md",
  "part-1-should-you-build/ch01-adu-landscape.md",
  "part-1-should-you-build/ch02-feasibility-assessment.md",
  "part-1-should-you-build/ch03-financial-case.md",
  "part-2-design-and-planning/ch04-design-fundamentals.md",
  "part-2-design-and-planning/ch05-state-regulations.md",
  "appendices/glossary.md",
  "appendices/resource-directory.md",
];

const BUILDER_CHAPTERS = [
  ...FOUNDATION_CHAPTERS,
  "front-matter/about-the-author.md",
  "part-3-financing/ch06-financing-options.md",
  "part-4-building/ch07-contractor-selection.md",
  "part-4-building/ch08-permit-process.md",
  "part-4-building/ch09-construction-management.md",
  "part-4-building/ch10-budgeting-cost-control.md",
  "appendices/state-regulation-index.md",
];

const COMPLETE_CHAPTERS = [
  ...BUILDER_CHAPTERS,
  "part-5-after-construction/ch11-inspections-closeout.md",
  "part-5-after-construction/ch12-monetizing-your-adu.md",
];

const TIERS = [
  {
    name: "foundation",
    chapters: FOUNDATION_CHAPTERS,
    includeToolCategories: ["checklists", "tools"],
    requiredToolCategories: ["checklists", "tools"],
  },
  {
    name: "builder",
    chapters: BUILDER_CHAPTERS,
    includeToolCategories: ["checklists", "templates", "tools"],
    requiredToolCategories: ["checklists", "templates", "tools"],
  },
  {
    name: "complete",
    chapters: COMPLETE_CHAPTERS,
    includeToolCategories: ["checklists", "templates", "tools"],
    requiredToolCategories: ["checklists", "templates", "tools"],
  },
];

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function isDirectory(targetPath) {
  try {
    return fs.statSync(targetPath).isDirectory();
  } catch {
    return false;
  }
}

function isFile(targetPath) {
  try {
    return fs.statSync(targetPath).isFile();
  } catch {
    return false;
  }
}

function listFilesRecursively(rootDir) {
  const files = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function parseArgs() {
  const args = process.argv.slice(2);
  let requestedTier = null;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--tier") {
      if (i + 1 >= args.length || !args[i + 1] || args[i + 1].startsWith("--")) {
        throw new Error(
          `Missing value for --tier. Expected one of: ${TIERS.map((tier) => tier.name).join(", ")}`,
        );
      }
      requestedTier = args[i + 1].trim();
      if (!requestedTier) {
        throw new Error(
          `Missing value for --tier. Expected one of: ${TIERS.map((tier) => tier.name).join(", ")}`,
        );
      }
      i += 1;
      continue;
    }
    if (arg.startsWith("--tier=")) {
      requestedTier = arg.slice("--tier=".length).trim();
      if (!requestedTier) {
        throw new Error(
          `Missing value for --tier. Expected one of: ${TIERS.map((tier) => tier.name).join(", ")}`,
        );
      }
    }
  }

  return requestedTier;
}

function validateInputs(repoRoot, tiersToBuild) {
  const guideRoot = path.join(repoRoot, DIST_GUIDE_ROOT);
  const toolsRoot = path.join(repoRoot, DIST_TOOLS_ROOT);

  if (!isDirectory(guideRoot)) {
    throw new Error("Missing dist/guide/chapters. Run `npm run build:guide` first.");
  }
  if (!isDirectory(toolsRoot)) {
    throw new Error("Missing dist/tools. Run `npm run build:tools` first.");
  }

  const allRequiredChapters = new Set(tiersToBuild.flatMap((tier) => tier.chapters));
  const missingChapters = [];

  for (const chapter of allRequiredChapters) {
    const chapterPath = path.join(guideRoot, chapter);
    if (!isFile(chapterPath)) {
      missingChapters.push(`dist/guide/chapters/${chapter}`);
    }
  }

  if (missingChapters.length > 0) {
    console.error("[build:tiers] Missing required compiled guide chapters:");
    for (const item of missingChapters) {
      console.error(`  - ${item}`);
    }
    process.exit(1);
  }
}

function buildTier(repoRoot, tier) {
  const tierRoot = path.join(repoRoot, DIST_TIERS_ROOT, tier.name);
  const tierGuideRoot = path.join(tierRoot, "guide");
  const tierToolsRoot = path.join(tierRoot, "tools");
  fs.mkdirSync(tierGuideRoot, { recursive: true });
  fs.mkdirSync(tierToolsRoot, { recursive: true });

  const compiledGuideParts = [];
  const guideOutputs = [];

  for (const chapter of tier.chapters) {
    const sourcePath = path.join(repoRoot, DIST_GUIDE_ROOT, chapter);
    const destinationPath = path.join(tierGuideRoot, chapter);
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.copyFileSync(sourcePath, destinationPath);

    const content = fs.readFileSync(sourcePath, "utf8").trimEnd();
    compiledGuideParts.push(`<!-- source: dist/guide/chapters/${chapter} -->\n\n${content}`);
    guideOutputs.push(`dist/tiers/${tier.name}/guide/${toPosixPath(chapter)}`);
  }

  const combinedGuide = `${compiledGuideParts.join("\n\n---\n\n")}\n`;
  fs.writeFileSync(path.join(tierRoot, "guide.md"), combinedGuide, "utf8");

  const copiedToolFiles = [];
  const toolCounts = {};

  for (const category of tier.includeToolCategories) {
    const sourceCategoryRoot = path.join(repoRoot, DIST_TOOLS_ROOT, category);
    if (!isDirectory(sourceCategoryRoot)) {
      if (tier.requiredToolCategories.includes(category)) {
        throw new Error(
          `Tier "${tier.name}" requires dist/tools/${category}, but it does not exist.`,
        );
      }
      continue;
    }

    const categoryFiles = listFilesRecursively(sourceCategoryRoot);
    if (categoryFiles.length === 0 && tier.requiredToolCategories.includes(category)) {
      throw new Error(
        `Tier "${tier.name}" requires at least one file in dist/tools/${category}.`,
      );
    }

    for (const filePath of categoryFiles) {
      const relativeWithinCategory = path.relative(sourceCategoryRoot, filePath);
      const destinationPath = path.join(tierToolsRoot, category, relativeWithinCategory);
      fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
      fs.copyFileSync(filePath, destinationPath);
      copiedToolFiles.push(
        `dist/tiers/${tier.name}/tools/${toPosixPath(path.join(category, relativeWithinCategory))}`,
      );
    }
    toolCounts[category] = categoryFiles.length;
  }

  const tierManifest = {
    tier: tier.name,
    generatedAt: new Date().toISOString(),
    chapters: tier.chapters.map((chapter) => `dist/guide/chapters/${chapter}`),
    chapterCount: tier.chapters.length,
    toolCategories: tier.includeToolCategories,
    toolCounts,
    toolFileCount: copiedToolFiles.length,
    outputs: [
      `dist/tiers/${tier.name}/guide.md`,
      ...guideOutputs,
      ...copiedToolFiles,
      `dist/tiers/${tier.name}/manifest.json`,
    ],
  };

  writeJson(path.join(tierRoot, "manifest.json"), tierManifest);
  return tierManifest;
}

function main() {
  const repoRoot = process.cwd();
  const requestedTier = parseArgs();
  const tiersToBuild = requestedTier
    ? TIERS.filter((tier) => tier.name === requestedTier)
    : TIERS;

  if (requestedTier && tiersToBuild.length === 0) {
    throw new Error(
      `Unknown tier "${requestedTier}". Expected one of: ${TIERS.map((tier) => tier.name).join(", ")}`,
    );
  }

  validateInputs(repoRoot, tiersToBuild);

  const tiersRoot = path.join(repoRoot, DIST_TIERS_ROOT);
  fs.rmSync(tiersRoot, { recursive: true, force: true });
  fs.mkdirSync(tiersRoot, { recursive: true });

  const summaries = [];
  for (const tier of tiersToBuild) {
    summaries.push(buildTier(repoRoot, tier));
  }

  const summaryManifest = {
    generatedAt: new Date().toISOString(),
    tiers: summaries.map((item) => ({
      tier: item.tier,
      chapterCount: item.chapterCount,
      toolFileCount: item.toolFileCount,
      manifest: `dist/tiers/${item.tier}/manifest.json`,
    })),
    outputs: [...tiersToBuild.map((tier) => `dist/tiers/${tier.name}/**`), "dist/tiers/manifest.json"],
  };
  writeJson(path.join(tiersRoot, "manifest.json"), summaryManifest);

  console.log(`[build:tiers] Built tiers: ${tiersToBuild.map((tier) => tier.name).join(", ")}.`);
}

try {
  main();
} catch (error) {
  console.error(`[build:tiers] ${error.message}`);
  process.exit(1);
}
