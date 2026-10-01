const REQUIRED_AGENT_IDS = ["lead", "builder", "qa"];
const CREDENTIAL_KEY = /^(api[_-]?key|access[_-]?token|refresh[_-]?token|password|secret|auth[_-]?token)$/i;
const CREDENTIAL_VALUE = /(sk-[a-z0-9_-]{12,}|gh[pousr]_[a-z0-9]{12,}|bearer\s+[a-z0-9._-]{12,})/i;

function add(errors, condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function findCredentialLikeValues(value, path = "manifest", findings = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findCredentialLikeValues(item, `${path}[${index}]`, findings));
    return findings;
  }

  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      const childPath = `${path}.${key}`;
      if (CREDENTIAL_KEY.test(key)) {
        findings.push(`${childPath} looks like a credential field`);
      }
      findCredentialLikeValues(child, childPath, findings);
    }
    return findings;
  }

  if (typeof value === "string" && CREDENTIAL_VALUE.test(value)) {
    findings.push(`${path} looks like a credential value`);
  }

  return findings;
}

export function validateManifest(manifest, availableRoleFiles = new Set()) {
  const errors = [];

  add(errors, manifest?.schemaVersion === 1, "schemaVersion must be 1");
  add(errors, typeof manifest?.workspace?.id === "string" && manifest.workspace.id.length > 0,
    "workspace.id is required");
  add(errors, typeof manifest?.workspace?.goal === "string" && manifest.workspace.goal.length >= 40,
    "workspace.goal must clearly describe the long-term goal");

  add(errors, /^v\d{4}\.\d+\.\d+$/.test(manifest?.paperclip?.pinnedRelease ?? ""),
    "paperclip.pinnedRelease must be an exact stable release");
  add(errors, manifest?.paperclip?.adapter === "codex_local",
    "the foundation must use the reviewed codex_local adapter");
  add(errors, manifest?.paperclip?.executionMode === "sequential",
    "paperclip.executionMode must be sequential during the pilot");
  add(errors, manifest?.paperclip?.dangerouslyBypassApprovalsAndSandbox === false,
    "dangerouslyBypassApprovalsAndSandbox must be false");

  const limits = manifest?.limits ?? {};
  add(errors, Number.isInteger(limits.maxAgents) && limits.maxAgents >= 1 && limits.maxAgents <= 3,
    "limits.maxAgents must be between 1 and 3");
  add(errors, limits.maxConcurrentTasks === 1,
    "limits.maxConcurrentTasks must be 1 during the pilot");
  add(errors, Number.isInteger(limits.maxRunsPerTask) && limits.maxRunsPerTask >= 1 && limits.maxRunsPerTask <= 3,
    "limits.maxRunsPerTask must be between 1 and 3");
  add(errors, limits.newPaidSpendUsd === 0,
    "limits.newPaidSpendUsd must remain 0 during the foundation milestone");

  const approvals = manifest?.approvals ?? {};
  for (const field of [
    "requireHumanMerge",
    "requireHumanDeploy",
    "requireHumanBudgetChange",
    "requireHumanNewConnection"
  ]) {
    add(errors, approvals[field] === true, `approvals.${field} must be true`);
  }

  const connections = manifest?.connections ?? {};
  add(errors, connections.allowSharedPersonalAccounts === false,
    "shared personal accounts must stay disabled");
  add(errors, connections.allowProductionCredentials === false,
    "production credentials must stay disabled during the pilot");

  const agents = Array.isArray(manifest?.agents) ? manifest.agents : [];
  add(errors, agents.length === 3, "the initial operating model must define Lead, Builder, and QA");
  add(errors, agents.length <= (limits.maxAgents ?? 0), "agent count exceeds limits.maxAgents");

  const ids = agents.map((agent) => agent?.id);
  add(errors, new Set(ids).size === ids.length, "agent ids must be unique");
  for (const id of REQUIRED_AGENT_IDS) {
    add(errors, ids.includes(id), `required agent is missing: ${id}`);
  }

  const byId = new Map(agents.map((agent) => [agent?.id, agent]));
  const lead = byId.get("lead");
  const builder = byId.get("builder");
  const qa = byId.get("qa");

  add(errors, lead?.canDelegate === true && lead?.canEditCode === false,
    "Lead must delegate but must not edit implementation code");
  add(errors, builder?.manager === "lead" && builder?.canEditCode === true && builder?.canRunTests === true,
    "Builder must report to Lead and be able to edit code and run tests");
  add(errors, qa?.manager === "lead" && qa?.canEditCode === false && qa?.canRunTests === true,
    "QA must report to Lead, remain read-only, and be able to run tests");

  for (const agent of agents) {
    add(errors, agent?.canMerge === false, `${agent?.id ?? "unknown"}.canMerge must be false`);
    add(errors, agent?.canDeploy === false, `${agent?.id ?? "unknown"}.canDeploy must be false`);
    add(errors, typeof agent?.roleFile === "string" && availableRoleFiles.has(agent.roleFile),
      `role file is missing for ${agent?.id ?? "unknown"}`);
  }

  errors.push(...findCredentialLikeValues(manifest));
  return [...new Set(errors)];
}

export function formatValidationErrors(errors) {
  return errors.map((error, index) => `${index + 1}. ${error}`).join("\n");
}

