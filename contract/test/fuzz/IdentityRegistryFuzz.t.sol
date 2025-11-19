// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/IdentityRegistry.sol";

contract IdentityRegistryFuzzTest is Test {
    IdentityRegistry public registry;
    address public admin = makeAddr("admin");

    function setUp() public {
        vm.prank(admin);
        registry = new IdentityRegistry();
    }

    function testFuzz_AttestIdentity(
        address user,
        uint16 countryCode,
        uint8 accredited,
        uint64 expiry,
        bytes32 kycHash
    ) public {
        vm.assume(user != address(0));
        vm.assume(expiry > block.timestamp);
        vm.assume(accredited <= 1);

        vm.prank(admin);
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: countryCode,
            accredited: accredited,
            expiry: expiry,
            kycHash: kycHash
        });

        registry.attestIdentity(user, attrs);
        
        IdentityRegistry.IdentityAttributes memory stored = registry.getIdentity(user);
        assertEq(stored.countryCode, countryCode);
        assertEq(stored.accredited, accredited);
        assertEq(stored.expiry, expiry);
        assertEq(stored.kycHash, kycHash);
    }

    function testFuzz_ExpiredIdentity(address user) public {
        vm.assume(user != address(0));
        uint64 pastExpiry = uint64(block.timestamp - 1);

        vm.prank(admin);
        vm.expectRevert("Identity expired");
        registry.attestIdentity(user, IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: pastExpiry,
            kycHash: keccak256("test")
        }));
    }

    function testFuzz_RevokeIdentity(address user) public {
        vm.assume(user != address(0));

        vm.prank(admin);
        IdentityRegistry.IdentityAttributes memory attrs = IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("test")
        });

        registry.attestIdentity(user, attrs);
        assertTrue(registry.hasValidIdentity(user));

        vm.prank(admin);
        registry.revokeIdentity(user);
        assertFalse(registry.hasValidIdentity(user));
    }
}