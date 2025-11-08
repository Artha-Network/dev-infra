#!/bin/bash

# WSL Setup Script for Artha Network Solana Development
# Run this script inside WSL Ubuntu to set up the development environment

set -e

echo "🔧 Setting up Artha Network Solana development environment in WSL..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required dependencies
echo "🛠️ Installing build dependencies..."
sudo apt install -y curl build-essential pkg-config libudev-dev llvm libclang-dev

# Install Rust
if ! command -v rustc &> /dev/null; then
    echo "🦀 Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.cargo/env
else
    echo "✅ Rust already installed"
fi

# Install Solana CLI
if ! command -v solana &> /dev/null; then
    echo "⛓️ Installing Solana CLI..."
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
else
    echo "✅ Solana CLI already installed"
fi

# Install Anchor
if ! command -v anchor &> /dev/null; then
    echo "⚓ Installing Anchor Framework..."
    cargo install --git https://github.com/coral-xyz/anchor anchor-cli
else
    echo "✅ Anchor already installed"
fi

# Configure Solana for local development
echo "🌐 Configuring Solana for local development..."
solana config set --url localhost

# Generate a keypair if it doesn't exist
if [ ! -f ~/.config/solana/id.json ]; then
    echo "🔑 Generating Solana keypair..."
    solana-keygen new --no-bip39-passphrase
else
    echo "✅ Solana keypair already exists"
fi

echo "🎉 WSL setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Navigate to the project: cd /mnt/e/Artha-Network/onchain-escrow"
echo "2. Build the program: anchor build"
echo "3. Test the program: anchor test"
echo "4. Start local validator: solana-test-validator --reset"
echo ""
echo "🔍 Verify installation:"
echo "- Rust: $(rustc --version)"
echo "- Solana: $(solana --version)"
echo "- Anchor: $(anchor --version)"