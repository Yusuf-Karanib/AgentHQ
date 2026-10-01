import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

export const MANIFEST_FILE = "agenthq.json";

export const CONTEXT_FILES = [
  "docs/PROJECT_CONTEXT.md",
  "docs/DECISIONS.md",
  "docs/TASKS.md",
  "docs/ARCHITECTURE.md",
  "docs/SECURITY.md",
  "docs/ROADMAP.md"
];

function insideRoot(root, candidate) {
  const pathFromRoot = relative(root, candidate);
  return pathFromRoot === "" || (!pathFromRoot.startsWith("..") && !isAbsolute(pathFromRoot));
}

export function resolveInside(root, relativePath) {
  const absoluteRoot = resolve(root);
  const candidate = resolve(absoluteRoot, relativePath);

  if (!insideRoot(absoluteRoot, candidate)) {
    throw new Error(`Path leaves the AgentHQ workspace: ${relativePath}`);
  }

  return candidate;
}

async function readRequiredFile(root, relativePath) {
  const path = resolveInside(root, relativePath);

  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(`Required workspace file is missing: ${relativePath}`);
    }
    throw error;
  }
}

export async function loadWorkspace(root = process.cwd()) {
  const absoluteRoot = resolve(root);
  const manifestText = await readRequiredFile(absoluteRoot, MANIFEST_FILE);
  let manifest;

  try {
    manifest = JSON.parse(manifestText);
  } catch (error) {
    throw new Error(`Invalid JSON in ${MANIFEST_FILE}: ${error.message}`);
  }

  const documents = new Map();
  for (const file of CONTEXT_FILES) {
    documents.set(file, await readRequiredFile(absoluteRoot, file));
  }

  const roles = new Map();
  for (const agent of manifest.agents ?? []) {
    if (typeof agent?.roleFile !== "string") {
      continue;
    }
    roles.set(agent.roleFile, await readRequiredFile(absoluteRoot, agent.roleFile));
  }

  return {
    root: absoluteRoot,
    manifest,
    manifestText,
    documents,
    roles
  };
}

