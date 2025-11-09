# Artha Network Development Guide

> **Note**: This guide is for running all services from the `dev-infra` directory.
> Navigate to `dev-infra/` and run all commands from there.

## Prerequisites

### WSL Setup for Solana Development

Solana development requires WSL (Windows Subsystem for Linux):

1. **Install WSL Ubuntu**:

   ```bash
   wsl --install -d Ubuntu
   ```

2. **Install Solana CLI in WSL**:

   ```bash
   wsl -d Ubuntu -e bash -c "sh -c \"\$(curl -sSfL https://release.solana.com/v1.18.0/install)\""
   ```

3. **Install Anchor in WSL**:

   ```bash
   wsl -d Ubuntu -e bash -c "cargo install --git https://github.com/coral-xyz/anchor anchor-cli"
   ```

4. **Install Rust in WSL** (if not already installed):
   ```bash
   wsl -d Ubuntu -e bash -c "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
   ```

## Quick Start (All Services)

**Important**: Navigate to the `dev-infra/` directory first:

```bash
cd dev-infra
```

Start everything with one command:

```bash
npm run dev
```

This will start:

1. **Solana Test Validator** (yellow) - Local blockchain in WSL with fresh state (`--reset`)
2. **Actions Server** (green) - Backend API on port 4000
3. **Web App** (blue) - Frontend on port 8081

> **Note**: The validator automatically resets on each start to prevent state corruption issues.

## Individual Services

### Start Services Separately

```bash
# Start only the local validator
npm run dev:validator

# Start only the actions server
npm run dev:actions

# Start only the web app
npm run dev:web
```

### Setup Commands

All commands should be run from the `dev-infra/` directory:

```bash
# Install all dependencies
npm run setup

# Full setup including Anchor build
npm run setup:all
```

### Testing

```bash
# Run Anchor tests (starts own validator in WSL)
npm run test

# Run tests against running validator in WSL
npm run test:local
```

### Building & Deployment

```bash
# Build all services
npm run build

# Build only Anchor program in WSL
npm run build:anchor

# Deploy program to local validator in WSL
npm run deploy

# Deploy program to Solana devnet
npm run deploy:devnet
```

## Service Details

| Service        | Port | Platform   | Purpose                          |
| -------------- | ---- | ---------- | -------------------------------- |
| Test Validator | 8899 | WSL Ubuntu | Local Solana blockchain          |
| Actions Server | 4000 | Windows    | Backend API & Solana integration |
| Web App        | 8081 | Windows    | React frontend                   |

## Environment Setup

### WSL Configuration

The project uses WSL for Solana development with the following assumptions:

- WSL distribution: Ubuntu
- Project path in WSL: `/mnt/e/Artha-Network/onchain-escrow`
- Solana CLI and Anchor installed in WSL

### Windows Configuration

Ensure these are configured:

### actions-server/.env

```
PROGRAM_ID=5pBtTiYXkFJgJaz4UrhqUbTWWTtWkrkAmhx3SrX6c7eJ
USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
DATABASE_URL=postgresql://...
SUPABASE_SERVICE_ROLE_KEY=...
```

### web-app/.env

```
VITE_ACTIONS_SERVER_URL=http://localhost:4000
VITE_SUPABASE_URL=https://xwsinvputbgrifvxjehf.supabase.co
```

## Development Workflow

1. **First time setup:**

   ```bash
   npm run setup:all
   ```

2. **Daily development:**

   ```bash
   npm run dev
   ```

3. **Testing changes:**

   ```bash
   npm run test:local
   ```

4. **Deploy updates:**
   ```bash
   npm run deploy
   ```

## Troubleshooting

### WSL Issues

- **WSL not found**: Install with `wsl --install -d Ubuntu`
- **Solana commands fail**: Ensure Solana CLI installed in WSL
- **Path issues**: Verify project accessible at `/mnt/e/Artha-Network/`
- **Permission errors**: Run `wsl -d Ubuntu -e bash -c "chmod +x ~/.local/share/solana/install/active_release/bin/*"`

### Validator Issues

- **"Waiting for fees to stabilize" stuck**: The validator now auto-resets on each start to prevent this
- **Connection refused**: Validator takes ~15 seconds to be ready; deployment waits automatically
- **Manual reset needed**: Run `npm run dev:reset` or delete `onchain-escrow/test-ledger/` folder

### General Issues

- **Port conflicts**: Stop services with `Ctrl+C` and restart
- **Database issues**: Check Supabase credentials in actions-server/.env
- **Solana errors**: Ensure test validator is running first in WSL
- **CORS errors**: Verify actions server is running on port 4000

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │───▶│  Actions Server │───▶│ Solana Validator│
│  (Windows:8081) │    │ (Windows:4000)  │    │   (WSL:8899)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐               │
         └─────────────▶│   Supabase DB   │◀──────────────┘
                        │   (PostgreSQL)  │
                        └─────────────────┘
```

## WSL Development Notes

- **File System**: Windows files accessible in WSL at `/mnt/c/`, `/mnt/e/`, etc.
- **Networking**: WSL services are accessible from Windows via localhost
- **Performance**: Building Rust/Anchor programs is much faster in WSL
- **Tools**: Use WSL for Solana CLI, Anchor CLI, and cargo commands
<<<<<<< HEAD
- **IDE**: You can still use Windows-based IDEs; they work with WSL projects
=======
- **IDE**: You can still use Windows-based IDEs; they work with WSL projects
>>>>>>> 2c77ddb (fixed action-server issue caused due to file address issue)
