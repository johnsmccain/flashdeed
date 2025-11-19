// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/FlashDeedERC3643.sol";
import "../../src/IdentityRegistry.sol";
import "../../src/ComplianceManager.sol";

contract EdgeCaseFuzzTest is Test {
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
            "Edge Test",
            "EDGE",
            address(registry),
            address(compliance)
        );

        vm.prank(admin);
        compliance.setJurisdictionAllowed(840, true);
    }

    function testFuzz_ZeroAmountTransfer(address to) public {
        vm.assume(to != address(0));

        vm.prank(admin);
        registry.attestIdentity(admin, IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("admin")
        }));

        vm.prank(admin);
        registry.attestIdentity(to, IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("to")
        }));

        vm.prank(admin);
        token.mint(admin, 1000);

        // Zero amount transfer should succeed
        vm.prank(admin);
        token.transfer(to, 0);
    }

    function testFuzz_MaxValueOperations(address user) public {
        vm.assume(user != address(0));

        vm.prank(admin);
        registry.attestIdentity(user, IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: type(uint64).max,
            kycHash: keccak256("user")
        }));

        // Test with maximum safe values
        uint256 maxAmount = type(uint128).max;
        
        vm.prank(admin);
        token.mint(user, maxAmount);

        assertEq(token.balanceOf(user), maxAmount);
    }

    function testFuzz_UnauthorizedAccess(address attacker, address victim) public {
        vm.assume(attacker != admin && attacker != address(0));
        vm.assume(victim != address(0));

        // Attacker tries to attest identity
        vm.prank(attacker);
        vm.expectRevert();
        registry.attestIdentity(victim, IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("victim")
        }));

        // Attacker tries to mint tokens
        vm.prank(attacker);
        vm.expectRevert();
        token.mint(victim, 1000);
    }
}