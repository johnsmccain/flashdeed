#!/bin/bash

# FlashDeed ERC-3643 Fuzzing Test Runner
# Install Foundry first: curl -L https://foundry.paradigm.xyz | bash && foundryup

echo "🎯 Running FlashDeed ERC-3643 Fuzzing Tests"

# Run all fuzz tests with 1000 runs
echo "Running all fuzz tests (1000 runs each)..."
forge test --match-path "test/fuzz/*.sol" --fuzz-runs 1000 -vv

# Intensive fuzzing on IdentityRegistry
echo "Intensive fuzzing on IdentityRegistry (5000 runs)..."
forge test --match-contract IdentityRegistryFuzzTest --fuzz-runs 5000

# Gas analysis during fuzzing
echo "Gas analysis during fuzzing..."
forge test --match-path "test/fuzz/*.sol" --fuzz-runs 1000 --gas-report

echo "✅ Fuzzing complete!"