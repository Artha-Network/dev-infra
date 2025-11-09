<<<<<<< HEAD
Dev Infrastructure# dev-infra
Dev containers, docker-compose, localnet bootstrap, env templates, meta docs.

Central orchestration hub for Artha Network development.



All development scripts, orchestration tools, and setup utilities for the Artha Network ecosystem.```md
Dev Infra (Localnet, Docker, Scripts)
🎯 Purpose
Batteries-included development environment: Solana local validator, Redis, Postgres, IPFS/Arweave gateway, plus bootstrap scripts.

This repository contains:

Development orchestration scripts - Start/stop all services## Services (docker-compose)

Bootstrap scripts - Initial setup for local development- solana-test-validator with airdrop

WSL configuration - Solana CLI setup for Windows- redis for BullMQ

NPM workspace config - Manage all services from one place- postgres (optional)

ipfs + arweave-gw (optional)
🚀 Quick Start
Quick Start
First Time Setup```bash
docker compose up -d

=======
# Dev Infrastructure# dev-infra

Dev containers, docker-compose, localnet bootstrap, env templates, meta docs.

> **Central orchestration hub** for Artha Network development.

---

All development scripts, orchestration tools, and setup utilities for the Artha Network ecosystem.```md

# Dev Infra (Localnet, Docker, Scripts)

## 🎯 Purpose

Batteries-included development environment: Solana local validator, Redis, Postgres, IPFS/Arweave gateway, plus bootstrap scripts.

This repository contains:

- **Development orchestration scripts** - Start/stop all services## Services (docker-compose)

- **Bootstrap scripts** - Initial setup for local development- `solana-test-validator` with airdrop

- **WSL configuration** - Solana CLI setup for Windows- `redis` for BullMQ

- **NPM workspace config** - Manage all services from one place- `postgres` (optional)

- `ipfs` + `arweave-gw` (optional)

## 🚀 Quick Start

## Quick Start

### First Time Setup```bash

docker compose up -d

```bash./scripts/start-localnet.sh

>>>>>>> 2c77ddb (fixed action-server issue caused due to file address issue)
# Navigate herenode scripts/airdrop-sol.ts <PUBKEY>

cd dev-infranode scripts/mint-usdc.ts   <PUBKEY> 1000

Scripts

# Install all dependencies across repos

npm run setup:fullstart-localnet.sh — boots validator with programs & accounts



# Verify WSL environmentairdrop-sol.ts — convenience airdrop

npm run check:env

```mint-usdc.ts — dev mint for USDC test token



### Daily Developmentseed-db.ts — (optional) demo data



```bashDocs

# Start everything (recommended)

npm startdocs/LOCAL_DEMO.md — end-to-end flow across all services



# Or with detailed logsdocs/ENV_MATRIX.md — env vars per repo

npm run dev

Safety

# Start with fresh validator state

npm run dev:resetNever commit secrets.
<<<<<<< HEAD

Keep local mints distinct from devnet/mainnet.
📋 Available Scripts
License
Main Commands
=======

```

Keep local mints distinct from devnet/mainnet.

## 📋 Available Scripts

License

### Main Commands

>>>>>>> 2c77ddb (fixed action-server issue caused due to file address issue)
MIT

| Command | Description |

|---------|-------------|## Database Setup (Supabase — preferred)

<<<<<<< HEAD
| npm start | Start all services (validator + auto-deploy + servers) |

| npm run dev | Same as start with colored output |Artha Network uses Supabase (managed PostgreSQL). Provision a project and set env vars in web-app and actions-server as per docs.

| npm run dev:reset | Start with fresh validator (resets state) |

| npm run dev:orchestrated | Alternative orchestration using dev-start.js |- SQL initialization script: sql/init_schema.sql (can be run in Supabase SQL editor)
Building & Deployment## Local Postgres (deprecated)
| Command | Description |A local Postgres docker-compose remains available under database/ for debugging, but Supabase is the default.

|---------|-------------|

