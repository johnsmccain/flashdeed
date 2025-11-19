// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./FlashDeedERC3643.sol";

contract Fractionalizer is Ownable {
    struct Property {
        string name;
        string symbol;
        uint256 totalShares;
        address shareToken;
        bool active;
    }
    
    mapping(uint256 => Property) public properties;
    mapping(address => uint256) public tokenToPropertyId;
    uint256 private _nextPropertyId = 1;
    
    address public identityRegistry;
    address public complianceManager;
    
    event PropertyCreated(
        uint256 indexed propertyId,
        string name,
        string symbol,
        uint256 totalShares,
        address shareToken
    );
    event SharesRedeemed(uint256 indexed propertyId, address indexed account, uint256 shares);
    
    constructor(address _identityRegistry, address _complianceManager) Ownable(msg.sender) {
        identityRegistry = _identityRegistry;
        complianceManager = _complianceManager;
    }
    
    function createProperty(
        string memory name,
        string memory symbol,
        uint256 totalShares
    ) external onlyOwner returns (uint256 propertyId, address shareToken) {
        propertyId = _nextPropertyId++;
        
        FlashDeedERC3643 token = new FlashDeedERC3643(
            name,
            symbol,
            identityRegistry,
            complianceManager
        );
        
        shareToken = address(token);
        
        properties[propertyId] = Property({
            name: name,
            symbol: symbol,
            totalShares: totalShares,
            shareToken: shareToken,
            active: true
        });
        
        tokenToPropertyId[shareToken] = propertyId;
        
        token.mint(msg.sender, totalShares);
        token.transferOwnership(address(this));
        
        emit PropertyCreated(propertyId, name, symbol, totalShares, shareToken);
    }
    
    function redeemShares(uint256 propertyId, uint256 shares) external {
        Property storage property = properties[propertyId];
        require(property.active, "Property not active");
        
        FlashDeedERC3643 token = FlashDeedERC3643(property.shareToken);
        require(token.balanceOf(msg.sender) >= shares, "Insufficient shares");
        
        token.burn(msg.sender, shares);
        
        emit SharesRedeemed(propertyId, msg.sender, shares);
    }
    
    function getProperty(uint256 propertyId) external view returns (Property memory) {
        return properties[propertyId];
    }
    
    function setPropertyActive(uint256 propertyId, bool active) external onlyOwner {
        properties[propertyId].active = active;
    }
    
    function setRegistries(address _identityRegistry, address _complianceManager) external onlyOwner {
        identityRegistry = _identityRegistry;
        complianceManager = _complianceManager;
    }
}