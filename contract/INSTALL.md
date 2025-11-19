# Installation Instructions

## Install Foundry

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify installation
forge --version
```

## Compile Contracts

```bash
# Navigate to project
cd FlashDeed

# Compile all contracts
forge build

# Run tests
forge test --gas-report

# Deploy (after setting .env)
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

## Project Ready

All contracts and tests are implemented and ready for compilation once Foundry is installed.