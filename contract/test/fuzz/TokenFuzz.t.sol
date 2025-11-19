// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/FlashDeedERC3643.sol";
import "../../src/IdentityRegistry.sol";
import "../../src/ComplianceManager.sol";

contract TokenFuzzTest is Test {
    FlashDeedERC3643 public token;
    IdentityRegistry public registry;
    ComplianceManager public compliance;
    address public admin = makeAddr("admin");

    function setUp() public {
        vm.prank(admin);
        registry = new IdentityRegistry();
        
        vm.prank(admin);
        compliance = new ComplianceManager(address(registry));
        
        vm.prank(admin);
        token = new FlashDeedERC3643(
            "Test Property",
            "TEST",
            address(registry),
            address(compliance)
        );

        // Allow USA jurisdiction
        vm.prank(admin);
        compliance.setJurisdictionAllowed(840, true);
    }

    function testFuzz_MintAndTransfer(
        address to,
        uint256 amount
    ) public {
        vm.assume(to != address(0));
        vm.assume(amount > 0 && amount <= type(uint128).max);

        // Setup KYC
        vm.prank(admin);
        registry.attestIdentity(to, IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("test")
        }));

        vm.prank(admin);
        token.mint(to, amount);

        assertEq(token.balanceOf(to), amount);
    }

    function testFuzz_BurnTokens(
        address holder,
        uint256 mintAmount,
        uint256 burnAmount
    ) public {
        vm.assume(holder != address(0));
        vm.assume(mintAmount > 0 && mintAmount <= type(uint128).max);
        vm.assume(burnAmount <= mintAmount);

        // Setup KYC
        vm.prank(admin);
        registry.attestIdentity(holder, IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("test")
        }));

        vm.prank(admin);
        token.mint(holder, mintAmount);

        vm.prank(admin);
        token.burn(holder, burnAmount);

        assertEq(token.balanceOf(holder), mintAmount - burnAmount);
    }

    function testFuzz_TransferWithoutKYC(
        address from,
        address to,
        uint256 amount
    ) public {
        vm.assume(from != address(0) && to != address(0) && from != to);
        vm.assume(amount > 0 && amount <= type(uint128).max);

        // Only setup KYC for from
        vm.prank(admin);
        registry.attestIdentity(from, IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("from")
        }));

        vm.prank(admin);
        token.mint(from, amount);

        // Transfer should fail - to has no KYC
        vm.prank(from);
        vm.expectRevert();
        token.transfer(to, amount);
    }
}