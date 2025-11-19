// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/IdentityRegistry.sol";
import "../src/ComplianceManager.sol";
import "../src/PropertyFactory.sol";
import "../src/Fractionalizer.sol";

contract DeployAll is Script {
    function run() external {
        vm.startBroadcast();
        
        // Deploy IdentityRegistry
        IdentityRegistry identityRegistry = new IdentityRegistry();
        console.log("IdentityRegistry deployed at:", address(identityRegistry));
        
        // Deploy ComplianceManager
        ComplianceManager complianceManager = new ComplianceManager(address(identityRegistry));
        console.log("ComplianceManager deployed at:", address(complianceManager));
        
        // Deploy PropertyFactory
        PropertyFactory propertyFactory = new PropertyFactory(address(identityRegistry), address(complianceManager));
        console.log("PropertyFactory deployed at:", address(propertyFactory));
        
        // Deploy Fractionalizer
        Fractionalizer fractionalizer = new Fractionalizer(address(identityRegistry), address(complianceManager));
        console.log("Fractionalizer deployed at:", address(fractionalizer));
        
        // Set up some basic compliance rules
        complianceManager.setJurisdictionAllowed(1, true); // US
        complianceManager.setJurisdictionAllowed(826, true); // UK
        
        vm.stopBroadcast();
    }
}