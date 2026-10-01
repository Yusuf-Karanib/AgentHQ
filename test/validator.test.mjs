import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { validateManifest } from "../src/validator.mjs";

const baseManifest = JSON.parse(await readFile(new URL("../agenthq.json", import.meta.url), "utf8"));
const roleFiles = new Set(baseManifest.agents.map((agent) => agent.roleFile));

function copyManifest() {
  return structuredClone(baseManifest);
}

test("the repository manifest passes all safety checks", () => {
  assert.deepEqual(validateManifest(copyManifest(), roleFiles), []);
});

test("approval and sandbox bypass is rejected", () => {
  const manifest = copyManifest();
  manifest.paperclip.dangerouslyBypassApprovalsAndSandbox = true;

  const errors = validateManifest(manifest, roleFiles);
  assert.ok(errors.some((error) => error.includes("must be false")));
});

test("shared personal accounts are rejected", () => {
  const manifest = copyManifest();
  manifest.connections.allowSharedPersonalAccounts = true;

  const errors = validateManifest(manifest, roleFiles);
  assert.ok(errors.includes("shared personal accounts must stay disabled"));
});

test("more than three agents are rejected", () => {
  const manifest = copyManifest();
  manifest.agents.push({
    ...structuredClone(manifest.agents[1]),
    id: "extra",
    name: "Extra"
  });

  const errors = validateManifest(manifest, roleFiles);
  assert.ok(errors.some((error) => error.includes("Lead, Builder, and QA")));
  assert.ok(errors.some((error) => error.includes("exceeds")));
});

test("automatic merge permission is rejected", () => {
  const manifest = copyManifest();
  manifest.agents[1].canMerge = true;

  const errors = validateManifest(manifest, roleFiles);
  assert.ok(errors.includes("builder.canMerge must be false"));
});

test("credential-shaped fields are rejected", () => {
  const manifest = copyManifest();
  manifest.paperclip.apiKey = "not-a-real-key";

  const errors = validateManifest(manifest, roleFiles);
  assert.ok(errors.some((error) => error.includes("looks like a credential field")));
});

