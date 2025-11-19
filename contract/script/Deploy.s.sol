// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/IdentityRegistry.sol";
import "../src/ComplianceManager.sol";
import "../src/Fractionalizer.sol";
import "../src/PropertyFactory.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy IdentityRegistry
        IdentityRegistry identityRegistry = new IdentityRegistry();
        console.log("IdentityRegistry deployed at:", address(identityRegistry));
        
        // Deploy ComplianceManager
        ComplianceManager complianceManager = new ComplianceManager(address(identityRegistry));
        console.log("ComplianceManager deployed at:", address(complianceManager));
        
        // Deploy Fractionalizer
        Fractionalizer fractionalizer = new Fractionalizer(
            address(identityRegistry),
            address(complianceManager)
        );
        console.log("Fractionalizer deployed at:", address(fractionalizer));
        
        // Deploy PropertyFactory
        PropertyFactory propertyFactory = new PropertyFactory(
            address(identityRegistry),
            address(complianceManager)
        );
        console.log("PropertyFactory deployed at:", address(propertyFactory));
        
        // Set up initial compliance rules
        complianceManager.setJurisdictionAllowed(840, true); // USA
        complianceManager.setJurisdictionAllowed(826, true); // UK
        complianceManager.setJurisdictionAllowed(124, true); // Canada
        
        vm.stopBroadcast();
        
        console.log("Deployment completed successfully!");
        console.log("Remember to:");
        console.log("1. Grant KYC_PROVIDER_ROLE to authorized addresses");
        console.log("2. Configure additional compliance rules as needed");
        console.log("3. Verify contracts on Etherscan");
    }
}