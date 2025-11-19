#!/bin/bash

# Install Foundry
echo "Installing Foundry..."
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup

# Verify installation
forge --version

echo "✅ Foundry installed! Run ./run-fuzz.sh to start fuzzing."