| npm run build:all | Build Solana program + deploy + build services |```

| npm run build | Build program + services (no deploy) |cd database

| npm run build:anchor | Build only Anchor program |docker-compose up -d

| npm run build:services | Build only actions-server and web-app |```

| npm run deploy:local | Deploy to local validator |

| npm run deploy:devnet | Deploy to Solana devnet |Run the following commands to bring up a local Postgres instance for development:
Testing```
=======
| `npm start` | Start all services (validator + auto-deploy + servers) |

| `npm run dev` | Same as start with colored output |Artha Network uses Supabase (managed PostgreSQL). Provision a project and set env vars in `web-app` and `actions-server` as per docs.

| `npm run dev:reset` | Start with fresh validator (resets state) |

| `npm run dev:orchestrated` | Alternative orchestration using dev-start.js |- SQL initialization script: `sql/init_schema.sql` (can be run in Supabase SQL editor)



### Building & Deployment## Local Postgres (deprecated)



| Command | Description |A local Postgres `docker-compose` remains available under `database/` for debugging, but Supabase is the default.

|---------|-------------|

| `npm run build:all` | Build Solana program + deploy + build services |```

| `npm run build` | Build program + services (no deploy) |cd database

| `npm run build:anchor` | Build only Anchor program |docker-compose up -d

| `npm run build:services` | Build only actions-server and web-app |```

| `npm run deploy:local` | Deploy to local validator |

| `npm run deploy:devnet` | Deploy to Solana devnet |Run the following commands to bring up a local Postgres instance for development:



### Testing```

>>>>>>> 2c77ddb (fixed action-server issue caused due to file address issue)
cd database

| Command | Description |docker-compose up -d

|---------|-------------|```

<<<<<<< HEAD
| npm run test | Run Anchor tests with local validator |

| npm run test:local | Run tests against running validator |Then initialize the schema via Prisma from the actions-server:
Setup & Maintenance```
=======
| `npm run test` | Run Anchor tests with local validator |

| `npm run test:local` | Run tests against running validator |Then initialize the schema via Prisma from the actions-server:



### Setup & Maintenance```

>>>>>>> 2c77ddb (fixed action-server issue caused due to file address issue)
cd ../actions-server

| Command | Description |npx prisma migrate dev --name init

|---------|-------------|```

<<<<<<< HEAD
| npm run setup | Install all dependencies |

| npm run setup:full | Install deps + build program |Example connection string (copy to actions-server/.env):

| npm run setup:wsl | Configure WSL environment |

| npm run check:env | Verify WSL setup |```

| npm run clean | Clean build artifacts |DATABASE_URL="postgresql://artha:secret@localhost:5432/artha_dev?schema=public"

