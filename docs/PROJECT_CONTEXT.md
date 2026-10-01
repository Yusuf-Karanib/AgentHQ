# Project Context

## Problem

Yusuf works across several unfinished projects and repeatedly has to explain the
same goals, decisions, and history to new AI chats. Previous automation used one
homemade router and did not create separate workers, reliable ownership, durable
project memory, or safe Git workflows.

## Product

AgentHQ is the portable operating layer for Yusuf's AI development team. It uses
Paperclip as the management engine while keeping important knowledge and rules
inside a normal Git repository.

## Primary user

Yusuf is the owner and final decision maker. Explanations and approval requests
must use short, beginner-friendly language.

## Main outcome

Yusuf can replace the connected AI worker without losing:

- The current project goal
- Decisions and reasons
- Open and completed tasks
- Agent roles and restrictions
- Definition of done
- Evidence of work for a portfolio

## Current scope

Build the AgentHQ foundation and prove it locally. Do not connect external
accounts, install Paperclip, or automate another project until the local rules,
validator, context compiler, and tests are working.

## Out of scope for the foundation

- Rebuilding Paperclip
- Production deployment
- Paid API usage
- Shared personal accounts
- Email, messaging, calendar, or cloud connections
- Automatic merge or deployment

