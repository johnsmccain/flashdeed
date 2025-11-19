// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IERC3643.sol";
import "./IdentityRegistry.sol";
import "./ComplianceManager.sol";

contract FlashDeedERC3643 is ERC20, Ownable, Pausable, IERC3643 {
    IdentityRegistry private _identityRegistry;
    
    function identityRegistry() external view override returns (address) {
        return address(_identityRegistry);
    }
    ComplianceManager public complianceManager;
    
    event TransferDenied(address indexed from, address indexed to, uint256 amount, string reason);
    event TransferAllowed(address indexed from, address indexed to, uint256 amount);
    
    constructor(
        string memory name,
        string memory symbol,
        address identityRegistryAddr,
        address _complianceManager
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _identityRegistry = IdentityRegistry(identityRegistryAddr);
        complianceManager = ComplianceManager(_complianceManager);
    }
    
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        (bool allowed, string memory reason) = complianceManager.canTransfer(
            address(this),
            from,
            to,
            amount
        );
        
        if (!allowed) {
            emit TransferDenied(from, to, amount, reason);
            revert(reason);
        }
        
        emit TransferAllowed(from, to, amount);
        super._update(from, to, amount);
        
        if (from == address(0)) {
            complianceManager.created(to, amount);
        } else if (to == address(0)) {
            complianceManager.destroyed(from, amount);
        } else {
            complianceManager.transferred(from, to, amount);
        }
    }
    
    function mint(address to, uint256 amount) external override onlyOwner {
        _mint(to, amount);
    }
    
    function burn(address from, uint256 amount) external override onlyOwner {
        _burn(from, amount);
    }
    
    function setIdentityRegistry(address _identityRegistryAddr) external override onlyOwner {
        _identityRegistry = IdentityRegistry(_identityRegistryAddr);
        emit IdentityRegistryAdded(_identityRegistryAddr);
    }
    
    function setComplianceManager(address _complianceManager) external onlyOwner {
        complianceManager = ComplianceManager(_complianceManager);
        emit ComplianceAdded(_complianceManager);
    }
    
    function compliance() external view returns (address) {
        return address(complianceManager);
    }
    
    function pause() external override onlyOwner {
        _pause();
    }
    
    function unpause() external override onlyOwner {
        _unpause();
    }
    
    function setCompliance(address _compliance) external override onlyOwner {
        complianceManager = ComplianceManager(_compliance);
        emit ComplianceAdded(_compliance);
    }
}