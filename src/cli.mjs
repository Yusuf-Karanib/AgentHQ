#!/usr/bin/env node

import { resolve } from "node:path";
import { compileContext } from "./context.mjs";
import { loadWorkspace } from "./workspace.mjs";
import { formatValidationErrors, validateManifest } from "./validator.mjs";

function parseRoot(args) {
  const rootIndex = args.indexOf("--root");
  if (rootIndex === -1) {
    return process.cwd();
  }
  if (!args[rootIndex + 1]) {
    throw new Error("--root requires a path");
  }
  return resolve(args[rootIndex + 1]);
}

async function validate(root) {
  const workspace = await loadWorkspace(root);
  const errors = validateManifest(workspace.manifest, new Set(workspace.roles.keys()));

  if (errors.length > 0) {
    console.error(`AgentHQ validation failed:\n${formatValidationErrors(errors)}`);
    process.exitCode = 1;
    return;
  }

  console.log(`AgentHQ configuration is valid: ${workspace.manifest.workspace.name}`);
  console.log(`Agents: ${workspace.manifest.agents.map((agent) => agent.name).join(", ")}`);
  console.log("Safety bypass: disabled");
  console.log(`New paid spend: $${workspace.manifest.limits.newPaidSpendUsd}`);
}

function help() {
  console.log(`AgentHQ

Usage:
  node src/cli.mjs validate [--root PATH]
  node src/cli.mjs context [--root PATH]
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const root = parseRoot(args);

  if (command === "validate") {
    await validate(root);
    return;
  }

  if (command === "context") {
    const outputPath = await compileContext(root);
    console.log(`Context pack created: ${outputPath}`);
    return;
  }

  help();
  if (command && command !== "help" && command !== "--help") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

