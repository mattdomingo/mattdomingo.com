import assert from "node:assert/strict";

const base = new URL(process.argv[2] || "http://127.0.0.1:3000");
const projectIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18];
const routes = [
  "/",
  "/about",
  "/projects",
  "/contact",
  "/resume",
  ...projectIds.map((id) => `/projects/${id}`),
];
const staticAssets = new Set();
for (const route of routes) {
  const response = await fetch(new URL(route, base));
  assert.equal(response.status, 200, `${route} must respond successfully`);
  const html = await response.text();
  assert.match(
    html,
    /<h1[\s>]/,
    `${route} must contain the rendered page content`,
  );
  assert.match(
    html,
    /Skip to content/,
    `${route} must retain keyboard navigation`,
  );
  assert.doesNotMatch(html, /Application error: a server-side exception/);
  for (const [, resource] of html.matchAll(
    /(?:src|href)="(\/_next\/static\/[^"?]+)(?:\?[^\"]*)?"/g,
  ))
    staticAssets.add(resource);
}
for (const route of [
  "/projects/999",
  "/projects/15junk",
  "/projects/015",
  "/this-page-does-not-exist",
]) {
  const response = await fetch(new URL(route, base));
  assert.equal(response.status, 404, `${route} must return a real 404`);
}
for (const asset of staticAssets) {
  const response = await fetch(new URL(asset, base), { method: "HEAD" });
  assert.equal(response.status, 200, `Build asset missing: ${asset}`);
}
for (const file of [
  "/documents/resume.pdf",
  "/documents/resume-applied-ai.pdf",
]) {
  const response = await fetch(new URL(file, base));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/pdf/);
  assert.equal(
    Buffer.from(await response.arrayBuffer())
      .subarray(0, 5)
      .toString(),
    "%PDF-",
  );
}
console.log(
  `Passed: ${routes.length} content routes, 4 true 404s, ${staticAssets.size} build assets, and both résumé PDFs.`,
);
