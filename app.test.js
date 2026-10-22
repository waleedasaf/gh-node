const test = require("node:test");
const assert = require("node:assert/strict");
const { createServer } = require("./app");

test("GET / and /health return successful responses", async (t) => {
  const server = createServer();

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  t.after(() => new Promise((resolve, reject) => {
    server.close((err) => err ? reject(err) : resolve());
  }));

  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  assert.equal(
    (await response.json()).message,
    "Node.js CI/CD lab is running"
  );

  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "healthy" });
});
