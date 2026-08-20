import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

async function readSiteFile(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("homepage presents Shen Wg as a frontend and AI developer", async () => {
  const html = await readSiteFile("index.html");

  assert.match(html, /Shen Wg/);
  assert.match(html, /Frontend Developer/);
  assert.match(html, /AI/);
  assert.match(html, /5\+ years/);
  assert.match(html, /10\+ large-scale projects/);
});

test("homepage exposes the contact email and stylesheet", async () => {
  const html = await readSiteFile("index.html");

  assert.match(html, /mailto:137707189@qq\.com/);
  assert.match(html, /assets\/style\.css/);
});

test("stylesheet includes responsive layout and visible focus states", async () => {
  const css = await readSiteFile("assets/style.css");

  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});
