# Architecture

## Layers

1. **Git repository** stores project truth and change history.
2. **AgentHQ files and tools** validate rules and compile portable context.
3. **Paperclip** manages agents, tasks, approvals, runs, and cost records.
4. **Codex or another supported worker** performs assigned work.
5. **Yusuf** approves scope, accounts, spending, merges, and deployment.

## Source of truth

The repository is the durable source for project context. Paperclip may contain
copies for daily work, but permanent decisions must be committed here.

## Trust boundary

A prompt is not a security wall. Real protection must also come from restricted
credentials, limited workspaces, Git branches, tests, and human approval.