| npm run clean:all | Clean everything including node_modules |```
Utilities
Command
Description
npm run airdrop
Airdrop 10 SOL to test wallet
npm run airdrop:custom
Airdrop to custom address
npm run localnet:bootstrap
Create USDC mint & fund wallets
npm run logs:validator
Stream validator logs
npm run cleanup
Kill validator processes
npm run info
Show project info

📁 Directory Structure
dev-infra/

├── scripts/

│   ├── cleanup.js              # Kill validator processes

│   ├── localnet-bootstrap.js   # Create USDC mint, fund wallets

│   └── airdrop-to-wallet.js    # Custom airdrop utility

├── dev-start.js                # Orchestration script (alternative)

├── setup-wsl.sh                # WSL environment setup

├── package.json                # NPM workspace config

└── DEV_GUIDE.md                # Detailed development guide
🛠️ Scripts Reference
scripts/cleanup.js
Kills any running Solana test validator processes. Run before starting fresh.

node scripts/cleanup.js
scripts/localnet-bootstrap.js
Creates USDC mint, airdrops SOL, creates token accounts, and updates env files.

# Use defaults

node scripts/localnet-bootstrap.js

# Custom wallets

node scripts/localnet-bootstrap.js <SELLER_PUBKEY> <BUYER_PUBKEY>
scripts/airdrop-to-wallet.js
Airdrops SOL to a specific wallet address.

node scripts/airdrop-to-wallet.js <WALLET_ADDRESS> [AMOUNT]
dev-start.js
Alternative orchestration script that starts services sequentially with colored logs.

node dev-start.js
setup-wsl.sh
One-time WSL setup script for Solana development (run inside WSL).

wsl -d Ubuntu -e bash -c "cd /mnt/e/Artha-Network/dev-infra && chmod +x setup-wsl.sh && ./setup-wsl.sh"
🏗️ Service Orchestration
The dev infrastructure manages 12 repositories:

onchain-escrow - Anchor program
actions-server - Backend API
web-app - React frontend
arbiter-service - Dispute resolution
jobs-service - Background jobs
storage-lib - Storage utilities
tickets-lib - CBOR schemas
solana-kit - Solana helpers
core-domain - Domain models
examples - Demo implementations
whitepaper - Documentation
dev-infra - This repository
🔧 Configuration
NPM Workspaces
The package.json defines workspaces pointing to sibling repositories:

"workspaces": [

  "../actions-server",

  "../web-app",

  "../onchain-escrow"

]
WSL Path Configuration
All WSL commands assume:

Distribution: Ubuntu
Project Path: /mnt/e/Artha-Network/
Solana CLI: ~/.local/share/solana/install/active_release/bin
Anchor: ~/.avm/bin/anchor-0.32.1
📚 Documentation
DEV_GUIDE.md - Complete development workflow
setup-wsl.sh - WSL setup documentation
Main README - Project overview
🎯 Program Configuration
Current Program ID: E4Vq17qHGG1PFr5h6vZdQUb3nxhjJB9dwMijiVdxfZLd

This is configured in:

../onchain-escrow/programs/onchain_escrow/src/lib.rs
../onchain-escrow/Anchor.toml
../actions-server/.env
../web-app/.env
🐛 Troubleshooting
Validator Won't Start
# Kill existing processes

npm run cleanup

# Or manually

wsl -d Ubuntu -e bash -c "pkill -f solana-test-validator"
WSL Environment Issues
# Verify setup

npm run check:env

# Re-run setup if needed

npm run setup:wsl
Port Conflicts
# Find process on port 8899

netstat -ano | findstr :8899

# Kill by PID

taskkill /PID <PID> /F
📝 Notes
Auto-reset: Validator resets on each start to prevent state corruption
Auto-deploy: Program deploys automatically after validator starts (~15s)
Workspace management: Changes to any service require restart of related services
Environment sync: After bootstrap, restart services to pick up new env vars
🤝 Contributing
This repository is infrastructure-only. For service-specific contributions, see:

../actions-server/README.md
../onchain-escrow/README.md
../web-app/README.md
📄 License
See LICENSE file for details.

=======
| `npm run setup` | Install all dependencies |

| `npm run setup:full` | Install deps + build program |Example connection string (copy to `actions-server/.env`):

| `npm run setup:wsl` | Configure WSL environment |

| `npm run check:env` | Verify WSL setup |```

| `npm run clean` | Clean build artifacts |DATABASE_URL="postgresql://artha:secret@localhost:5432/artha_dev?schema=public"

| `npm run clean:all` | Clean everything including node_modules |```


### Utilities

| Command | Description |
|---------|-------------|
| `npm run airdrop` | Airdrop 10 SOL to test wallet |
| `npm run airdrop:custom` | Airdrop to custom address |
| `npm run localnet:bootstrap` | Create USDC mint & fund wallets |
| `npm run logs:validator` | Stream validator logs |
| `npm run cleanup` | Kill validator processes |
| `npm run info` | Show project info |

## 📁 Directory Structure

```
dev-infra/
├── scripts/
│   ├── cleanup.js              # Kill validator processes
│   ├── localnet-bootstrap.js   # Create USDC mint, fund wallets
│   └── airdrop-to-wallet.js    # Custom airdrop utility
├── dev-start.js                # Orchestration script (alternative)
├── setup-wsl.sh                # WSL environment setup
├── package.json                # NPM workspace config
└── DEV_GUIDE.md                # Detailed development guide
```

## 🛠️ Scripts Reference

### `scripts/cleanup.js`
Kills any running Solana test validator processes. Run before starting fresh.

```bash
node scripts/cleanup.js
```

### `scripts/localnet-bootstrap.js`
Creates USDC mint, airdrops SOL, creates token accounts, and updates env files.

```bash
# Use defaults
node scripts/localnet-bootstrap.js

