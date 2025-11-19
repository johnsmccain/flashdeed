// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./FlashDeedERC3643.sol";

contract PropertyFactory is Ownable {
    address public immutable identityRegistry;
    address public immutable complianceManager;
    
    address[] public deployedTokens;
    mapping(address => bool) public isDeployedToken;
    
    event PropertyTokenCreated(
        address indexed token,
        string name,
        string symbol,
        address indexed creator
    );
    
    constructor(address _identityRegistry, address _complianceManager) Ownable(msg.sender) {
        identityRegistry = _identityRegistry;
        complianceManager = _complianceManager;
    }
    
    function createProperty(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 totalShares
    ) external returns (address token) {
        FlashDeedERC3643 newToken = new FlashDeedERC3643(
            tokenName,
            tokenSymbol,
            identityRegistry,
            complianceManager
        );
        
        token = address(newToken);
        deployedTokens.push(token);
        isDeployedToken[token] = true;
        
        newToken.mint(msg.sender, totalShares);
        newToken.transferOwnership(msg.sender);
        
        emit PropertyTokenCreated(token, tokenName, tokenSymbol, msg.sender);
    }
    
    function getDeployedTokens() external view returns (address[] memory) {
        return deployedTokens;
    }
    
    function getDeployedTokensCount() external view returns (uint256) {
        return deployedTokens.length;
    }
}