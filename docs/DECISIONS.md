# Decisions

Decisions are append-only. If a decision changes, add a new entry that replaces
the old one instead of silently deleting history.

## D-001 — Use Paperclip as the management engine

**Date:** 2026-10-01  
**Status:** Accepted

AgentHQ will not rebuild Paperclip's dashboard, task system, heartbeats, or cost
ledger. It will add portable context, project rules, validation, and evidence.

## D-002 — Start with three roles and sequential execution

**Date:** 2026-10-01  
**Status:** Accepted

The first team contains Lead, Builder, and QA. They work one after another so
ownership is clear and agents cannot overwrite each other's work.

## D-003 — Do not use shared personal accounts

**Date:** 2026-10-01  
**Status:** Accepted

Automated workers must use Yusuf's supported authentication or a separately
approved service/API identity. Another person's personal subscription will not
be used as a Yusuf-controlled background worker.

## D-004 — AgentHQ is its own first project

**Date:** 2026-10-01  
**Status:** Accepted

The team will prove its process by improving AgentHQ before it receives access
to OpenBento, YallaQueue, SignBridge, or another important repository.

