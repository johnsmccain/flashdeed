// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/FlashDeedERC3643.sol";
import "../src/IdentityRegistry.sol";
import "../src/ComplianceManager.sol";

contract FlashDeedERC3643Test is Test {
    FlashDeedERC3643 public token;
    IdentityRegistry public registry;
    ComplianceManager public compliance;
    
    address public owner = address(this);
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    
    function setUp() public {
        registry = new IdentityRegistry();
        compliance = new ComplianceManager(address(registry));
        token = new FlashDeedERC3643("FlashDeed Property", "FDP", address(registry), address(compliance));
        
        // Set up valid identities
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("kyc_data")
        });
        
        registry.attestIdentity(user1, attrs);
        registry.attestIdentity(user2, attrs);
        
        // Allow USA jurisdiction
        compliance.setJurisdictionAllowed(840, true);
    }
    
    function testMintAndTransfer() public {
        token.mint(user1, 1000);
        assertEq(token.balanceOf(user1), 1000);
        
        vm.prank(user1);
        token.transfer(user2, 500);
        
        assertEq(token.balanceOf(user1), 500);
        assertEq(token.balanceOf(user2), 500);
    }
    
    function testTransferWithoutKYC() public {
        address user3 = address(0x3);
        token.mint(user1, 1000);
        
        vm.prank(user1);
        vm.expectRevert("Recipient lacks valid identity");
        token.transfer(user3, 500);
    }
    
    function testBurn() public {
        token.mint(user1, 1000);
        token.burn(user1, 300);
        
        assertEq(token.balanceOf(user1), 700);
    }
    
    function testTransferWithTokenLock() public {
        token.mint(user1, 1000);
        compliance.setTokenLock(address(token), true);
        
        vm.prank(user1);
        vm.expectRevert("Token transfers locked");
        token.transfer(user2, 500);
    }
}