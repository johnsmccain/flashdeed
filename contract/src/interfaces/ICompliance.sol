// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICompliance {
    function canTransfer(address from, address to, uint256 amount) external view returns (bool);
    
    function transferred(address from, address to, uint256 amount) external;
    function created(address to, uint256 amount) external;
    function destroyed(address from, uint256 amount) external;
    
    function addTokenAgent(address agent) external;
    function removeTokenAgent(address agent) external;
    function isTokenAgent(address agent) external view returns (bool);
    
    event TokenAgentAdded(address indexed agent);
    event TokenAgentRemoved(address indexed agent);
}