// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PropertyFactory.sol";
import "../src/IdentityRegistry.sol";
import "../src/ComplianceManager.sol";

contract PropertyFactoryTest is Test {
    PropertyFactory public factory;
    IdentityRegistry public registry;
    ComplianceManager public compliance;
    
    address public owner = address(this);
    
    function setUp() public {
        registry = new IdentityRegistry();
        compliance = new ComplianceManager(address(registry));
        factory = new PropertyFactory(address(registry), address(compliance));
        
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("kyc_data")
        });
        
        registry.attestIdentity(owner, attrs);
        compliance.setJurisdictionAllowed(840, true);
    }
    
    function testCreateProperty() public {
        address token = factory.createProperty("Test Property", "TEST", 1000000);
        
        assertTrue(token != address(0));
        assertTrue(factory.isDeployedToken(token));
        assertEq(factory.getDeployedTokensCount(), 1);
        
        FlashDeedERC3643 tokenContract = FlashDeedERC3643(token);
        assertEq(tokenContract.name(), "Test Property");
        assertEq(tokenContract.symbol(), "TEST");
        assertEq(tokenContract.balanceOf(owner), 1000000);
        assertEq(tokenContract.owner(), owner);
    }
    
    function testMultipleProperties() public {
        address token1 = factory.createProperty("Property 1", "PROP1", 500000);
        address token2 = factory.createProperty("Property 2", "PROP2", 750000);
        
        assertEq(factory.getDeployedTokensCount(), 2);
        
        address[] memory tokens = factory.getDeployedTokens();
        assertEq(tokens[0], token1);
        assertEq(tokens[1], token2);
    }
}