#!/usr/bin/env node
// Fails the build if a stray em dash ("—") is found in source files.
// Em dashes are never part of a Portuguese word (hyphens "-" are, e.g. "ajudá-las"),
// so any occurrence is treated as a content issue.
// To intentionally allow an em dash on a specific line, append the marker:
//   // allow-em-dash
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["src"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".html", ".css"]);
const EM_DASH = "\u2014";
const ALLOW = "allow-em-dash";

function stripComments(source) {
  // Remove /* ... */ block comments and //... line comments.
  // Good enough for detecting stray em dashes in code/CSS: we don't need a real parser
  // because comments are the only place where an em dash is legitimately allowed.
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (_m, p1) => p1);
}

/** @type {{file:string,line:number,text:string}[]} */
const hits = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      walk(p);
    } else if (EXTS.has(extname(entry))) {
      const raw = readFileSync(p, "utf8");
      if (!raw.includes(EM_DASH)) continue;
      if (raw.includes("AUTO-GENERATED")) continue;
      const stripped = stripComments(raw);
      const rawLines = raw.split(/\r?\n/);
      const strippedLines = stripped.split(/\r?\n/);
      strippedLines.forEach((line, i) => {
        if (line.includes(EM_DASH) && !rawLines[i].includes(ALLOW)) {
          hits.push({ file: p, line: i + 1, text: rawLines[i].trim() });
        }
      });
    }
  }
}

for (const root of ROOTS) {
  try {
    walk(root);
  } catch {
    // root missing, skip
  }
}

// Ignore this script itself when scanning (safety net)
const filtered = hits.filter((h) => !h.file.endsWith("check-em-dash.mjs"));

if (filtered.length > 0) {
  console.error(
    `\n\u274c Em dash ("\u2014") encontrado em ${filtered.length} local(is). Use v\u00edrgula, ponto ou h\u00edfen ("-") se fizer parte da palavra.\n` +
      `   Para permitir intencionalmente, adicione o coment\u00e1rio "// ${ALLOW}" na linha.\n`,
  );
  for (const h of filtered) {
    console.error(`  ${h.file}:${h.line}  ${h.text}`);
  }
  process.exit(1);
}

console.log("\u2705 Nenhum em dash encontrado.");