import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadWorkspace } from "./workspace.mjs";
import { formatValidationErrors, validateManifest } from "./validator.mjs";

function fingerprint(entries) {
  const hash = createHash("sha256");
  for (const [name, content] of entries) {
    hash.update(name);
    hash.update("\0");
    hash.update(content);
    hash.update("\0");
  }
  return hash.digest("hex").slice(0, 16);
}

export function buildContextPack(workspace) {
  const sourceEntries = [
    ["agenthq.json", workspace.manifestText],
    ...workspace.documents.entries(),
    ...workspace.roles.entries()
  ];
  const digest = fingerprint(sourceEntries);
  const sourceList = sourceEntries.map(([name]) => `- \`${name}\``).join("\n");
  const sections = sourceEntries
    .filter(([name]) => name !== "agenthq.json")
    .map(([name, content]) => `## Source: ${name}\n\n${content.trim()}`)
    .join("\n\n---\n\n");

  return `# AgentHQ Context Pack

**Workspace:** ${workspace.manifest.workspace.name}  
**Goal:** ${workspace.manifest.workspace.goal}  
**Source fingerprint:** \`${digest}\`

This file is generated. Edit the source documents, not this file.

## Non-negotiable controls

- One active task at a time
- Maximum three agent runs per task
- No shared personal accounts
- No production credentials
- No automatic merge or deployment
- Human approval for new connections, spending, merge, and deployment
- Codex approval and sandbox bypass remains disabled

## Included sources

${sourceList}

---

${sections}
`;
}

export async function compileContext(root = process.cwd()) {
  const workspace = await loadWorkspace(root);
  const roleFiles = new Set(workspace.roles.keys());
  const errors = validateManifest(workspace.manifest, roleFiles);

  if (errors.length > 0) {
    throw new Error(`Workspace validation failed:\n${formatValidationErrors(errors)}`);
  }

  const outputDirectory = join(workspace.root, ".agenthq");
  const outputPath = join(outputDirectory, "context-pack.md");
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, buildContextPack(workspace), "utf8");
  return outputPath;
}

