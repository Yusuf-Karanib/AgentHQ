# Paperclip Integration

This directory contains reviewed examples for connecting AgentHQ to Paperclip.
It does not contain credentials and does not install or start Paperclip.

## Before connecting an agent

1. Run `npm run check` and require every check to pass.
2. Review the pinned Paperclip release and its security advisories again.
3. Build `.agenthq/context-pack.md` with `npm run context`.
4. Replace the path placeholders in the example using AgentHQ's absolute path.
5. Use a supported identity controlled by Yusuf.
6. Keep the safety bypass set to `false`.
7. Use Paperclip's environment test before the first real task.

## Initial execution order

1. Lead writes a task and acceptance checks.
2. Yusuf approves the task.
3. Builder implements it on a branch.
4. QA checks the diff and test evidence.
5. Yusuf decides whether to merge.

All three roles may exist in Paperclip, but only one works at a time during the
pilot.

## Important

`codex-local.safe.example.json` is a human-reviewed reference, not an automatic
Paperclip import file. Paperclip configuration can change between releases.

