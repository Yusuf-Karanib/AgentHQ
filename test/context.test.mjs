import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildContextPack, compileContext } from "../src/context.mjs";
import { loadWorkspace } from "../src/workspace.mjs";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

test("context pack includes the goal, safety controls, documents, and roles", async () => {
  const workspace = await loadWorkspace(repositoryRoot);
  const pack = buildContextPack(workspace);

  assert.match(pack, /permanent, portable AI development workspace/);
  assert.match(pack, /No shared personal accounts/);
  assert.match(pack, /Source: docs\/DECISIONS\.md/);
  assert.match(pack, /Source: agents\/builder\.md/);
  assert.match(pack, /Source fingerprint:\*\* `[a-f0-9]{16}`/);
});

test("context generation is deterministic for unchanged sources", async () => {
  const workspace = await loadWorkspace(repositoryRoot);
  assert.equal(buildContextPack(workspace), buildContextPack(workspace));
});

test("context compiler writes the generated pack outside tracked source files", async () => {
  const outputPath = await compileContext(repositoryRoot);
  const output = await readFile(outputPath, "utf8");
  assert.match(output, /^# AgentHQ Context Pack/);
});

test("missing required context files fail clearly", async () => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "agenthq-test-"));
  try {
    const manifest = JSON.parse(await readFile(new URL("../agenthq.json", import.meta.url), "utf8"));
    await writeFile(join(temporaryRoot, "agenthq.json"), JSON.stringify(manifest), "utf8");
    await mkdir(join(temporaryRoot, "docs"));

    await assert.rejects(
      loadWorkspace(temporaryRoot),
      /Required workspace file is missing: docs\/PROJECT_CONTEXT\.md/
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

