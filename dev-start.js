#!/usr/bin/env node

/**
 * Artha Network - Development Orchestrator
 * Usage: node dev-start.js [--network=devnet]
 */

const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Parse arguments
const args = process.argv.slice(2);
const networkArg = args.find(arg => arg.startsWith("--network="));
const NETWORK = networkArg ? networkArg.split("=")[1] : "devnet";

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
};

function log(service, message, color = COLORS.reset) {
  const time = new Date().toISOString().substr(11, 8);
  console.log(`${color}[${time}] [${service}]${COLORS.reset} ${message}`);
}

function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const env = {};
  const content = fs.readFileSync(envPath, "utf-8").replace(/\0/g, "");
  content.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
      }
    }
  });
  return env;
}

function startService(name, command, args, options = {}) {
  return new Promise((resolve, reject) => {
    log(name, `Starting: ${command} ${args.join(" ")}`, COLORS.bright);

    // Load service-specific .env file if cwd is provided
    let serviceEnv = {};
    if (options.cwd) {
      const envPath = path.join(options.cwd, ".env");
      serviceEnv = loadEnv(envPath);
    }

    const proc = spawn(command, args, {
      stdio: "pipe",
      shell: true,
      ...options,
      env: { ...process.env, ...serviceEnv, ...options.env },
    });

    proc.stdout.on("data", (data) => {
      const msg = data.toString().trim();
      if (msg) {
        log(name, msg, options.color || COLORS.reset);
        if (options.waitForMessage && msg.includes(options.waitForMessage)) {
          log(name, "✓ Ready", COLORS.green);
          resolve(proc);
        }
      }
    });

    proc.stderr.on("data", (data) => {
      const msg = data.toString().trim();
      if (msg) log(name, msg, COLORS.red);
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        log(name, `Exited with code ${code}`, COLORS.red);
        if (!options.waitForMessage) {
          reject(new Error(`${name} failed`));
        }
      } else {
        if (!options.waitForMessage) resolve(proc);
      }
    });
  });
}

function killPort(port) {
  return new Promise((resolve) => {
    const cmd = process.platform === 'win32'
      ? `netstat -ano | findstr :${port}`
      : `lsof -ti:${port}`;

    require('child_process').exec(cmd, (err, stdout) => {
      if (err || !stdout) {
        resolve();
        return;
      }
      const lines = stdout.trim().split('\n');
      const pids = new Set();
      lines.forEach(line => {
        const match = line.match(/\s+(\d+)\s*$/);
        if (match) pids.add(match[1]);
      });
      if (pids.size === 0) {
        resolve();
        return;
      }
      const killCmd = process.platform === 'win32'
        ? `taskkill /F /PID ${Array.from(pids).join(' /PID ')}`
        : `kill -9 ${Array.from(pids).join(' ')}`;

      require('child_process').exec(killCmd, () => {
        log("SYSTEM", `Killed process on port ${port}`, COLORS.yellow);
        setTimeout(resolve, 500);
      });
    });
  });
}

async function start() {
  const processes = [];

  try {
    log("SYSTEM", `🚀 Starting Artha Network (${NETWORK.toUpperCase()})`, COLORS.bright);

    // Kill processes on required ports
    log("SYSTEM", "Cleaning up ports...", COLORS.yellow);
    await Promise.all([
      killPort(4000),
      killPort(3001),
      killPort(8081)
    ]);

    const RPC_URL = "https://api.devnet.solana.com";

    // 1. Actions Server
    const actions = await startService(
      "actions",
      "npm", ["run", "dev"],
      {
        cwd: path.join(__dirname, "../actions-server"),
        waitForMessage: "listening on http://localhost:4000",
        color: COLORS.green,
        env: {
          SOLANA_CLUSTER: NETWORK,
          SOLANA_RPC_URL: RPC_URL
        }
      }
    );
    processes.push(actions);
    await new Promise(r => setTimeout(r, 2000));

    // 2. Arbiter Service
    const arbiter = await startService(
      "arbiter",
      "npm", ["run", "dev"],
      {
        cwd: path.join(__dirname, "../arbiter-service"),
        waitForMessage: "running on port",
        color: COLORS.cyan
      }
    );
    processes.push(arbiter);
    await new Promise(r => setTimeout(r, 2000));

    // 3. Web App
    const web = await startService(
      "web",
      "npm", ["run", "dev"],
      {
        cwd: path.join(__dirname, "../web-app"),
        waitForMessage: "Local:",
        color: COLORS.blue,
        env: {
          VITE_SOLANA_RPC: RPC_URL
        }
      }
    );
    processes.push(web);

    log("SYSTEM", "✅ All services running!", COLORS.bright);
    log("SYSTEM", "🔧 Actions: http://localhost:4000", COLORS.green);
    log("SYSTEM", "🤖 Arbiter: http://localhost:3001", COLORS.cyan);
    log("SYSTEM", "🌐 Web App: http://localhost:8081", COLORS.blue);
    log("SYSTEM", "Press Ctrl+C to stop", COLORS.bright);

    process.on("SIGINT", () => {
      log("SYSTEM", "Shutting down...", COLORS.bright);
      processes.forEach(p => p && p.kill && p.kill());
      setTimeout(() => process.exit(0), 1000);
    });

    await new Promise(() => { });
  } catch (error) {
    log("SYSTEM", `Failed: ${error.message}`, COLORS.red);
    processes.forEach(p => p && p.kill && p.kill());
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = { start };
