// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IIdentityRegistry {
    struct Identity {
        bool exists;
        uint16 investorCountry;
        bytes32[] keys;
    }
    
    function registerIdentity(address user, Identity calldata identity) external;
    function deleteIdentity(address user) external;
    function updateIdentity(address user, Identity calldata identity) external;
    
    function isVerified(address user) external view returns (bool);
    function investorCountry(address user) external view returns (uint16);
    function identity(address user) external view returns (Identity memory);
    
    event IdentityRegistered(address indexed investmentToken, address indexed investor, uint16 country);
    event IdentityRemoved(address indexed investmentToken, address indexed investor, uint16 country);
    event IdentityUpdated(address indexed investmentToken, address indexed investor, uint16 country);
}