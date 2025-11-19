#!/bin/bash

# Kill existing processes
pkill -f anvil
pkill -f "next dev"

# Start Anvil blockchain
echo "Starting Anvil blockchain..."
~/.foundry/bin/anvil --host 0.0.0.0 --port 8545 --chain-id 31337 > anvil.log 2>&1 &
ANVIL_PID=$!

# Wait for Anvil to start
sleep 3

# Deploy contracts
echo "Deploying contracts..."
cd contract
~/.foundry/bin/forge script script/DeployAll.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Extract contract addresses and update .env.local
IDENTITY_REGISTRY=$(grep "IdentityRegistry deployed at:" broadcast/DeployAll.s.sol/31337/run-latest.json | grep -o '0x[a-fA-F0-9]\{40\}' | head -1)
COMPLIANCE_MANAGER=$(grep "ComplianceManager deployed at:" broadcast/DeployAll.s.sol/31337/run-latest.json | grep -o '0x[a-fA-F0-9]\{40\}' | head -1)
PROPERTY_FACTORY=$(grep "PropertyFactory deployed at:" broadcast/DeployAll.s.sol/31337/run-latest.json | grep -o '0x[a-fA-F0-9]\{40\}' | head -1)
FRACTIONALIZER=$(grep "Fractionalizer deployed at:" broadcast/DeployAll.s.sol/31337/run-latest.json | grep -o '0x[a-fA-F0-9]\{40\}' | head -1)

# Update frontend .env.local
cd ../frontend
cat > .env.local << EOF
NEXT_PUBLIC_WC_PROJECT_ID=test_project_id
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=${IDENTITY_REGISTRY}
NEXT_PUBLIC_COMPLIANCE_MANAGER_ADDRESS=${COMPLIANCE_MANAGER}
NEXT_PUBLIC_PROPERTY_FACTORY_ADDRESS=${PROPERTY_FACTORY}
NEXT_PUBLIC_FRACTIONALIZER_ADDRESS=${FRACTIONALIZER}
EOF

# Start frontend
echo "Starting frontend..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

echo "✅ Development environment started!"
echo "📊 Blockchain: http://localhost:8545"
echo "🌐 Frontend: http://localhost:3000"
echo "🔑 Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
echo ""
echo "Contract Addresses:"
echo "IdentityRegistry: ${IDENTITY_REGISTRY}"
echo "ComplianceManager: ${COMPLIANCE_MANAGER}"
echo "PropertyFactory: ${PROPERTY_FACTORY}"
echo "Fractionalizer: ${FRACTIONALIZER}"
echo ""
echo "To stop: pkill -f anvil && pkill -f 'next dev'"