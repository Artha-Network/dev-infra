#!/usr/bin/env node

/**
 * Service Health Check
 *
 * Verifies that all Artha Network services are reachable and responding.
 * Usage:
 *   node scripts/health-check.js              # check all services
 *   node scripts/health-check.js --json       # JSON output for CI
 *   node scripts/health-check.js --watch 10   # re-check every 10 seconds
 */

const http = require("http");
const https = require("https");

// ── Service Definitions ─────────────────────────────────────────────────
const SERVICES = [
  {
    name: "Actions Server",
    url: process.env.ACTIONS_URL || "http://localhost:4000/health",
    required: true,
  },
  {
    name: "Arbiter Service",
    url: process.env.ARBITER_URL || "http://localhost:3001/health",
    required: true,
  },
  {
    name: "Web App",
    url: process.env.WEB_URL || "http://localhost:8081",
    required: true,
  },
  {
    name: "Jobs Service",
    url: process.env.JOBS_URL || "http://localhost:3000/health",
    required: false,
  },
];

// ── Utilities ───────────────────────────────────────────────────────────
const COLORS = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

/**
 * Check a single service endpoint with a timeout.
 * @param {string} url
 * @param {number} timeoutMs
 * @returns {Promise<{ok: boolean, status?: number, latencyMs: number, error?: string}>}
 */
function checkEndpoint(url, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const client = url.startsWith("https") ? https : http;

    const req = client.get(url, { timeout: timeoutMs }, (res) => {
      const latencyMs = Date.now() - start;
      // Consume body to free socket
      res.resume();
      resolve({
        ok: res.statusCode >= 200 && res.statusCode < 400,
        status: res.statusCode,
        latencyMs,
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({ ok: false, latencyMs: timeoutMs, error: "timeout" });
    });

    req.on("error", (err) => {
      resolve({
        ok: false,
        latencyMs: Date.now() - start,
        error: err.code || err.message,
      });
    });
  });
}

/**
 * Run health checks against all services.
 * @returns {Promise<Array<{name: string, ok: boolean, required: boolean, status?: number, latencyMs: number, error?: string}>>}
 */
async function checkAll() {
  const results = await Promise.all(
    SERVICES.map(async (svc) => {
      const result = await checkEndpoint(svc.url);
      return { name: svc.name, required: svc.required, url: svc.url, ...result };
    })
  );
  return results;
}

// ── Output Formatters ───────────────────────────────────────────────────
function printResults(results) {
  const c = COLORS;
  console.log(`\n${c.bold}${c.cyan}Artha Network — Service Health${c.reset}  ${c.dim}${timestamp()}${c.reset}\n`);

  const nameWidth = Math.max(...results.map((r) => r.name.length)) + 2;

  for (const r of results) {
    const icon = r.ok ? `${c.green}\u2713` : `${c.red}\u2717`;
    const tag = r.required ? "" : ` ${c.dim}(optional)${c.reset}`;
    const latency = r.ok ? `${c.dim}${r.latencyMs}ms${c.reset}` : "";
    const err = r.error ? `  ${c.red}${r.error}${c.reset}` : "";
    const status = r.status ? ` [${r.status}]` : "";

    console.log(
      `  ${icon} ${r.name.padEnd(nameWidth)}${c.reset}${status}${latency}${err}${tag}`
    );
  }

  const passing = results.filter((r) => r.ok).length;
  const total = results.length;
  const requiredFailing = results.filter((r) => r.required && !r.ok);

  console.log(
    `\n  ${c.bold}${passing}/${total} services healthy${c.reset}` +
      (requiredFailing.length
        ? `  ${c.red}(${requiredFailing.length} required service(s) down)${c.reset}`
        : `  ${c.green}All required services OK${c.reset}`)
  );
  console.log();

  return requiredFailing.length === 0;
}

function printJSON(results) {
  const summary = {
    timestamp: new Date().toISOString(),
    healthy: results.every((r) => !r.required || r.ok),
    services: results.map(({ name, ok, required, status, latencyMs, error }) => ({
      name,
      ok,
      required,
      status,
      latencyMs,
      ...(error && { error }),
    })),
  };
  console.log(JSON.stringify(summary, null, 2));
  return summary.healthy;
}

// ── CLI ─────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const jsonMode = args.includes("--json");
  const watchIdx = args.indexOf("--watch");
  const watchInterval = watchIdx !== -1 ? parseInt(args[watchIdx + 1], 10) || 10 : 0;

  if (watchInterval > 0 && !jsonMode) {
    console.log(`${COLORS.dim}Watching every ${watchInterval}s (Ctrl+C to stop)${COLORS.reset}`);
    const run = async () => {
      const results = await checkAll();
      // Clear previous output for watch mode
      process.stdout.write("\x1b[2J\x1b[H");
      printResults(results);
    };
    await run();
    setInterval(run, watchInterval * 1000);
  } else {
    const results = await checkAll();
    const healthy = jsonMode ? printJSON(results) : printResults(results);
    process.exit(healthy ? 0 : 1);
  }
}

main().catch((err) => {
  console.error("Health check failed:", err.message);
  process.exit(1);
});
