// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IdentityRegistry.sol";

contract ComplianceManager is Ownable {
    IdentityRegistry public identityRegistry;
    
    mapping(uint16 => bool) public allowedJurisdictions;
    mapping(address => uint256) public tokenCaps;
    mapping(address => bool) public tokenLocks;
    
    event ComplianceRuleUpdated(string indexed ruleType, bytes32 indexed key, bool value);
    
    constructor(address _identityRegistry) Ownable(msg.sender) {
        identityRegistry = IdentityRegistry(_identityRegistry);
    }
    
    function canTransfer(
        address token,
        address from,
        address to,
        uint256 amount
    ) external view returns (bool allowed, string memory reason) {
        return _canTransfer(token, from, to, amount);
    }
    
    function _canTransfer(
        address token,
        address from,
        address to,
        uint256 amount
    ) internal view returns (bool allowed, string memory reason) {
        if (from == address(0)) {
            if (!identityRegistry.hasValidIdentity(to)) {
                return (false, "Recipient lacks valid identity");
            }
            return (true, "");
        }
        
        if (to == address(0)) {
            if (!identityRegistry.hasValidIdentity(from)) {
                return (false, "Sender lacks valid identity");
            }
            return (true, "");
        }
        
        if (!identityRegistry.hasValidIdentity(from)) {
            return (false, "Sender lacks valid identity");
        }
        
        if (!identityRegistry.hasValidIdentity(to)) {
            return (false, "Recipient lacks valid identity");
        }
        
        if (tokenLocks[token]) {
            return (false, "Token transfers locked");
        }
        
        try identityRegistry.getIdentity(to) returns (IdentityRegistry.IdentityAttributes memory toAttrs) {
            if (!allowedJurisdictions[toAttrs.countryCode]) {
                return (false, "Recipient jurisdiction not allowed");
            }
        } catch {
            return (false, "Cannot verify recipient jurisdiction");
        }
        
        uint256 cap = tokenCaps[token];
        if (cap > 0 && amount > cap) {
            return (false, "Transfer exceeds token cap");
        }
        
        return (true, "");
    }
    
    function setJurisdictionAllowed(uint16 countryCode, bool allowed) external onlyOwner {
        allowedJurisdictions[countryCode] = allowed;
        emit ComplianceRuleUpdated("JURISDICTION", bytes32(uint256(countryCode)), allowed);
    }
    
    function setTokenCap(address token, uint256 cap) external onlyOwner {
        tokenCaps[token] = cap;
        emit ComplianceRuleUpdated("CAP", bytes32(uint256(uint160(token))), cap > 0);
    }
    
    function setTokenLock(address token, bool locked) external onlyOwner {
        tokenLocks[token] = locked;
        emit ComplianceRuleUpdated("LOCK", bytes32(uint256(uint160(token))), locked);
    }
    
    function setIdentityRegistry(address _identityRegistry) external onlyOwner {
        identityRegistry = IdentityRegistry(_identityRegistry);
    }
    
    function transferred(address from, address to, uint256 amount) external {
        // Hook for compliance tracking
    }
    
    function created(address to, uint256 amount) external {
        // Hook for compliance tracking
    }
    
    function destroyed(address from, uint256 amount) external {
        // Hook for compliance tracking
    }
}