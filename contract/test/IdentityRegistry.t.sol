// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/IdentityRegistry.sol";

contract IdentityRegistryTest is Test {
    IdentityRegistry public registry;
    address public kycProvider = address(0x1);
    address public user = address(0x2);
    
    function setUp() public {
        registry = new IdentityRegistry();
        registry.grantRole(registry.KYC_PROVIDER_ROLE(), kycProvider);
    }
    
    function testAttestIdentity() public {
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: 840, // USA
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("kyc_data")
        });
        
        vm.prank(kycProvider);
        registry.attestIdentity(user, attrs);
        
        assertTrue(registry.hasValidIdentity(user));
        
        IdentityRegistry.IdentityAttributes memory stored = registry.getIdentity(user);
        assertEq(stored.countryCode, 840);
        assertEq(stored.accredited, 1);
    }
    
    function testRevokeIdentity() public {
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("kyc_data")
        });
        
        vm.prank(kycProvider);
        registry.attestIdentity(user, attrs);
        
        vm.prank(kycProvider);
        registry.revokeIdentity(user);
        
        assertFalse(registry.hasValidIdentity(user));
    }
    
    function testExpiredIdentity() public {
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp - 1),
            kycHash: keccak256("kyc_data")
        });
        
        vm.prank(kycProvider);
        vm.expectRevert("Identity expired");
        registry.attestIdentity(user, attrs);
    }
    
    function testUnauthorizedAttestation() public {
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("kyc_data")
        });
        
        vm.prank(user);
        vm.expectRevert();
        registry.attestIdentity(user, attrs);
    }
}