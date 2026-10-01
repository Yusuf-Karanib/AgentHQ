# AgentHQ

AgentHQ is a portable operating layer for a small AI development team. Paperclip
provides the management engine; AgentHQ provides the project memory, team rules,
safety limits, and proof that the work followed a controlled process.

The goal is simple: change the AI workers without losing the project's goals,
decisions, tasks, or working rules.

## Current status

Foundation milestone. Nothing is connected to a paid API, personal account, or
production system yet.

## Initial team

- **Lead** turns the project goal into clear tasks and assigns work.
- **Builder** changes code only inside the assigned project workspace.
- **QA** tests the result and reports evidence. QA cannot merge its own approval.

The team works sequentially at first so two agents cannot edit the same files at
the same time.

## What this repository will contain

- Durable project context and decision history
- Three clearly separated agent roles
- Budget and permission guardrails
- A context compiler that creates a portable briefing pack
- Validation that rejects unsafe or incomplete team configurations
- Paperclip integration templates
- Automated tests and CI

## Why this is not a Paperclip clone

Paperclip already handles companies, agents, tasks, heartbeats, approvals, and
cost records. AgentHQ keeps the operating rules and project knowledge portable,
reviewable, and version controlled.

## Local commands

Requires Node.js 24 or newer.

```text
npm run validate
npm run context
npm test
npm run check
```

`npm run context` will build `.agenthq/context-pack.md`. That generated file is
not committed because it can be rebuilt from the source documents.

## Safety defaults

- No shared personal accounts
- No paid API keys during the first pilot
- No production credentials
- No automatic deployment
- No automatic merge
- One active task at a time
- Human approval before merging
- Maximum three agents and three runs per task

## Project stages

1. Build and test the portable context system.
2. Connect one supported Codex identity to Paperclip.
3. Run Lead, Builder, and QA sequentially on AgentHQ itself.
4. Add GitHub pull-request evidence.
5. Only then connect another real project.

