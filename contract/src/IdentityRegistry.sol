// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract IdentityRegistry is AccessControl {
    bytes32 public constant KYC_PROVIDER_ROLE = keccak256("KYC_PROVIDER_ROLE");
    
    struct IdentityAttributes {
        uint16 countryCode;
        uint8 accredited;
        uint64 expiry;
        bytes32 kycHash;
    }
    
    mapping(address => uint256) public addressToIdentityId;
    mapping(uint256 => IdentityAttributes) public identities;
    uint256 private _nextIdentityId = 1;
    
    event IdentityAttested(address indexed account, uint256 indexed identityId);
    event IdentityRevoked(address indexed account, uint256 indexed identityId);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(KYC_PROVIDER_ROLE, msg.sender);
    }
    
    function attestIdentity(address account, IdentityAttributes memory attrs) 
        external 
        onlyRole(KYC_PROVIDER_ROLE) 
    {
        require(attrs.expiry > block.timestamp, "Identity expired");
        
        uint256 identityId = _nextIdentityId++;
        addressToIdentityId[account] = identityId;
        identities[identityId] = attrs;
        
        emit IdentityAttested(account, identityId);
    }
    
    function revokeIdentity(address account) external onlyRole(KYC_PROVIDER_ROLE) {
        uint256 identityId = addressToIdentityId[account];
        require(identityId != 0, "No identity found");
        
        delete identities[identityId];
        delete addressToIdentityId[account];
        
        emit IdentityRevoked(account, identityId);
    }
    
    function getIdentity(address account) external view returns (IdentityAttributes memory) {
        uint256 identityId = addressToIdentityId[account];
        require(identityId != 0, "No identity found");
        return identities[identityId];
    }
    
    function hasValidIdentity(address account) external view returns (bool) {
        uint256 identityId = addressToIdentityId[account];
        if (identityId == 0) return false;
        return identities[identityId].expiry > block.timestamp;
    }
}