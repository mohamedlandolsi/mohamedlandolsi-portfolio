// Content guard. Run with: npm run check:content
// Fails when content/, app/ or components/ break a rule from the content-guard skill:
//   1. an em dash or en dash anywhere
//   2. a claim ID that is not in content/claims.json
//   3. a <Decision id> that is not in content/decisions.json
//   4. sieve counts that do not add up
//   5. a banned word, an exclamation mark in copy, or an emoji
//   6. a published case study that still contains TODO
//   7. a project metric whose value differs from its claim (claims.json is the ledger)

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const SCAN_DIRS = ["content", "app", "components"];
const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".json", ".md", ".mdx"]);

const DASHES = /[–—]/;
const EMOJI = /\p{Extended_Pictographic}/u;
const BANNED = [
  ["passionate", /\bpassionate(ly)?\b/i],
  ["seamless", /\bseamless(ly)?\b/i],
  ["cutting-edge", /\bcutting[- ]edge\b/i],
  ["leverage", /\bleverag(e|es|ed|ing)\b/i],
  ["unlock", /\bunlock(s|ed|ing)?\b/i],
  ["empower", /\bempower(s|ed|ing|ment)?\b/i],
  ["journey", /\bjourneys?\b/i],
  ["innovative", /\binnovative\b/i],
  ["synergy", /\bsynerg(y|ies)\b/i],
  ["world-class", /\bworld[- ]class\b/i],
  ["Hi, I'm", /\bHi, I['’]m\b/i],
  ["I'm a ... who loves ...", /\bI['’]m an? [^.]{0,80}? who loves\b/i],
];

const errors = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return TEXT_EXTENSIONS.has(extname(entry.name)) ? [path] : [];
  });
}

const readJson = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));

const claims = readJson("content/claims.json");
const decisions = readJson("content/decisions.json");
const projects = readJson("content/projects.json");
const claimIds = new Set(claims.map((claim) => claim.id));
const decisionIds = new Set(decisions.map((decision) => decision.id));

const files = SCAN_DIRS.flatMap((dir) => walk(join(root, dir)));

/** Prose of an MDX file: no frontmatter, no comments, no JSX tags, no inline code. */
function mdxProse(text) {
  return text
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/`[^`]*`/g, "");
}

/** All string values in a parsed JSON document. */
function jsonStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(jsonStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(jsonStrings);
  return [];
}

for (const path of files) {
  const file = relative(root, path).replaceAll("\\", "/");
  const ext = extname(path);
  const text = readFileSync(path, "utf8").replaceAll("\r\n", "\n");
  const lines = text.split("\n");

  // 1. Dashes
  lines.forEach((line, index) => {
    if (DASHES.test(line)) fail(`${file}:${index + 1}`, "contains an em dash or en dash. Use a comma, colon, period, parentheses or the word \"to\".");
  });

  // 2. Claim IDs
  const usedClaims = [
    ...[...text.matchAll(/\bclaim=["']([^"']+)["']/g)].map((match) => match[1]),
    ...[...text.matchAll(/\bclaims=["']([^"']+)["']/g)].flatMap((match) => match[1].split(",")),
    ...[...text.matchAll(/"claim"\s*:\s*"([^"]+)"/g)].map((match) => match[1]),
    ...[...text.matchAll(/"claims"\s*:\s*\[([^\]]*)\]/g)].flatMap((match) =>
      [...match[1].matchAll(/"([^"]+)"/g)].map((inner) => inner[1]),
    ),
  ].map((id) => id.trim());
  for (const id of usedClaims) {
    if (!claimIds.has(id)) fail(file, `claim "${id}" is not in content/claims.json`);
  }

  // 3. Decision IDs in MDX
  if (ext === ".mdx") {
    for (const match of text.matchAll(/<Decision\s+id=["']([^"']+)["']/g)) {
      if (!decisionIds.has(match[1])) fail(file, `decision "${match[1]}" is not in content/decisions.json`);
    }
  }

  // 5. Banned words, exclamation marks, emoji
  const inContent = file.startsWith("content/");
  const isCopySource = inContent || [".tsx", ".jsx", ".mdx"].includes(ext);
  if (isCopySource) {
    lines.forEach((line, index) => {
      for (const [word, pattern] of BANNED) {
        if (pattern.test(line)) fail(`${file}:${index + 1}`, `banned word or pattern: ${word}`);
      }
      if (EMOJI.test(line)) fail(`${file}:${index + 1}`, "contains an emoji");
    });
  }
  if (inContent && ext === ".json") {
    for (const value of jsonStrings(JSON.parse(text))) {
      if (value.includes("!")) fail(file, `exclamation mark in copy: "${value.slice(0, 60)}"`);
    }
  }
  if (ext === ".mdx") {
    mdxProse(text).split("\n").forEach((line) => {
      if (/!(?!\[)/.test(line)) fail(file, `exclamation mark in copy: "${line.trim().slice(0, 60)}"`);
    });
  }
  if (ext === ".tsx" || ext === ".jsx") {
    lines.forEach((line, index) => {
      if (/>[^<>{}=]*![^<>{}=]*</.test(line)) fail(`${file}:${index + 1}`, "exclamation mark in JSX text");
    });
  }

  // 6. Published case studies must not contain TODO
  if (file.startsWith("content/case-studies/") && ext === ".mdx") {
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
    const status = frontmatter.match(/^status:\s*(\S+)/m)?.[1];
    if (!status) fail(file, "frontmatter has no status (draft or published)");
    if (status === "published" && text.includes("TODO")) fail(file, "is published but still contains TODO");
  }
}

// 4. Sieve counts, and 7. metric values against the ledger
for (const project of projects) {
  for (const metric of project.metrics ?? []) {
    const claim = claims.find((candidate) => candidate.id === metric.claim);
    if (claim && claim.value !== metric.value) {
      fail("content/projects.json", `${project.slug} metric ${metric.claim} shows "${metric.value}" but the claim says "${claim.value}"`);
    }
  }
  if (!project.sieve) continue;
  const { input, rejected, passed, claim } = project.sieve;
  const rejectedSum = rejected.reduce((sum, bin) => sum + bin.count, 0);
  if (rejectedSum + passed.value !== input.value) {
    fail("content/projects.json", `${project.slug} sieve does not add up: ${rejectedSum} rejected + ${passed.value} passed is not ${input.value}`);
  }
  const sieveClaim = claims.find((candidate) => candidate.id === claim);
  if (sieveClaim && sieveClaim.value !== String(rejectedSum)) {
    fail("content/projects.json", `${project.slug} sieve rejects ${rejectedSum} but claim ${claim} says "${sieveClaim.value}"`);
  }
  for (const bin of rejected) {
    if (!bin.rule) fail("content/projects.json", `${project.slug} sieve bin "${bin.reason}" has no rule`);
  }
}

// Superseded decisions must point at a decision that exists
for (const decision of decisions) {
  if (decision.superseded_by && !decisionIds.has(decision.superseded_by)) {
    fail("content/decisions.json", `${decision.id} is superseded by "${decision.superseded_by}", which does not exist`);
  }
}

if (errors.length > 0) {
  console.error(`check:content failed with ${errors.length} problem${errors.length === 1 ? "" : "s"}:\n`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}

console.log(`check:content passed: ${files.length} files, ${claims.length} claims, ${decisions.length} decisions.`);
