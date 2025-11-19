// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Fractionalizer.sol";
import "../src/IdentityRegistry.sol";
import "../src/ComplianceManager.sol";

contract FractionalizerTest is Test {
    Fractionalizer public fractionalizer;
    IdentityRegistry public registry;
    ComplianceManager public compliance;
    
    address public owner = address(this);
    address public user = address(0x1);
    
    function setUp() public {
        registry = new IdentityRegistry();
        compliance = new ComplianceManager(address(registry));
        fractionalizer = new Fractionalizer(address(registry), address(compliance));
        
        // Set up valid identity
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("kyc_data")
        });
        
        registry.attestIdentity(owner, attrs);
        registry.attestIdentity(user, attrs);
        compliance.setJurisdictionAllowed(840, true);
    }
    
    function testCreateProperty() public {
        (uint256 propertyId, address shareToken) = fractionalizer.createProperty(
            "Luxury Apartment NYC",
            "LANYC",
            1000000
        );
        
        assertEq(propertyId, 1);
        assertTrue(shareToken != address(0));
        
        Fractionalizer.Property memory property = fractionalizer.getProperty(propertyId);
        assertEq(property.name, "Luxury Apartment NYC");
        assertEq(property.symbol, "LANYC");
        assertEq(property.totalShares, 1000000);
        assertTrue(property.active);
        
        FlashDeedERC3643 token = FlashDeedERC3643(shareToken);
        assertEq(token.balanceOf(owner), 1000000);
    }
    
    function testRedeemShares() public {
        (uint256 propertyId, address shareToken) = fractionalizer.createProperty(
            "Office Building",
            "OFFICE",
            500000
        );
        
        FlashDeedERC3643 token = FlashDeedERC3643(shareToken);
        token.transfer(user, 100000);
        
        vm.prank(user);
        fractionalizer.redeemShares(propertyId, 50000);
        
        assertEq(token.balanceOf(user), 50000);
    }
    
    function testRedeemInsufficientShares() public {
        (uint256 propertyId,) = fractionalizer.createProperty(
            "Small House",
            "HOUSE",
            100000
        );
        
        vm.prank(user);
        vm.expectRevert("Insufficient shares");
        fractionalizer.redeemShares(propertyId, 1000);
    }
}