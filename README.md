# outport-example

A reference repository showing how [Outport](https://outport.dev) orchestrates ports, hostnames, and environment variables across a multi-service dev environment. Four Node/Express services, wired together by a single `outport.yml` — two commands from clone to running.

## Prerequisites

- Node.js 18+
- [Outport](https://outport.dev) — port orchestration and `.test` domains
- [process-compose](https://f1bonacc1.github.io/process-compose/) — service orchestration

Optional:
- [Bruno](https://www.usebruno.com/) — GUI-based API testing (collection included)
- Docker — for the Compose isolation demo

## Quick start

```bash
git clone https://github.com/steveclarke/outport-example.git
cd outport-example
bin/dev
```

Once the services are running, visit https://outport.test for the dashboard, or run `outport open` to open all services in your browser.

## What's in the box

| Command | What it does |
|---------|-------------|
| `bin/dev` | Starts all services (runs setup automatically on first run) |
| `bin/dev -D` | Starts all services in the background (headless, for agents) |
| `bin/dev stop` | Stops everything |
| `bin/dev status` | Shows service health (`--json` for machine-readable output) |
| `bin/dev logs <service>` | Tails logs for one service |
| `bin/dev restart [service]` | Restarts one service, or all if no service specified |

## The manual way

`bin/dev` uses process-compose under the hood to start all four services, wait for the API health check to pass before launching the frontends, and give you a single TUI to monitor them.

Without process-compose, run each service in a separate terminal:

```bash
bin/start-api
bin/start-app
bin/start-admin
bin/start-docs
```

These are the same scripts that `process-compose.yml` calls — `bin/dev` just orchestrates them.

## What just happened?

On first run, `bin/dev` detected no `.env` files and ran setup automatically. Outport read `outport.yml` and:

1. **Allocated deterministic ports** for each service (same inputs always produce the same ports)
2. **Computed cross-service URLs** — the API URL for frontends, CORS origins for the API
3. **Wrote everything to the right `.env` files** — each service gets exactly the variables it needs

Here's what ended up in each `.env` file:

**`api/.env`** — The API knows its own URL, its port, and which frontends to allow for CORS:

```env
# --- begin outport.dev ---
API_PORT=32524
API_SELF_URL=https://api.example.test
CORS_ORIGINS=https://example.test,https://admin.example.test
# --- end outport.dev ---
```

**`app/.env`** — The app frontend knows its own URL and how to reach the API two ways: `localhost:port` for server-to-server calls, and the `.test` hostname for browser-facing links:

```env
# --- begin outport.dev ---
API_HOSTNAME=https://api.example.test
API_URL=http://localhost:32524
APP_PORT=39191
APP_URL=https://example.test
# --- end outport.dev ---
```

**`admin/.env`** — Same wiring, different port and URL:

```env
# --- begin outport.dev ---
ADMIN_PORT=32939
ADMIN_URL=https://admin.example.test
API_HOSTNAME=https://api.example.test
API_URL=http://localhost:32524
# --- end outport.dev ---
```

**`docs/.env`** — Standalone, just needs its port and URL:

```env
# --- begin outport.dev ---
DOCS_PORT=37339
DOCS_URL=https://docs.example.test
# --- end outport.dev ---
```

Nobody hardcoded these values. The `outport.yml` config uses template expressions like `${api.url:direct}` and `${app.url}` to wire services together. Change the config, run `outport up` again, and every `.env` file updates.

## Explore

- Visit each service in the browser: [example.test](https://example.test), [api.example.test](https://api.example.test), [admin.example.test](https://admin.example.test), [docs.example.test](https://docs.example.test)
- Run `bin/test-api` to probe all four services from the command line
- Open the `bruno/` collection in [Bruno](https://www.usebruno.com/) for GUI-based API testing — it reads `BRUNO_API_URL` from its own `.env` file, also managed by Outport

## Try worktrees

This is where it gets interesting. Create a git worktree and run setup there:

```bash
git worktree add -b my-feature ../outport-example-feature
cd ../outport-example-feature
bin/dev
```

The new worktree gets completely different ports and an isolated `COMPOSE_PROJECT_NAME`:

| | Main checkout | Worktree |
|---|---|---|
| API port | `32524` | different |
| App port | `39191` | different |
| Hostnames | `example.test` | `example-xbjf.test` |
| `COMPOSE_PROJECT_NAME` | `example` | `example-xbjf` |

Same `outport.yml`, different ports, different hostnames, no conflicts. Both checkouts run simultaneously.

## Local overrides

The repo includes an `outport.local.yml` with a commented-out example. Uncomment the `open` list to customize which services `outport open` launches in your browser:

```yaml
# Only open the app and API when running `outport open`:
open:
  - app
  - api
```

In real projects, `outport.local.yml` is gitignored — it's for per-machine customization without touching the shared config.

## Learn more

- [Outport documentation](https://outport.dev)
- [Configuration reference](https://outport.dev/guide/configuration)
- [Running your dev stack](https://outport.dev/guide/devstack) — the `bin/dev` + `DEVSTACK.md` convention
- [process-compose documentation](https://f1bonacc1.github.io/process-compose/)
