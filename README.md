# HumanID.fi Enterprise: The Void Wallet

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Mainnet%20Ready-success)
![Network](https://img.shields.io/badge/network-Base%20Sepolia-blueviolet)
![Audit](https://img.shields.io/badge/security-UUPS%20Upgradeable-secure)

**HumanID.fi** is a sovereign, identity-first predictive market interface built on **PolyMarket** and **World ID**. It bridges the gap between anonymous DeFi and compliant real-world finance using a novel "Proof-of-Humanity" governance model and an AI-driven integrity engine.

---

## Core Architecture (The Crystalline System)

This project implements a **"Glassmorphism" Design System** (Crystalline UI) that reflects the transparency of the underlying blockchain protocols.

### 1. Identity & Compliance Layer 🆔
*   **World ID Integration**: Sybil-resistance via biometric verification (Orb/Device).
*   **Compliance Middleware**: Geo-fencing and sanctions screening (OFAC) using a secure signing backend (`ComplianceManager`).
*   **Identity Tiers**:
    *   👻 **Ghost**: Unverified, read-only.
    *   👤 **Human**: Verified World ID, basic trading limits.
    *   🎩 **Sovereign**: Fully compliant, unbounded access.

### 2. Smart Contract Treasury (Sovereign Vault) 🏛️
*   **UUPS Upgradeable**: Built using `Accessible`, `Pausable`, and `UUPSUpgradeable` patterns for long-term maintainability.
*   **Revenue Flywheel**:
    *   **60% Operations Pool**: Funds ongoing development and relayers.
    *   **40% Sovereign Vault**: Community-governed treasury for buybacks/rewards.
*   **Safety Valves**:
    *   **Pull Payment Pattern**: Prevents denial-of-service in fee distribution.
    *   **Emergency Circuit Breaker**: `EMERGENCY_ROLE` can freeze new deposits without locking user withdrawals (`solo-exit`).

### 3. AI Market Guard (Integrity Engine) 🛡️
*   **Real-time Surveillance**: The `/api/intel/analyze` endpoint monitors market behavior.
*   **Confidence Score**: Weighted algorithm analyzing:
    *   📊 **Volume Metrics**: 60% weight (Detects wash trading/anomalies).
    *   📰 **Sentiment Analysis**: 40% weight (Cross-references news vs. market moves).
*   **Risk Levels**:
    *   `LOW` 🟢: Healthy organic activity.
    *   `MEDIUM` 🟡: Watchlist.
    *   `HIGH` 🟠: Suspicious volatility.
    *   `CRITICAL` 🔴: Circuit breaker trigger candidate.

---

## 🏗️ Technology Stack

| Component | Tech | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14** (App Router) | High-performance React framework. |
| **Styling** | **Tailwind CSS** + **Framer Motion** | Advanced animations and glassmorphism. |
| **Blockchain** | **Base Sepolia** (L2) | Low-cost, robust Ethereum Layer 2. |
| **Contracts** | **Solidity 0.8.22** | Hardhat, OpenZeppelin Upgradeable. |
| **Database** | **PostgreSQL** + **Prisma** | User data, market cache, and risk analytics. |
| **Auth** | **World ID / IDKit** | Privacy-preserving proof of personhood. |
| **Integration** | **Wagmi / Viem** | Type-safe Ethereum interactions. |

---

## 📜 Deployed Framework (Base Sepolia)

| Contract | Address | Type |
| :--- | :--- | :--- |
| **Treasury** | `0x0cD73Dde2Ba408dEDC1ae19b6F211f0A525B15F8` | UUPS Proxy |
| **Governance** | `0xD4CcA25F164Fbf5AFa6ED2a24bEac7bfFED21899` | UUPS Proxy |

> **Note**: These contracts are currently in **Alpha Phase** (Deployer Admin). Phase 2 transfers control to a Gnosis Safe Multisig.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   PostgreSQL
*   WalletConnect Project ID
*   World ID App ID

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/wallet-human-polymarket.git
    cd wallet-human-polymarket
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/humanid"
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_id"
    NEXT_PUBLIC_WLD_APP_ID="your_app_id"
    # ... see .env.example
    ```

4.  **Database & Contracts**
    ```bash
    npx prisma migrate dev
    npx hardhat compile
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 🧪 Testing & Verification

We employ a rigorous **Stress Test Suite** to ensure protocol solvency.

```bash
# Run Security Stress Tests
npx hardhat test test/StressTest.ts
```

**Coverage:**
*   ✅ Fee Splitting Logic (60/40)
*   ✅ Reentrancy Attacks
*   ✅ Unauthorized Upgrades
*   ✅ Emergency Pauses

---

## 🔮 Roadmap to Decentralization

1.  **Alpha (Current)**: Team controls upgrade keys for rapid iteration.
2.  **Beta**: Ownership transferred to **Gnosis Safe (3/5)**.
3.  **Sovereign**: Ownership transferred to `HumanFiGovernance` (Token Voting).

---

*Built with ❤️ for the Sovereign Web.*
