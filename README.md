# WasteInsured dApp 🗑️♻️

# DEMO Link https://www.canva.com/design/DAGz3xgOnrA/DMsw0fDwtI7eOyKTPK8eFw/edit?utm_content=DAGz3xgOnrA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

A decentralized waste management platform built on Filecoin blockchain that combines environmental sustainability with cutting-edge Web3 technology. WasteInsured enables secure, transparent, and incentivized waste tracking and management through smart contracts and IPFS storage.

## 🌟 Overview

WasteInsured is a comprehensive dApp that revolutionizes waste management by:

- **Decentralized Waste Tracking**: Record and track waste data on the blockchain
- **IPFS Storage Integration**: Store detailed waste information on Filecoin's decentralized storage
- **Smart Contract Management**: Automated waste validation, payment processing, and insurance claims
- **Multi-Role Support**: Waste producers, administrators, and hospitals can interact seamlessly
- **USDFC Payment System**: Pay for storage and services using Filecoin's stablecoin
- **Real-time Dashboard**: Monitor waste statistics, environmental impact, and financial metrics

## 🚀 Features

### Core Functionality

- **Waste Recording**: Record waste data with geolocation, weight, type, and images
- **Smart Contract Integration**: Deploy and interact with WasteInsured smart contracts
- **IPFS Storage**: Store waste metadata and images on Filecoin's decentralized storage
- **Payment Processing**: Handle USDFC payments for waste management services
- **Dashboard Analytics**: Real-time waste statistics and environmental impact metrics
- **Multi-User Support**: Different interfaces for waste producers, administrators, and hospitals

### Technical Features

- **Web3 Integration**: RainbowKit wallet connection for Filecoin networks
- **Filecoin Synapse SDK**: Seamless integration with Filecoin's storage marketplace
- **Responsive Design**: Mobile-first UI with Tailwind CSS and Framer Motion
- **TypeScript**: Full type safety and developer experience
- **Real-time Updates**: Live data synchronization across all components

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- A web3 wallet (MetaMask, WalletConnect, etc.)
- Basic understanding of React, TypeScript, and Web3
- Get testnet tokens:
  - tFIL tokens on Filecoin Calibration: [Faucet](https://faucet.calibnet.chainsafe-fil.io/funds.html)
  - USDFC tokens on Filecoin Calibration: [Faucet](https://forest-explorer.chainsafe.dev/faucet/calibnet_usdfc)

## 🛠️ Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/Amity808/fs-upload-dapp
cd fs-upload-dapp
```

2. **Install dependencies:**

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

3. **Run the development server:**

```bash
pnpm dev
# or
npm run dev
```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the dApp.

5. **Connect your wallet:**

- Switch to Filecoin Calibration testnet
- Connect your wallet using the connect button
- Ensure you have tFIL and USDFC tokens for testing

## 🏗️ Architecture

### Smart Contracts

- **WasteInsured.sol**: Main smart contract managing waste records, payments, and hospital data
- **Multi-token Support**: Handles USDFC and other ERC-20 tokens for payments
- **Role-based Access**: Different permissions for waste producers, administrators, and hospitals
- **IPFS Integration**: Links blockchain records to detailed data stored on Filecoin

### Frontend Components

- **Dashboard**: Real-time analytics and waste management overview
- **Waste Recording**: Form-based interface for recording new waste entries
- **Records Management**: View, filter, and manage existing waste records
- **Storage Management**: Monitor Filecoin storage usage and payments
- **File Upload**: Upload waste images and documents to IPFS

### Key Hooks

- `useBalances`: Query FIL, USDFC, and storage usage balances
- `usePayment`: Handle USDFC payments for storage and services
- `useFileUpload`: Upload files to Filecoin via Synapse SDK
- `useWasteContract`: Interact with WasteInsured smart contract
- `useDatasets`: Manage and view uploaded datasets

## 🔧 Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Web3**: Wagmi, RainbowKit, Ethers.js
- **Blockchain**: Filecoin Calibration/Mainnet
- **Storage**: Filecoin Synapse SDK, IPFS
- **Payments**: USDFC stablecoin
- **Development**: ESLint, Prettier, Turbopack

## 📚 Usage Guide

### For Waste Producers

1. Connect your wallet to the dApp
2. Navigate to "Record Waste" tab
3. Fill in waste details (type, weight, location, images)
4. Submit the record to the blockchain
5. Pay required fees using USDFC

### For Waste Administrators

1. Access the dashboard for waste analytics
2. Validate waste records from producers
3. Monitor environmental impact metrics
4. Manage payment processing and insurance claims

### For Hospitals

1. Register hospital information in the system
2. View waste records and analytics
3. Process insurance claims and payments
4. Monitor waste management compliance

## 🔗 Learn More

- [Filecoin Synapse SDK](https://github.com/FilOzone/synapse-sdk)
- [USDFC Token Documentation](https://docs.secured.finance/usdfc-stablecoin/getting-started)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://www.rainbowkit.com)
- [Filecoin Documentation](https://docs.filecoin.io/)
- [IPFS Documentation](https://docs.ipfs.tech/)

## 🤝 Contributing

We welcome contributions! Please feel free to:

- Submit bug reports and feature requests
- Fork the repository and create pull requests
- Improve documentation and tutorials
- Add new waste management features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌱 Environmental Impact

WasteInsured contributes to environmental sustainability by:

- Promoting transparent waste tracking and management
- Encouraging proper waste disposal and recycling
- Reducing environmental impact through data-driven insights
- Supporting circular economy principles through blockchain technology

---

**Built with ❤️ for a sustainable future** 🌍♻️
