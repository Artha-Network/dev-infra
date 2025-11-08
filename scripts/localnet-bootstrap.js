#!/usr/bin/env node

/**
 * Localnet Bootstrap
 * - Waits for local validator
 * - Airdrops SOL to seller/buyer wallets
 * - Creates a 6-decimals SPL token mint (USDC-like)
 * - Optionally creates ATAs (idempotent via spl-token) and mints tokens to buyer
 * - Updates env files with the new mint address
 *
 * Usage (PowerShell):
 *   node scripts/localnet-bootstrap.js [sellerPubkey] [buyerPubkey]
 *
 * Defaults:
 *   seller: 4ks9t8YttMHYxMmkKXyPVRYQj7mnhWpFEPse6yiy5648
 *   buyer:  J5VHnSRxVizNgT6xCmoBNnXPU7EDfYJ9xvRjYTK5Xppo
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const ACTIONS_ENV = path.join(ROOT, "actions-server", ".env");
const WEB_ENV = path.join(ROOT, "web-app", ".env");

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8899";
const SELLER =
  process.argv[2] || "4ks9t8YttMHYxMmkKXyPVRYQj7mnhWpFEPse6yiy5648";
const BUYER = process.argv[3] || "J5VHnSRxVizNgT6xCmoBNnXPU7EDfYJ9xvRjYTK5Xppo";

function sh(cmd) {
  const full = `wsl -d Ubuntu -e bash -c "export PATH=~/.local/share/solana/install/active_release/bin:$PATH && ${cmd.replace(
    /\"/g,
    '\\"'
  )}"`;
  return execSync(full, { stdio: ["ignore", "pipe", "pipe"] }).toString();
}

function waitForValidator(maxTries = 30, delayMs = 500) {
  for (let i = 0; i < maxTries; i++) {
    try {
      const out = sh(`solana cluster-version --url ${RPC_URL}`);
      if (out && /^\d+\.\d+/.test(out.trim())) {
        return true;
      }
    } catch (e) {
      // ignore
    }
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
  }
  throw new Error(`Validator not reachable at ${RPC_URL}`);
}

function updateEnv(filePath, key, value) {
  let content = fs.readFileSync(filePath, "utf8");
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(content)) {
    content = content.replace(re, `${key}=${value}`);
  } else {
    if (!content.endsWith("\n")) content += "\n";
    content += `${key}=${value}\n`;
  }
  fs.writeFileSync(filePath, content);
}

function main() {
  console.log("🔄 Waiting for local validator...", RPC_URL);
  waitForValidator();

  console.log("💸 Airdropping SOL to wallets (seller/buyer)...");
  try {
    sh(`solana airdrop 10 ${SELLER} --url ${RPC_URL}`);
  } catch {}
  try {
    sh(`solana airdrop 10 ${BUYER} --url ${RPC_URL}`);
  } catch {}

  console.log("🪙 Creating 6-decimals test USDC mint...");
  const out = sh(`spl-token create-token --decimals 6 --url ${RPC_URL}`);
  const match = out.match(/Creating token\s+([A-Za-z0-9]{32,44})/);
  if (!match) {
    throw new Error(`Failed to parse mint from output:\n${out}`);
  }
  const MINT = match[1];
  console.log("✅ Mint:", MINT);

  console.log("🏦 Creating token accounts for seller & buyer...");
  let sellerAta, buyerAta;
  try {
    const sellerOut = sh(
      `spl-token create-account ${MINT} --owner ${SELLER} --url ${RPC_URL}`
    );
    const sellerMatch = sellerOut.match(
      /Creating account\s+([A-Za-z0-9]{32,44})/
    );
    sellerAta = sellerMatch ? sellerMatch[1] : null;
    if (sellerAta) console.log("   Seller ATA:", sellerAta);
  } catch (e) {
    // Already exists, get it
    const accountsOut = sh(
      `spl-token accounts ${MINT} --owner ${SELLER} --url ${RPC_URL}`
    );
    const ataMatch = accountsOut.match(/([A-Za-z0-9]{32,44})\s+0/);
    sellerAta = ataMatch ? ataMatch[1] : null;
  }

  try {
    const buyerOut = sh(
      `spl-token create-account ${MINT} --owner ${BUYER} --url ${RPC_URL}`
    );
    const buyerMatch = buyerOut.match(
      /Creating account\s+([A-Za-z0-9]{32,44})/
    );
    buyerAta = buyerMatch ? buyerMatch[1] : null;
    if (buyerAta) console.log("   Buyer ATA:", buyerAta);
  } catch (e) {
    // Already exists, get it
    const accountsOut = sh(
      `spl-token accounts ${MINT} --owner ${BUYER} --url ${RPC_URL}`
    );
    const ataMatch = accountsOut.match(/([A-Za-z0-9]{32,44})\s+0/);
    buyerAta = ataMatch ? ataMatch[1] : null;
  }

  if (buyerAta) {
    console.log("🪂 Minting 1,000 USDC to buyer token account...");
    sh(`spl-token mint ${MINT} 1000 ${buyerAta} --url ${RPC_URL}`);
  } else {
    console.log("⚠️  Could not find buyer token account, skipping mint");
  }

  console.log("📝 Updating env files with new mint...");
  if (fs.existsSync(ACTIONS_ENV)) updateEnv(ACTIONS_ENV, "USDC_MINT", MINT);
  if (fs.existsSync(WEB_ENV)) updateEnv(WEB_ENV, "VITE_USDC_MINT", MINT);

  console.log("🎉 Bootstrap complete!");
  console.log("   USDC_MINT:", MINT);
  console.log("   SELLER:", SELLER);
  console.log("   BUYER:", BUYER);
  console.log(
    "ℹ️  Restart actions-server and web-app to pick up env changes if they were running."
  );
}

try {
  main();
} catch (e) {
  console.error("Bootstrap failed:", e.message);
  process.exit(1);
}

