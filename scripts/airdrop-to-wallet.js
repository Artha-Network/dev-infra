#!/usr/bin/env node

/**
 * Airdrop script for Solana local validator
 * Usage: node scripts/airdrop-to-wallet.js <wallet-address> [amount]
 */

const { execSync } = require('child_process');

const walletAddress = process.argv[2];
const amount = process.argv[3] || '10';

if (!walletAddress) {
  console.error('❌ Error: Wallet address required!');
  console.log('\n📋 Usage:');
  console.log('  node scripts/airdrop-to-wallet.js <WALLET_ADDRESS> [AMOUNT]');
  console.log('\n💡 Example:');
  console.log('  node scripts/airdrop-to-wallet.js GJw9w8tKVfNfRbxGXZvBGx8pVZ7QXqXKz2bQ8Yv6pump 10');
  console.log('\n🔍 To get your Phantom wallet address:');
  console.log('  1. Open Phantom wallet extension');
  console.log('  2. Look at the Dashboard debug panel (blue box)');
  console.log('  3. Copy the "Wallet Address" value');
  process.exit(1);
}

// Validate basic Solana address format (base58, 32-44 chars)
if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress)) {
  console.error('❌ Error: Invalid Solana wallet address format!');
  console.error(`   Received: ${walletAddress}`);
  console.log('\n💡 A valid Solana address:');
  console.log('   - Is 32-44 characters long');
  console.log('   - Contains only base58 characters (no 0, O, I, l)');
  process.exit(1);
}

console.log('🚀 Airdropping SOL to your wallet...');
console.log(`   Address: ${walletAddress}`);
console.log(`   Amount:  ${amount} SOL`);
console.log(`   Network: http://localhost:8899`);
console.log('');

try {
  // Airdrop command
  const airdropCmd = `wsl -d Ubuntu -e bash -c "export PATH=~/.local/share/solana/install/active_release/bin:$PATH && solana airdrop ${amount} ${walletAddress} --url http://localhost:8899"`;
  execSync(airdropCmd, { stdio: 'inherit' });
  
  console.log('\n✅ Airdrop complete!');
  
  // Check balance
  console.log('\n📊 Checking balance...');
  const balanceCmd = `wsl -d Ubuntu -e bash -c "export PATH=~/.local/share/solana/install/active_release/bin:$PATH && solana balance ${walletAddress} --url http://localhost:8899"`;
  execSync(balanceCmd, { stdio: 'inherit' });
  
  console.log('\n💡 Next steps:');
  console.log('   1. Refresh your browser (F5)');
  console.log('   2. Check the Dashboard debug panel for updated balance');
  console.log('   3. If still 0, disconnect and reconnect Phantom wallet');
  
} catch (error) {
  console.error('❌ Airdrop failed!');
  console.error('   Make sure the local validator is running: npm run dev:validator');
  process.exit(1);
<<<<<<< HEAD
}
=======
}
>>>>>>> 2c77ddb (fixed action-server issue caused due to file address issue)
