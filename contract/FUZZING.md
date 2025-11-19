# Fuzzing Tests for FlashDeed ERC-3643

## Overview

Comprehensive fuzzing test suite to validate contract security and edge cases.

## Test Files

### `test/fuzz/IdentityRegistryFuzz.t.sol`
- **testFuzz_AttestIdentity**: Random identity attributes validation
- **testFuzz_ExpiredIdentity**: Expired identity rejection
- **testFuzz_RevokeIdentity**: Identity revocation with random data

### `test/fuzz/ComplianceFuzz.t.sol`
- **testFuzz_CanTransfer**: Transfer validation with random jurisdictions
- **testFuzz_TokenCap**: Cap enforcement with random amounts
- **testFuzz_TokenLock**: Lock mechanism validation

### `test/fuzz/TokenFuzz.t.sol`
- **testFuzz_MintAndTransfer**: Token operations with random amounts
- **testFuzz_BurnTokens**: Burn functionality validation
- **testFuzz_TransferWithoutKYC**: KYC requirement enforcement

### `test/fuzz/PropertyFuzz.t.sol`
- **testFuzz_CreateProperty**: Property creation with random parameters
- **testFuzz_RedeemShares**: Share redemption validation
- **testFuzz_FactoryCreateProperty**: Factory pattern testing

## Run Fuzzing

```bash
# Run all fuzz tests with 1000 runs each
forge test test/fuzz/ --fuzz-runs 1000 -vv

# Run specific fuzz test
forge test --match-contract IdentityRegistryFuzzTest --fuzz-runs 5000

# Run with gas reporting
forge test test/fuzz/ --fuzz-runs 1000 --gas-report
```

## Key Fuzzing Targets

- **Input Validation**: Random addresses, amounts, country codes
- **Edge Cases**: Zero values, maximum values, boundary conditions
- **Access Control**: Unauthorized operations with random callers
- **State Consistency**: Contract state after random operations
- **Gas Optimization**: Performance under various input conditions

## Expected Results

All fuzz tests should pass, demonstrating:
- Robust input validation
- Proper access control enforcement
- Consistent state management
- Gas-efficient operations