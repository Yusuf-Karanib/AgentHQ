# Security Policy

## Never commit

- Passwords
- API keys or access tokens
- Codex authentication files
- Paperclip master keys
- Cloud credentials
- Private customer or event data

## Pilot restrictions

- Run locally only.
- Do not expose Paperclip to the public internet.
- Keep `dangerouslyBypassApprovalsAndSandbox` disabled.
- Use one task and one workspace at a time.
- Do not connect email, messaging, calendars, or production cloud accounts.
- Do not permit automatic merges or deployments.
- Stop if the worker reaches files outside the AgentHQ workspace.

## Incident response

If a worker performs an unexpected external action, stop all runs, disconnect
the affected connection, rotate exposed credentials, preserve the audit record,
and investigate before restarting.

