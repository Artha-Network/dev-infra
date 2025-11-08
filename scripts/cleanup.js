#!/usr/bin/env node
/**
 * Cleanup script - kills any running validator processes
 */
const { execSync } = require("child_process");

try {
  console.log("🧹 Cleaning up previous validator processes...");
  execSync(
    'wsl -d Ubuntu -e bash -c "pkill -f solana-test-validator || true"',
    {
      stdio: "ignore",
    }
  );
  console.log("✅ Cleanup complete");
} catch (error) {
  // Ignore errors - process might not exist
}
