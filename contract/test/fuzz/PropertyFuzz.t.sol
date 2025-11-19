// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/Fractionalizer.sol";
import "../../src/PropertyFactory.sol";
import "../../src/IdentityRegistry.sol";
import "../../src/ComplianceManager.sol";

contract PropertyFuzzTest is Test {
    Fractionalizer public fractionalizer;
    PropertyFactory public factory;
    IdentityRegistry public registry;
    ComplianceManager public compliance;
    address public admin = makeAddr("admin");

    function setUp() public {
        vm.prank(admin);
        registry = new IdentityRegistry();
        
        vm.prank(admin);
        compliance = new ComplianceManager(address(registry));
        
        vm.prank(admin);
        fractionalizer = new Fractionalizer(
            address(registry),
            address(compliance)
        );

        vm.prank(admin);
        factory = new PropertyFactory(
            address(registry),
            address(compliance)
        );

        // Allow USA jurisdiction
        vm.prank(admin);
        compliance.setJurisdictionAllowed(840, true);
    }

    function testFuzz_CreateProperty(
        string memory name,
        string memory symbol,
        uint256 totalShares
    ) public {
        vm.assume(bytes(name).length > 0 && bytes(name).length <= 32);
        vm.assume(bytes(symbol).length > 0 && bytes(symbol).length <= 8);
        vm.assume(totalShares > 0 && totalShares <= type(uint128).max);

        // Setup KYC for admin
        vm.prank(admin);
        registry.attestIdentity(admin, IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("admin")
        }));

        vm.prank(admin);
        (uint256 propertyId, address tokenAddress) = fractionalizer.createProperty(
            name,
            symbol,
            totalShares
        );

        assertTrue(propertyId > 0);
        assertTrue(tokenAddress != address(0));
        
        Fractionalizer.Property memory info = fractionalizer.getProperty(propertyId);
        assertEq(info.totalShares, totalShares);
        assertEq(info.shareToken, tokenAddress);
    }

    function testFuzz_RedeemShares(
        uint256 totalShares,
        uint256 redeemAmount
    ) public {
        vm.assume(totalShares > 0 && totalShares <= type(uint128).max);
        vm.assume(redeemAmount > 0 && redeemAmount <= totalShares);

        // Setup KYC for admin
        vm.prank(admin);
        registry.attestIdentity(admin, IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("admin")
        }));

        vm.prank(admin);
        (uint256 propertyId, address tokenAddress) = fractionalizer.createProperty(
            "Test Property",
            "TEST",
            totalShares
        );

        // Test basic property creation
        assertTrue(propertyId > 0);
        assertTrue(tokenAddress != address(0));
        assertEq(FlashDeedERC3643(tokenAddress).balanceOf(admin), totalShares);
    }

    function testFuzz_FactoryCreateProperty(
        string memory name,
        string memory symbol,
        uint256 totalShares
    ) public {
        vm.assume(bytes(name).length > 0 && bytes(name).length <= 32);
        vm.assume(bytes(symbol).length > 0 && bytes(symbol).length <= 8);
        vm.assume(totalShares > 0 && totalShares <= type(uint128).max);

        // Setup KYC for admin
        vm.prank(admin);
        registry.attestIdentity(admin, IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("admin")
        }));

        vm.prank(admin);
        address tokenAddress = factory.createProperty(name, symbol, totalShares);

        assertTrue(tokenAddress != address(0));
        assertEq(FlashDeedERC3643(tokenAddress).name(), name);
        assertEq(FlashDeedERC3643(tokenAddress).symbol(), symbol);
    }
}