// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/ComplianceManager.sol";
import "../../src/IdentityRegistry.sol";

contract ComplianceFuzzTest is Test {
    ComplianceManager public compliance;
    IdentityRegistry public registry;
    address public admin = makeAddr("admin");
    address public token = makeAddr("token");

    function setUp() public {
        vm.prank(admin);
        registry = new IdentityRegistry();
        
        vm.prank(admin);
        compliance = new ComplianceManager(address(registry));
    }

    function testFuzz_CanTransfer(
        address from,
        address to,
        uint256 amount,
        uint16 fromCountry,
        uint16 toCountry
    ) public {
        vm.assume(from != address(0) && to != address(0));
        vm.assume(amount > 0);

        // Setup identities
        vm.prank(admin);
        registry.attestIdentity(from, IdentityRegistry.IdentityAttributes({
            countryCode: fromCountry,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("from")
        }));

        vm.prank(admin);
        registry.attestIdentity(to, IdentityRegistry.IdentityAttributes({
            countryCode: toCountry,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("to")
        }));

        // Allow jurisdictions
        vm.prank(admin);
        compliance.setJurisdictionAllowed(fromCountry, true);
        vm.prank(admin);
        compliance.setJurisdictionAllowed(toCountry, true);

        (bool allowed,) = compliance.canTransfer(address(token), from, to, amount);
        assertTrue(allowed);
    }

    function testFuzz_TokenCap(uint32 cap, uint32 amount) public {
        vm.assume(cap > 0);
        address user = makeAddr("user");
        
        vm.prank(admin);
        registry.attestIdentity(user, IdentityRegistry.IdentityAttributes({
            countryCode: 840,
            accredited: 1,
            expiry: uint64(block.timestamp + 365 days),
            kycHash: keccak256("user")
        }));
        
        vm.prank(admin);
        compliance.setJurisdictionAllowed(840, true);
        
        vm.prank(admin);
        compliance.setTokenCap(token, cap);

        (bool allowed,) = compliance.canTransfer(token, address(0), user, amount);
        assertTrue(allowed); // Should always be allowed for minting with valid KYC
    }

    function testFuzz_TokenLock(bool locked) public {
        vm.prank(admin);
        compliance.setTokenLock(token, locked);

        assertEq(compliance.tokenLocks(token), locked);
    }
}