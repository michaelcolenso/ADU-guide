#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const TOOLS_ROOT = "tools";
const DIST_ROOT = path.join("dist", "tools");

const CATEGORIES = ["tools", "templates", "checklists"];

const REQUIRED_SOURCE_FILES = [
  {
    source: "quality/review-checklist.md",
    category: "checklists",
    outputName: "quality-review-checklist.md",
  },
  {
    source: "marketing/lead-magnet/adu-feasibility-checklist.md",
    category: "checklists",
    outputName: "adu-feasibility-checklist.md",
  },
  {
    source: "regulations/_template.md",
    category: "templates",
    outputName: "state-regulation-template.md",
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
        continue;
      }
      if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function classifyToolPath(relativePath) {
  const normalized = toPosixPath(relativePath);

  if (normalized.startsWith("templates/")) {
    return {
      category: "templates",
      outputRelativePath: normalized.slice("templates/".length),
    };
  }
  if (normalized.startsWith("checklists/")) {
    return {
      category: "checklists",
      outputRelativePath: normalized.slice("checklists/".length),
    };
  }

  return {
    category: "tools",
    outputRelativePath: normalized,
  };
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function copyFileWithTracking({
  sourcePath,
  destinationPath,
  category,
  sourceLabel,
  manifestEntries,
  categoryCounts,
  seenOutputs,
}) {
  const normalizedDestination = toPosixPath(destinationPath);
  if (seenOutputs.has(normalizedDestination)) {
    throw new Error(`Duplicate output path detected: ${normalizedDestination}`);
  }
  seenOutputs.add(normalizedDestination);

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);

  const sizeBytes = fs.statSync(destinationPath).size;
  manifestEntries.push({
    category,
    source: sourceLabel,
    output: toPosixPath(path.relative(process.cwd(), destinationPath)),
    bytes: sizeBytes,
  });
  categoryCounts[category] += 1;
}

function main() {
  const repoRoot = process.cwd();
  const toolsRoot = path.join(repoRoot, TOOLS_ROOT);
  const distRoot = path.join(repoRoot, DIST_ROOT);

  if (!isDirectory(toolsRoot)) {
    throw new Error(`Missing required directory: ${TOOLS_ROOT}`);
  }

  const missingRequiredFiles = REQUIRED_SOURCE_FILES.filter(
    (item) => !isFile(path.join(repoRoot, item.source)),
  ).map((item) => item.source);
  if (missingRequiredFiles.length > 0) {
    console.error("[build:tools] Missing required source files:");
    for (const filePath of missingRequiredFiles) {
      console.error(`  - ${filePath}`);
    }
    process.exit(1);
  }

  fs.rmSync(distRoot, { recursive: true, force: true });
  for (const category of CATEGORIES) {
    fs.mkdirSync(path.join(distRoot, category), { recursive: true });
  }

  const manifestEntries = [];
  const seenOutputs = new Set();
  const categoryCounts = {
    tools: 0,
    templates: 0,
    checklists: 0,
  };

  const repoToolFiles = listFilesRecursively(toolsRoot);
  for (const sourcePath of repoToolFiles) {
    const relativePath = path.relative(toolsRoot, sourcePath);
    const { category, outputRelativePath } = classifyToolPath(relativePath);

    if (!outputRelativePath) {
      continue;
    }

    const destinationPath = path.join(distRoot, category, outputRelativePath);
    copyFileWithTracking({
      sourcePath,
      destinationPath,
      category,
      sourceLabel: `tools/${toPosixPath(relativePath)}`,
      manifestEntries,
      categoryCounts,
      seenOutputs,
    });
  }

  for (const item of REQUIRED_SOURCE_FILES) {
    const sourcePath = path.join(repoRoot, item.source);
    const destinationPath = path.join(distRoot, item.category, item.outputName);
    copyFileWithTracking({
      sourcePath,
      destinationPath,
      category: item.category,
      sourceLabel: item.source,
      manifestEntries,
      categoryCounts,
      seenOutputs,
    });
  }

  if (categoryCounts.checklists === 0) {
    throw new Error("No checklist files were collected into dist/tools/checklists.");
  }
  if (categoryCounts.templates === 0) {
    throw new Error("No template files were collected into dist/tools/templates.");
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceRoots: [TOOLS_ROOT, "quality", "marketing/lead-magnet", "regulations"],
    totals: {
      files: manifestEntries.length,
      tools: categoryCounts.tools,
      templates: categoryCounts.templates,
      checklists: categoryCounts.checklists,
    },
    files: manifestEntries,
    outputs: [
      "dist/tools/tools/**",
      "dist/tools/templates/**",
      "dist/tools/checklists/**",
      "dist/tools/manifest.json",
    ],
  };
  writeJson(path.join(distRoot, "manifest.json"), manifest);

  const maybeToolsNotice =
    categoryCounts.tools === 0 ? " (no general tools found under tools/)" : "";
  console.log(
    `[build:tools] Wrote ${manifestEntries.length} files to dist/tools${maybeToolsNotice}.`,
  );
}

try {
  main();
} catch (error) {
  console.error(`[build:tools] ${error.message}`);
  process.exit(1);
}
