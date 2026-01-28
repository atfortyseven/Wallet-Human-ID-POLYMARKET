# HUMANID.FI // OPSEC MANIFESTO (THE CITADEL)

## 1. The Deployment Vault (Gnosis Safe)
**Status:** MANDATORY
**Threshold:** 2-of-3 or 3-of-5
**Chain:** Base Mainnet

### Authorized Signatories
1.  **Lead Dev (Ledger Nano X):** `0x...`
2.  **Ops Lead (Trezor Model T):** `0x...`
3.  **Cold Storage (Paper/Steel):** `0x...` (Offline Backup)

### Role Separation
*   **DEFAULT_ADMIN_ROLE:** Must be the Gnosis Safe Address.
*   **EMERGENCY_ADMIN_ROLE:** Can be a hot wallet (or bot) for < 5s reaction time. Cannot withdraw funds.

## 2. Deterministic Deployment (CREATE2)
We do not rely on nonces. We use `CREATE2` to ensure our contract addresses are known before deployment and are identical across networks (Sepolia == Mainnet).

### Salt Generation
*   **Prefix:** `HUMANID_V1_`
*   **Factory:** Use generic Singleton Factory (e.g., `0x4e59b44847b379578588920cA78FbF26c0B4956C`)

## 3. Key Management
*   **CI/CD:** No private keys in GitHub/Railways info. Use `process.env.PRIVATE_KEY` only in local/ephemeral contexts.
*   **Deployment:** Use `ledger-live` or `frame.sh` for hardware wallet signing during deploy scripts.

## 4. Emergency Procedures
**Scenario: Hack Detected**
1.  **Trigger:** Monitoring Bot detects >5% TVL outflow.
2.  **Action:** Bot calls `emergencyPause()` on `SafeContracts`.
3.  **Result:** All state-changing functions revert. Protocol is frozen.
4.  **Recovery:** Admin Multisig analyzes, patches, and calls `unpause()`.

> "Trust, but verify. Then Verify again."
