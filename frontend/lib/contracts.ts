export const CONTRACT_ADDRESSES = {
  IDENTITY_REGISTRY: process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS as `0x${string}`,
  COMPLIANCE_MANAGER: process.env.NEXT_PUBLIC_COMPLIANCE_MANAGER_ADDRESS as `0x${string}`,
  PROPERTY_FACTORY: process.env.NEXT_PUBLIC_PROPERTY_FACTORY_ADDRESS as `0x${string}`,
  FRACTIONALIZER: process.env.NEXT_PUBLIC_FRACTIONALIZER_ADDRESS as `0x${string}`,
}

export const IDENTITY_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'hasValidIdentity',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getIdentity',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ 
      type: 'tuple',
      components: [
        { name: 'countryCode', type: 'uint16' },
        { name: 'accredited', type: 'uint8' },
        { name: 'expiry', type: 'uint64' },
        { name: 'kycHash', type: 'bytes32' }
      ]
    }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'attestIdentity',
    inputs: [
      { name: 'account', type: 'address' },
      { 
        name: 'attrs',
        type: 'tuple',
        components: [
          { name: 'countryCode', type: 'uint16' },
          { name: 'accredited', type: 'uint8' },
          { name: 'expiry', type: 'uint64' },
          { name: 'kycHash', type: 'bytes32' }
        ]
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'IdentityAttested',
    inputs: [
      { name: 'account', type: 'address', indexed: true },
      { name: 'identityId', type: 'uint256', indexed: true }
    ],
  },
  {
    type: 'event',
    name: 'IdentityRevoked',
    inputs: [
      { name: 'account', type: 'address', indexed: true },
      { name: 'identityId', type: 'uint256', indexed: true }
    ],
  },
] as const

export const COMPLIANCE_MANAGER_ABI = [
  {
    type: 'function',
    name: 'canTransfer',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [
      { name: 'allowed', type: 'bool' },
      { name: 'reason', type: 'string' }
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setJurisdictionAllowed',
    inputs: [
      { name: 'countryCode', type: 'uint16' },
      { name: 'allowed', type: 'bool' }
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

export const PROPERTY_FACTORY_ABI = [
  {
    type: 'function',
    name: 'createProperty',
    inputs: [
      { name: 'tokenName', type: 'string' },
      { name: 'tokenSymbol', type: 'string' },
      { name: 'totalShares', type: 'uint256' }
    ],
    outputs: [{ name: 'token', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getDeployedTokens',
    inputs: [],
    outputs: [{ type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isDeployedToken',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'PropertyTokenCreated',
    inputs: [
      { name: 'token', type: 'address', indexed: true },
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'creator', type: 'address', indexed: true }
    ],
  },
] as const

export const FRACTIONALIZER_ABI = [
  {
    type: 'function',
    name: 'getProperty',
    inputs: [{ name: 'propertyId', type: 'uint256' }],
    outputs: [{
      type: 'tuple',
      components: [
        { name: 'name', type: 'string' },
        { name: 'symbol', type: 'string' },
        { name: 'totalShares', type: 'uint256' },
        { name: 'shareToken', type: 'address' },
        { name: 'active', type: 'bool' }
      ]
    }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'redeemShares',
    inputs: [
      { name: 'propertyId', type: 'uint256' },
      { name: 'shares', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'SharesRedeemed',
    inputs: [
      { name: 'propertyId', type: 'uint256', indexed: true },
      { name: 'account', type: 'address', indexed: true },
      { name: 'shares', type: 'uint256' }
    ],
  },
] as const

export const ERC3643_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'mint',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'burn',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'TransferAllowed',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256' }
    ],
  },
  {
    type: 'event',
    name: 'TransferDenied',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256' },
      { name: 'reason', type: 'string' }
    ],
  },
] as const