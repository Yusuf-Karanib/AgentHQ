# Tasks

## Active milestone — Portable foundation

### AHQ-001 — Define the operating model

**Owner:** Yusuf with Codex  
**Status:** Completed

Acceptance checks:

- The goal and project boundary are documented.
- Lead, Builder, and QA have separate role files.
- Budget, account, merge, and deployment limits are machine-readable.
- The repository contains no credentials.

### AHQ-002 — Build configuration validation

**Owner:** Builder  
**Status:** Completed

Acceptance checks:

- Unsafe or incomplete manifests fail with clear messages.
- A safe three-agent manifest passes.
- Automated tests cover both passing and failing configurations.

### AHQ-003 — Build the portable context pack

**Owner:** Builder  
**Status:** Completed

Acceptance checks:

- One command combines context, decisions, tasks, security rules, and roles.
- The generated pack identifies its source files.
- Missing files cause a clear failure instead of silent incomplete context.

### AHQ-004 — Add Paperclip safely

**Owner:** Yusuf  
**Status:** Blocked until a supported authentication choice is approved

Acceptance checks:

- The exact release is reviewed before installation.
- Safety bypass is disabled.
- Only Yusuf's supported authentication is connected.
- Environment test passes before any real heartbeat.

### AHQ-005 — Add continuous verification

**Owner:** Builder  
**Status:** Completed

Acceptance checks:

- Every push and pull request runs the complete check.
- Checks run on Windows and Linux.
- The workflow receives read-only repository permission.

