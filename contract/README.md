# FlashDeed ERC-3643 Token System

A production-ready ERC-3643 compliant token system for real estate tokenization with built-in KYC/AML compliance.

## Architecture

### Core Contracts

- **IdentityRegistry**: Manages KYC/AML identities with country codes, accreditation status, and expiry
- **ComplianceManager**: Validates transfers based on jurisdiction, caps, and locks
- **FlashDeedERC3643**: ERC-20 token with compliance checks on every transfer
- **Fractionalizer**: Creates and manages property tokens with share redemption
- **PropertyFactory**: Factory pattern for deploying individual property tokens

### Key Features

- ✅ ERC-3643 compliance with identity verification
- ✅ Jurisdiction-based transfer restrictions
- ✅ Token caps and emergency locks
- ✅ Gas-optimized storage packing
- ✅ Comprehensive event logging
- ✅ Role-based access control
- ✅ Property tokenization and fractionalization

## Quick Start

### Prerequisites

Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Installation

```bash
# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts
forge install OpenZeppelin/openzeppelin-contracts-upgradeable
forge install foundry-rs/forge-std

# Compile contracts
forge build

# Run tests
forge test -vv

# Gas report
forge test --gas-report
```

### Deployment

```bash
# Set environment variables
export PRIVATE_KEY=your_private_key
export RPC_URL=your_rpc_url

# Deploy to testnet
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --verify
```

## Usage Examples

### 1. Setting up KYC

```solidity
// Attest identity
IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
    countryCode: 840, // USA
    accredited: 1,
    expiry: block.timestamp + 365 days,
    kycHash: keccak256("kyc_data")
});

identityRegistry.attestIdentity(userAddress, attrs);
```

### 2. Creating Property Token

```solidity
// Using Fractionalizer
(uint256 propertyId, address tokenAddress) = fractionalizer.createProperty(
    "Luxury Apartment NYC",
    "LANYC", 
    1000000 // total shares
);

// Using PropertyFactory
address tokenAddress = propertyFactory.createProperty(
    "Office Building",
    "OFFICE",
    500000
);
```

### 3. Compliance Configuration

```solidity
// Allow jurisdictions
complianceManager.setJurisdictionAllowed(840, true); // USA
complianceManager.setJurisdictionAllowed(826, true); // UK

// Set token caps
complianceManager.setTokenCap(tokenAddress, 10000);

// Emergency lock
complianceManager.setTokenLock(tokenAddress, true);
```

## Testing

Run comprehensive test suite:

```bash
# All tests
forge test

# Specific test file
forge test --match-contract IdentityRegistryTest

# With gas reporting
forge test --gas-report

# With coverage
forge coverage
```

## Gas Optimization

- Storage packing in IdentityAttributes (96 bytes → 32 bytes)
- Minimal on-chain KYC data (hashes + flags)
- Cached identity lookups
- Efficient event emission

## Security Features

- Role-based access control (OpenZeppelin)
- Transfer validation before execution
- Identity expiry checks
- Jurisdiction restrictions
- Emergency pause mechanisms

## License

MIT License - see LICENSE file for details.