# dev-infra
Dev containers, docker-compose, localnet bootstrap, env templates, meta docs.

---
```md
# Dev Infra (Localnet, Docker, Scripts)

Batteries-included development environment: Solana local validator, Redis, Postgres, IPFS/Arweave gateway, plus bootstrap scripts.

## Services (docker-compose)
- `solana-test-validator` with airdrop
- `redis` for BullMQ
- `postgres` (optional)
- `ipfs` + `arweave-gw` (optional)

## Quick Start
```bash
docker compose up -d
./scripts/start-localnet.sh
node scripts/airdrop-sol.ts <PUBKEY>
node scripts/mint-usdc.ts   <PUBKEY> 1000
Scripts

start-localnet.sh — boots validator with programs & accounts

airdrop-sol.ts — convenience airdrop

mint-usdc.ts — dev mint for USDC test token

seed-db.ts — (optional) demo data

Docs

docs/LOCAL_DEMO.md — end-to-end flow across all services

docs/ENV_MATRIX.md — env vars per repo

Safety

Never commit secrets.

Keep local mints distinct from devnet/mainnet.

License

MIT
