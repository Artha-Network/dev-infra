# Dev Infrastructure

Dev containers, docker-compose, localnet bootstrap, env templates, meta docs.

> **Central orchestration hub** for Artha Network development.

---

## 🎯 Purpose

Batteries-included development environment: Solana local validator, Redis, Postgres, IPFS/Arweave gateway, plus bootstrap scripts.

This repository contains:

- **Development orchestration scripts** - Start/stop all services
- **Bootstrap scripts** - Initial setup for local development
- **WSL configuration** - Solana CLI setup for Windows
- **NPM workspace config** - Manage all services from one place

## Services (docker-compose)

- `solana-test-validator` with airdrop
- `redis` for BullMQ
- `postgres` (optional)
- `ipfs` + `arweave-gw` (optional)

## 🚀 Quick Start

### First Time Setup

```bash
docker compose up -d
./scripts/start-localnet.sh
```

```bash
# Navigate here
cd dev-infra

# Install all dependencies across repos
npm run setup:full

# Verify WSL environment
npm run check:env
```

### Daily Development

```bash
# Start everything (recommended)
npm start

# Or with detailed logs
npm run dev

# Start with fresh validator state
npm run dev:reset
```

Scripts

- `start-localnet.sh` — boots validator with programs & accounts
- `airdrop-sol.ts` — convenience airdrop
- `mint-usdc.ts` — dev mint for USDC test token
- `seed-db.ts` — (optional) demo data

Docs

- `docs/LOCAL_DEMO.md` — end-to-end flow across all services
- `docs/ENV_MATRIX.md` — env vars per repo

Safety

Never commit secrets.

Keep local mints distinct from devnet/mainnet.

## 📋 Available Scripts

### Main Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start all services (validator + auto-deploy + servers) |
| `npm run dev` | Same as start with colored output |
| `npm run dev:reset` | Start with fresh validator (resets state) |
| `npm run dev:orchestrated` | Alternative orchestration using dev-start.js |

### Building & Deployment

| Command | Description |
|---------|-------------|
| `npm run build:all` | Build Solana program + deploy + build services |
| `npm run build` | Build program + services (no deploy) |
| `npm run build:anchor` | Build only Anchor program |
| `npm run build:services` | Build only actions-server and web-app |
| `npm run deploy:local` | Deploy to local validator |
| `npm run deploy:devnet` | Deploy to Solana devnet |

### Testing

| Command | Description |
|---------|-------------|
| `npm run test` | Run Anchor tests with local validator |
| `npm run test:local` | Run tests against running validator |

### Setup & Maintenance

| Command | Description |
|---------|-------------|
| `npm run setup` | Install all dependencies |
| `npm run setup:full` | Install deps + build program |
| `npm run setup:wsl` | Configure WSL environment |
| `npm run check:env` | Verify WSL setup |
| `npm run clean` | Clean build artifacts |
| `npm run clean:all` | Clean everything including node_modules |

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

## Database Setup (Supabase — preferred)

Artha Network uses Supabase (managed PostgreSQL). Provision a project and set env vars in `web-app` and `actions-server` as per docs.

- SQL initialization script: `sql/init_schema.sql` (can be run in Supabase SQL editor)

## Local Postgres (deprecated)

A local Postgres `docker-compose` remains available under `database/` for debugging, but Supabase is the default.

```bash
cd database
docker-compose up -d
```

Then initialize the schema via Prisma from the actions-server:

```bash
cd ../actions-server
npx prisma migrate dev --name init
```

Example connection string (copy to `actions-server/.env`):

```
DATABASE_URL="postgresql://artha:secret@localhost:5432/artha_dev?schema=public"
```
