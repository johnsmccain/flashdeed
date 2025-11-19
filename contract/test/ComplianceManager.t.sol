// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ComplianceManager.sol";
import "../src/IdentityRegistry.sol";

contract ComplianceManagerTest is Test {
    ComplianceManager public compliance;
    IdentityRegistry public registry;
    
    address public owner = address(this);
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    address public token = address(0x3);
    
    function setUp() public {
        registry = new IdentityRegistry();
        compliance = new ComplianceManager(address(registry));
        
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("kyc_data")
        });
        
        registry.attestIdentity(user1, attrs);
        registry.attestIdentity(user2, attrs);
        compliance.setJurisdictionAllowed(840, true);
    }
    
    function testCanTransferValid() public {
        (bool allowed, string memory reason) = compliance.canTransfer(token, user1, user2, 1000);
        assertTrue(allowed);
        assertEq(reason, "");
    }
    
    function testCanTransferInvalidJurisdiction() public {
        compliance.setJurisdictionAllowed(840, false);
        
        (bool allowed, string memory reason) = compliance.canTransfer(token, user1, user2, 1000);
        assertFalse(allowed);
        assertEq(reason, "Recipient jurisdiction not allowed");
    }
    
    function testCanTransferTokenLocked() public {
        compliance.setTokenLock(token, true);
        
        (bool allowed, string memory reason) = compliance.canTransfer(token, user1, user2, 1000);
        assertFalse(allowed);
        assertEq(reason, "Token transfers locked");
    }
    
    function testCanTransferExceedsCap() public {
        compliance.setTokenCap(token, 500);
        
        (bool allowed, string memory reason) = compliance.canTransfer(token, user1, user2, 1000);
        assertFalse(allowed);
        assertEq(reason, "Transfer exceeds token cap");
    }
}