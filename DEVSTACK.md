# DEVSTACK.md

Machine-readable dev environment reference for **outport-example**.

## Prerequisites

| Tool            | Install                                        |
|-----------------|------------------------------------------------|
| Node.js 18+     | https://nodejs.org                             |
| outport         | `brew install steveclarke/tap/outport`         |
| process-compose | `brew install f1bonacc1/tap/process-compose`   |

## Setup & Start

```
bin/dev          # TUI mode (interactive terminal, auto-setup on first run)
bin/dev -D       # Headless mode (for agents / background)
```

First run automatically detects missing `.env` files and runs `bin/setup`
(outport setup, outport up, npm install).

## Stop

```
bin/dev stop
```

## Health Check

```
bin/dev status
```

Returns wide-format status. Pass `--json` for machine-readable output.

## Logs

```
bin/dev logs <service>
```

## Restart

```
bin/dev restart              # Restart all services
bin/dev restart <service>    # Restart one service
```

## Services

| Name    | Description                          |
|---------|--------------------------------------|
| `api`   | API server (api.example.test)        |
| `app`   | App frontend (example.test)          |
| `admin` | Admin frontend (admin.example.test)  |
| `docs`  | Docs site (docs.example.test)        |

## Worktrees

Each worktree gets its own ports, hostnames, and process-compose socket via Outport.
Run `bin/setup` in the new worktree and everything is isolated automatically.
