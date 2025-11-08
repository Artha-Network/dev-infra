#!/usr/bin/env node

/**
 * Development orchestration script for Artha Network
 * Starts services in order: validator -> actions-server -> web-app
 */

const { spawn } = require("child_process");
const path = require("path");

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

function log(service, message, color = COLORS.reset) {
  const timestamp = new Date().toISOString().substr(11, 8);
  console.log(`${color}[${timestamp}] [${service}]${COLORS.reset} ${message}`);
}

function startService(name, command, args, options = {}) {
  return new Promise((resolve, reject) => {
    log(name, `Starting: ${command} ${args.join(" ")}`, COLORS.bright);

    const process = spawn(command, args, {
      stdio: "pipe",
      shell: true,
      ...options,
    });

    process.stdout.on("data", (data) => {
      const message = data.toString().trim();
      if (message) {
        log(name, message, options.color || COLORS.reset);
      }
    });

    process.stderr.on("data", (data) => {
      const message = data.toString().trim();
      if (message) {
        log(name, `ERROR: ${message}`, COLORS.red);
      }
    });

    process.on("close", (code) => {
      if (code === 0) {
        log(name, "Process exited successfully", COLORS.green);
        resolve();
      } else {
        log(name, `Process exited with code ${code}`, COLORS.red);
        reject(new Error(`${name} failed with code ${code}`));
      }
    });

    // For long-running services, resolve when they start listening
    if (options.waitForMessage) {
      process.stdout.on("data", (data) => {
        if (data.toString().includes(options.waitForMessage)) {
          log(name, "Service ready!", COLORS.green);
          resolve(process);
        }
      });
    }

    return process;
  });
}

async function startDevelopment() {
  try {
    log(
      "SYSTEM",
      "Starting Artha Network development environment...",
      COLORS.bright
    );

    // 1. Start Solana test validator in WSL
    log(
      "SYSTEM",
      "Step 1: Starting Solana test validator in WSL...",
      COLORS.yellow
    );
    const validatorProcess = await startService(
      "validator",
      "wsl",
      [
        "-d",
        "Ubuntu",
        "-e",
        "bash",
        "-c",
        "export PATH=~/.local/share/solana/install/active_release/bin:$PATH && cd /mnt/e/Artha-Network/onchain-escrow && solana-test-validator --reset --quiet",
      ],
      {
        color: COLORS.yellow,
        waitForMessage: "Waiting for RPC connection",
      }
    );

    // Wait a bit for validator to fully initialize
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 2. Start actions server
    log("SYSTEM", "Step 2: Starting actions server...", COLORS.green);
    const actionsProcess = await startService(
      "actions",
      "npm",
      ["run", "dev"],
      {
        cwd: path.join(__dirname, "../actions-server"),
        color: COLORS.green,
        waitForMessage: "listening on http://localhost:4000",
      }
    );

    // Wait a bit for actions server to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3. Start web app
    log("SYSTEM", "Step 3: Starting web application...", COLORS.blue);
    const webProcess = await startService("web", "npm", ["run", "dev"], {
      cwd: path.join(__dirname, "../web-app"),
      color: COLORS.blue,
      waitForMessage: "Local:",
    });

    log("SYSTEM", "🚀 All services started successfully!", COLORS.bright);
    log("SYSTEM", "📊 Validator: http://localhost:8899", COLORS.yellow);
    log("SYSTEM", "🔧 Actions API: http://localhost:4000", COLORS.green);
    log("SYSTEM", "🌐 Web App: http://localhost:8081", COLORS.blue);
    log("SYSTEM", "Press Ctrl+C to stop all services", COLORS.bright);

    // Handle shutdown
    process.on("SIGINT", () => {
      log("SYSTEM", "Shutting down all services...", COLORS.bright);

      if (webProcess && webProcess.kill) webProcess.kill();
      if (actionsProcess && actionsProcess.kill) actionsProcess.kill();
      if (validatorProcess && validatorProcess.kill) validatorProcess.kill();

      setTimeout(() => process.exit(0), 1000);
    });

    // Keep the script running
    await new Promise(() => {}); // infinite wait
  } catch (error) {
    log(
      "SYSTEM",
      `Failed to start development environment: ${error.message}`,
      COLORS.red
    );
    process.exit(1);
  }
}

if (require.main === module) {
  startDevelopment();
}

module.exports = { startDevelopment };
