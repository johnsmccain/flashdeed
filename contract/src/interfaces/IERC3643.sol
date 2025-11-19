// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC3643 is IERC20 {
    function identityRegistry() external view returns (address);
    function compliance() external view returns (address);
    
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    
    function setIdentityRegistry(address identityRegistry) external;
    function setCompliance(address compliance) external;
    
    function pause() external;
    function unpause() external;
    
    event IdentityRegistryAdded(address indexed identityRegistry);
    event ComplianceAdded(address indexed compliance);
}