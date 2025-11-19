// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../src/IdentityRegistry.sol";

contract MockKYC {
    IdentityRegistry public immutable registry;
    
    constructor(address _registry) {
        registry = IdentityRegistry(_registry);
    }
    
    function createValidIdentity(address account) external {
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: 840, // USA
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256(abi.encodePacked(account, block.timestamp))
        });
        
        registry.attestIdentity(account, attrs);
    }
    
    function createExpiredIdentity(address account) external {
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp - 1),
            kycHash: keccak256(abi.encodePacked(account, "expired"))
        });
        
        registry.attestIdentity(account, attrs);
    }
    
    function createForeignIdentity(address account, uint16 countryCode) external {
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: countryCode,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256(abi.encodePacked(account, countryCode))
        });
        
        registry.attestIdentity(account, attrs);
    }
}