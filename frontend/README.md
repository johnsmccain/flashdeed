# FlashDeed Frontend

A production-ready frontend for FlashDeed, an ERC-3643 compliant real estate tokenization platform.

## Features

- **ERC-3643 Compliance**: Built-in KYC and compliance checking for all transactions
- **Real Estate Tokenization**: Create and manage tokenized property investments
- **Wallet Integration**: Connect with MetaMask and other Web3 wallets
- **Real-time Updates**: Live event listening for contract changes
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript support with Viem and Wagmi

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ShadCN UI** for components
- **Wagmi** for Web3 integration
- **Viem** for Ethereum interactions
- **Zustand** for state management
- **React Query** for data fetching

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your contract addresses:
```env
NEXT_PUBLIC_WC_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_COMPLIANCE_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_PROPERTY_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_FRACTIONALIZER_ADDRESS=0x...
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # User dashboard
│   ├── properties/              # Property listings
│   │   └── [address]/          # Property detail pages
│   ├── admin/                   # Admin pages
│   │   └── create-property/    # Property creation
│   └── kyc-required/           # KYC verification page
├── components/                  # React components
│   ├── ui/                     # ShadCN UI components
│   ├── WalletButton.tsx        # Wallet connection
│   ├── IdentityStatus.tsx      # KYC status display
│   ├── PropertyCard.tsx        # Property display card
│   ├── TokenBalance.tsx        # Token balance display
│   ├── TransferModal.tsx       # Token transfer modal
│   ├── ComplianceBadge.tsx     # Compliance status badge
│   ├── CreatePropertyForm.tsx  # Property creation form
│   └── RedemptionForm.tsx      # Share redemption form
└── lib/                        # Utilities and hooks
    ├── contracts.ts            # Contract ABIs and addresses
    ├── wagmi.ts               # Wagmi configuration
    ├── utils.ts               # Utility functions
    ├── state/                 # Zustand stores
    │   ├── useUserStore.ts    # User state management
    │   ├── usePropertyStore.ts # Property state management
    │   └── useIdentityStore.ts # Identity state management
    ├── identity.ts            # Identity contract hooks
    ├── compliance.ts          # Compliance contract hooks
    ├── factory.ts             # Factory contract hooks
    ├── fractionalizer.ts      # Fractionalizer contract hooks
    └── erc3643.ts            # ERC3643 token hooks
```

## Key Features

### 1. Wallet Connection & KYC
- Automatic wallet connection with Wagmi
- Real-time KYC status checking
- Redirect to KYC page if verification required

### 2. Property Management
- View all tokenized properties
- Create new properties (admin only)
- Property detail pages with full information

### 3. Compliance Checking
- Pre-transaction compliance validation
- Real-time transfer eligibility checking
- Clear error messages for denied transactions

### 4. Token Operations
- Transfer tokens between addresses
- Mint/burn tokens (owner only)
- Redeem shares for underlying assets

### 5. Real-time Updates
- Event listeners for all contract events
- Automatic UI updates on blockchain changes
- Live balance and status updates

## Smart Contract Integration

The frontend integrates with 5 main smart contracts:

1. **IdentityRegistry**: KYC verification and identity management
2. **ComplianceManager**: Transfer compliance validation
3. **PropertyFactory**: Property token creation
4. **Fractionalizer**: Property management and redemption
5. **FlashDeedERC3643**: ERC-3643 compliant property tokens

## Development

### Adding New Components

1. Create component in `components/` directory
2. Use TypeScript for type safety
3. Follow ShadCN UI patterns for consistency
4. Add proper error handling

### Adding New Contract Hooks

1. Add ABI to `lib/contracts.ts`
2. Create hook file in `lib/` directory
3. Use Wagmi hooks for contract interactions
4. Add proper error handling and loading states

### State Management

- Use Zustand for global state
- Keep state minimal and focused
- Use React Query for server state
- Avoid unnecessary re-renders

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details