# Custom wallets
node scripts/localnet-bootstrap.js <SELLER_PUBKEY> <BUYER_PUBKEY>
```

### `scripts/airdrop-to-wallet.js`
Airdrops SOL to a specific wallet address.

```bash
node scripts/airdrop-to-wallet.js <WALLET_ADDRESS> [AMOUNT]
```

### `dev-start.js`
Alternative orchestration script that starts services sequentially with colored logs.

```bash
node dev-start.js
```

### `setup-wsl.sh`
One-time WSL setup script for Solana development (run inside WSL).

```bash
wsl -d Ubuntu -e bash -c "cd /mnt/e/Artha-Network/dev-infra && chmod +x setup-wsl.sh && ./setup-wsl.sh"
```

## 🏗️ Service Orchestration

The dev infrastructure manages 12 repositories:

1. **onchain-escrow** - Anchor program
2. **actions-server** - Backend API
3. **web-app** - React frontend
4. **arbiter-service** - Dispute resolution
5. **jobs-service** - Background jobs
6. **storage-lib** - Storage utilities
7. **tickets-lib** - CBOR schemas
8. **solana-kit** - Solana helpers
9. **core-domain** - Domain models
10. **examples** - Demo implementations
11. **whitepaper** - Documentation
12. **dev-infra** - This repository

## 🔧 Configuration

### NPM Workspaces

The `package.json` defines workspaces pointing to sibling repositories:

```json
"workspaces": [
  "../actions-server",
  "../web-app",
  "../onchain-escrow"
]
```

### WSL Path Configuration

All WSL commands assume:
- **Distribution**: Ubuntu
- **Project Path**: `/mnt/e/Artha-Network/`
- **Solana CLI**: `~/.local/share/solana/install/active_release/bin`
- **Anchor**: `~/.avm/bin/anchor-0.32.1`

## 📚 Documentation

- **[DEV_GUIDE.md](./DEV_GUIDE.md)** - Complete development workflow
- **[setup-wsl.sh](./setup-wsl.sh)** - WSL setup documentation
- **[Main README](../README.md)** - Project overview

## 🎯 Program Configuration

**Current Program ID**: `E4Vq17qHGG1PFr5h6vZdQUb3nxhjJB9dwMijiVdxfZLd`

This is configured in:
- `../onchain-escrow/programs/onchain_escrow/src/lib.rs`
- `../onchain-escrow/Anchor.toml`
- `../actions-server/.env`
- `../web-app/.env`

## 🐛 Troubleshooting

### Validator Won't Start
```bash
# Kill existing processes
npm run cleanup

# Or manually
wsl -d Ubuntu -e bash -c "pkill -f solana-test-validator"
```

### WSL Environment Issues
```bash
# Verify setup
npm run check:env

# Re-run setup if needed
npm run setup:wsl
```

### Port Conflicts
```bash
# Find process on port 8899
netstat -ano | findstr :8899

# Kill by PID
taskkill /PID <PID> /F
```

## 📝 Notes

- **Auto-reset**: Validator resets on each start to prevent state corruption
- **Auto-deploy**: Program deploys automatically after validator starts (~15s)
- **Workspace management**: Changes to any service require restart of related services
- **Environment sync**: After bootstrap, restart services to pick up new env vars

## 🤝 Contributing

This repository is infrastructure-only. For service-specific contributions, see:
- [../actions-server/README.md](../actions-server/README.md)
- [../onchain-escrow/README.md](../onchain-escrow/README.md)
- [../web-app/README.md](../web-app/README.md)

## 📄 License

See LICENSE file for details.
>>>>>>> 2c77ddb (fixed action-server issue caused due to file address issue)
