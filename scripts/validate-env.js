#!/usr/bin/env node

/**
 * Validate that Program ID, USDC Mint, and RPC URL are consistent across
 * actions-server and web-app so Devnet flows don't fail with config mismatch.
 * Run from repo root or dev-infra: node dev-infra/scripts/validate-env.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const ACTIONS_ENV = path.join(ROOT, "actions-server", ".env");
const WEB_ENV = path.join(ROOT, "web-app", ".env");
const ARBITER_ENV = path.join(ROOT, "arbiter-service", ".env");

function readEnv(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf8");
  const out = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    out[key] = value;
  }
  return out;
}

function main() {
  const actions = readEnv(ACTIONS_ENV);
  const web = readEnv(WEB_ENV);

  if (!actions) {
    console.error("Missing actions-server/.env");
    process.exit(1);
  }

  const programId = actions.PROGRAM_ID || actions.NEXT_PUBLIC_PROGRAM_ID;
  const usdcMint = actions.USDC_MINT || actions.NEXT_PUBLIC_USDC_MINT;
  const rpcUrl = actions.SOLANA_RPC_URL || actions.RPC_URL;

  const checks = [];

  if (!programId) {
    checks.push({ name: "Program ID (actions-server)", ok: false, msg: "PROGRAM_ID or NEXT_PUBLIC_PROGRAM_ID not set" });
  } else {
    checks.push({ name: "Program ID (actions-server)", ok: true, value: programId });
  }

  if (!usdcMint) {
    checks.push({ name: "USDC Mint (actions-server)", ok: false, msg: "USDC_MINT or NEXT_PUBLIC_USDC_MINT not set" });
  } else {
    checks.push({ name: "USDC Mint (actions-server)", ok: true, value: usdcMint });
  }

  if (!rpcUrl) {
    checks.push({ name: "RPC URL (actions-server)", ok: false, msg: "SOLANA_RPC_URL or RPC_URL not set" });
  } else {
    checks.push({ name: "RPC URL (actions-server)", ok: true, value: rpcUrl });
  }

  if (web) {
    const webProgramId = web.VITE_PROGRAM_ID;
    const webUsdcMint = web.VITE_USDC_MINT;
    if (programId && webProgramId && programId !== webProgramId) {
      checks.push({
        name: "Program ID match (web-app)",
        ok: false,
        msg: `Mismatch: actions=${programId} vs web=${webProgramId}`,
      });
    } else if (webProgramId) {
      checks.push({ name: "Program ID match (web-app)", ok: true, value: webProgramId });
    }
    if (usdcMint && webUsdcMint && usdcMint !== webUsdcMint) {
      checks.push({
        name: "USDC Mint match (web-app)",
        ok: false,
        msg: `Mismatch: actions=${usdcMint} vs web=${webUsdcMint}`,
      });
    } else if (webUsdcMint) {
      checks.push({ name: "USDC Mint match (web-app)", ok: true, value: webUsdcMint });
    }
  } else {
    checks.push({ name: "web-app/.env", ok: false, msg: "File not found" });
  }

  // Optionally validate arbiter-service matches (Program ID, USDC Mint, RPC)
  const arbiter = readEnv(ARBITER_ENV);
  if (arbiter) {
    const arbProgramId = arbiter.PROGRAM_ID || arbiter.NEXT_PUBLIC_PROGRAM_ID;
    const arbUsdcMint = arbiter.USDC_MINT || arbiter.NEXT_PUBLIC_USDC_MINT;
    const arbRpc = arbiter.SOLANA_RPC_URL || arbiter.RPC_URL;
    if (programId && arbProgramId && programId !== arbProgramId) {
      checks.push({
        name: "Program ID match (arbiter-service)",
        ok: false,
        msg: `Mismatch: actions=${programId} vs arbiter=${arbProgramId}`,
      });
    } else if (arbProgramId) {
      checks.push({ name: "Program ID match (arbiter-service)", ok: true, value: arbProgramId });
    }
    if (usdcMint && arbUsdcMint && usdcMint !== arbUsdcMint) {
      checks.push({
        name: "USDC Mint match (arbiter-service)",
        ok: false,
        msg: `Mismatch: actions=${usdcMint} vs arbiter=${arbUsdcMint}`,
      });
    } else if (arbUsdcMint) {
      checks.push({ name: "USDC Mint match (arbiter-service)", ok: true, value: arbUsdcMint });
    }
    if (rpcUrl && arbRpc && rpcUrl !== arbRpc) {
      checks.push({
        name: "RPC URL match (arbiter-service)",
        ok: false,
        msg: `Mismatch: actions RPC vs arbiter RPC`,
      });
    } else if (arbRpc) {
      checks.push({ name: "RPC URL match (arbiter-service)", ok: true, value: (arbRpc || "").slice(0, 40) + "..." });
    }
  }

  let failed = false;
  for (const c of checks) {
    if (c.ok) {
      console.log(`OK  ${c.name}: ${(c.value || "").slice(0, 20)}...`);
    } else {
      console.error(`FAIL ${c.name}: ${c.msg || "missing"}`);
      failed = true;
    }
  }

  if (failed) {
    console.error("\nFix env files so Program ID, USDC Mint, and RPC match across actions-server, web-app, and (if present) arbiter-service.");
    process.exit(1);
  }
  console.log("\nConfig validation passed.");
}

main();
