# Food Security DApp

A simple decentralized **Food Supply Chain application** built using **MetaMask, Solidity, Truffle, and React**.  
This DApp allows users to manage food batches, track their status, approve batches, update temperatures, and monitor deliveries across the supply chain, all directly via **MetaMask** without a backend server.

---

## Features

- Connect with MetaMask and display your wallet address.  
- **Farmer**: Create a new food batch with crop type, quantity, and initial temperature.  
- **Manager**: Approve batches and update batch temperature.  
- **Transporter**: Pick approved batches for delivery.  
- **Distributor**: Receive picked batches.  
- **Consumer**: Confirm delivery of received batches.  
- **Status Tab**: View all batches and their current status in the supply chain.  
- Tab-based interface for clean UI and easy role-based operations.  

---

## Folder Structure

```
food-security-dapp/
├─ contracts/ # Solidity smart contract
├─ migrations/ # Truffle migrations
├─ build/ # Compiled contract ABI & JSON
├─ src/ # React frontend source code
├─ public/ # HTML template
├─ package.json
└─ README.md
```

---


---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)  
- [npm](https://www.npmjs.com/)  
- [MetaMask](https://metamask.io/) browser extension  
- [Truffle](https://www.trufflesuite.com/truffle) (`npm install -g truffle`)  
- [Ganache](https://www.trufflesuite.com/ganache) for local blockchain development (`npm install -g truffle`)  

---

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd food-security-dapp
```

2. Install dependencies:

```bash
npm install
```

3. Compile and migrate the smart contract to Ganache:

```bash
truffle compile
truffle migrate --network development --reset
```

> Ensure Ganache is running and the network ID matches your Truffle config.

4. Update `src/web3.js` (or equivalent) if your contract address changes after migration.

---

## Running the Frontend

```bash
npm run dev
```

1. Open the URL provided by Vite (usually http://localhost:5173)
2. Click Connect Wallet to connect MetaMask.
3. Use the tabs to perform role-specific actions:
   -> Farmer – Create batches
   ->Manager – Approve and update temperature
   ->Transporter – Pick batches
   ->Distributor – Receive batches
   ->Consumer – Confirm delivery
   ->Status – View all batches and current status

---

## How It Works

1. Farmer – Creates a food batch with crop type, quantity, and temperature.
2. Manager – Approves batches and can update temperature during storage.
3. Transporter – Picks approved batches for distribution.
4. Distributor – Receives transported batches.
5. Consumer – Confirms delivery of batches.
6. Status Tab – Provides a full overview of all batches and their current stage in the supply chain.

All transactions are directly signed via MetaMask and executed on the blockchain.
---

## Notes
 
- No backend server is required; the frontend interacts directly with the smart contract.  
- Make sure to use the correct **network in MetaMask** (Ganache local network).  

---

## License

MIT License
