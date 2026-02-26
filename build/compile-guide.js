#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const GUIDE_ROOT = "guide";
const DIST_ROOT = path.join("dist", "guide");

const EXPECTED_CHAPTERS = [
  "front-matter/cover.md",
  "front-matter/how-to-use-this-guide.md",
  "front-matter/about-the-author.md",
  "part-1-should-you-build/ch01-adu-landscape.md",
  "part-1-should-you-build/ch02-feasibility-assessment.md",
  "part-1-should-you-build/ch03-financial-case.md",
  "part-2-design-and-planning/ch04-design-fundamentals.md",
  "part-2-design-and-planning/ch05-state-regulations.md",
  "part-3-financing/ch06-financing-options.md",
  "part-4-building/ch07-contractor-selection.md",
  "part-4-building/ch08-permit-process.md",
  "part-4-building/ch09-construction-management.md",
  "part-4-building/ch10-budgeting-cost-control.md",
  "part-5-after-construction/ch11-inspections-closeout.md",
  "part-5-after-construction/ch12-monetizing-your-adu.md",
  "appendices/resource-directory.md",
  "appendices/glossary.md",
  "appendices/state-regulation-index.md",
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

function listMarkdownFilesRecursively(rootDir) {
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
      if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function countWords(content) {
  const matches = content.match(/\b[\w'-]+\b/g);
  return matches ? matches.length : 0;
}

function extractTitle(content, fallbackPath) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  return path.basename(fallbackPath, ".md");
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function failWithList(message, items) {
  console.error(`[build:guide] ${message}`);
  for (const item of items) {
    console.error(`  - ${item}`);
  }
  process.exit(1);
}

function main() {
  const repoRoot = process.cwd();
  const guideRoot = path.join(repoRoot, GUIDE_ROOT);

  if (!isDirectory(guideRoot)) {
    throw new Error(`Missing required directory: ${GUIDE_ROOT}`);
  }

  const missingExpected = EXPECTED_CHAPTERS.filter(
    (relativePath) => !isFile(path.join(guideRoot, relativePath)),
  );
  if (missingExpected.length > 0) {
    failWithList("Missing expected guide chapters:", missingExpected);
  }

  const discoveredMarkdown = listMarkdownFilesRecursively(guideRoot).map((absPath) =>
    toPosixPath(path.relative(guideRoot, absPath)),
  );
  const extraMarkdown = discoveredMarkdown.filter(
    (relativePath) => !EXPECTED_CHAPTERS.includes(relativePath),
  );
  const orderedChapters = [...EXPECTED_CHAPTERS, ...extraMarkdown.sort((a, b) => a.localeCompare(b))];

  const guideDistRoot = path.join(repoRoot, DIST_ROOT);
  const chapterDistRoot = path.join(guideDistRoot, "chapters");
  fs.rmSync(guideDistRoot, { recursive: true, force: true });
  fs.mkdirSync(chapterDistRoot, { recursive: true });

  const compiledParts = [];
  const chapterManifest = [];
  const tocLines = ["# Guide Table of Contents", ""];

  for (const relativePath of orderedChapters) {
    const sourcePath = path.join(guideRoot, relativePath);
    const outputPath = path.join(chapterDistRoot, relativePath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.copyFileSync(sourcePath, outputPath);

    const raw = fs.readFileSync(sourcePath, "utf8");
    const normalized = raw.trimEnd();
    const title = extractTitle(normalized, relativePath);
    const bytes = Buffer.byteLength(raw, "utf8");
    const words = countWords(raw);

    compiledParts.push(`<!-- source: guide/${relativePath} -->\n\n${normalized}`);
    tocLines.push(`- ${title} (\`guide/${relativePath}\`)`);
    chapterManifest.push({
      source: `guide/${toPosixPath(relativePath)}`,
      output: `dist/guide/chapters/${toPosixPath(relativePath)}`,
      title,
      words,
      bytes,
    });
  }

  const compiledGuide = `${compiledParts.join("\n\n---\n\n")}\n`;
  fs.writeFileSync(path.join(guideDistRoot, "complete-guide.md"), compiledGuide, "utf8");
  fs.writeFileSync(path.join(guideDistRoot, "toc.md"), `${tocLines.join("\n")}\n`, "utf8");

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceRoot: GUIDE_ROOT,
    totalChapters: orderedChapters.length,
    expectedChapters: EXPECTED_CHAPTERS.length,
    extraChapters: extraMarkdown.length,
    files: chapterManifest,
    outputs: [
      "dist/guide/complete-guide.md",
      "dist/guide/toc.md",
      "dist/guide/chapters/**",
      "dist/guide/manifest.json",
    ],
  };
  writeJson(path.join(guideDistRoot, "manifest.json"), manifest);

  console.log(
    `[build:guide] Wrote ${orderedChapters.length} chapters to dist/guide (extras: ${extraMarkdown.length}).`,
  );
}

try {
  main();
} catch (error) {
  console.error(`[build:guide] ${error.message}`);
  process.exit(1);
}
