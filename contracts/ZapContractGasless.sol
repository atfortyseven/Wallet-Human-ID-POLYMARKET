// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ZapContract.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/// @title ZapContractGasless
/// @author Polymarket Wallet Team
/// @notice Gasless version of ZapContract using EIP-712 meta-transactions
/// @dev Users sign zap intents off-chain, relayer executes on-chain
/// @custom:security-contact security@polymarketwallet.com
contract ZapContractGasless is ZapContract, EIP712 {
    using ECDSA for bytes32;

    // ============================================================================
    // STATE VARIABLES
    // ============================================================================

    /// @notice Nonce tracking for replay protection
    mapping(address => uint256) public nonces;

    /// @notice EIP-712 typehash for Zap struct
    bytes32 public constant ZAP_TYPEHASH = keccak256(
        "Zap(address user,uint256 wldAmount,uint256 minUSDC,bytes32 conditionId,uint256 outcomeIndex,uint256 minSharesOut,uint256 nonce,uint256 deadline)"
    );

    // ============================================================================
    // EVENTS
    // ============================================================================

    /// @notice Emitted when a gasless zap is executed
    /// @param user The user who signed the zap
    /// @param relayer The relayer who executed the transaction
    /// @param nonce The nonce used
    event GaslessZapExecuted(
        address indexed user,
        address indexed relayer,
        uint256 nonce
    );

    // ============================================================================
    // ERRORS
    // ============================================================================

    error InvalidSignature();
    error InvalidNonce();
    error SignatureExpired();

    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================

    /// @notice Initializes the ZapContractGasless
    /// @param _wld WLD token address
    /// @param _usdc USDC token address
    /// @param _ctfExchange Polymarket CTF Exchange address
    /// @param _swapRouter Uniswap V3 Swap Router address
    /// @param _permit2 Permit2 address (can be address(0) if not using)
    /// @param _treasury Treasury address for fee collection
    constructor(
        address _wld,
        address _usdc,
        address _ctfExchange,
        address _swapRouter,
        address _permit2,
        address _treasury
    ) 
        ZapContract(_wld, _usdc, _ctfExchange, _swapRouter, _permit2, _treasury)
        EIP712("ZapContractGasless", "1")
    {}

    // ============================================================================
    // GASLESS ZAP FUNCTION
    // ============================================================================

    /// @notice Execute a zap using a user's signature (gasless for user)
    /// @dev Relayer pays gas, user pays nothing
    /// @param user The user who signed the zap intent
    /// @param wldAmount Amount of WLD tokens to zap
    /// @param minUSDC Minimum USDC to receive from swap
    /// @param conditionId Polymarket condition ID
    /// @param outcomeIndex Outcome index to purchase (0 or 1)
    /// @param minSharesOut Minimum shares to receive
    /// @param deadline Signature expiration timestamp
    /// @param signature EIP-712 signature from user
    /// @return sharesReceived Amount of outcome shares received
    function executeZapWithSignature(
        address user,
        uint256 wldAmount,
        uint256 minUSDC,
        bytes32 conditionId,
        uint256 outcomeIndex,
        uint256 minSharesOut,
        uint256 deadline,
        bytes calldata signature
    ) external nonReentrant whenNotPaused returns (uint256 sharesReceived) {
        // ====================================================================
        // VALIDATION
        // ====================================================================

        if (block.timestamp > deadline) revert SignatureExpired();
        if (wldAmount == 0) revert InvalidAmount();
        if (outcomeIndex > 1) revert InvalidAmount();

        // Get current nonce for user
        uint256 currentNonce = nonces[user];

        // ====================================================================
        // VERIFY SIGNATURE
        // ====================================================================

        // Construct EIP-712 hash
        bytes32 structHash = keccak256(
            abi.encode(
                ZAP_TYPEHASH,
                user,
                wldAmount,
                minUSDC,
                conditionId,
                outcomeIndex,
                minSharesOut,
                currentNonce,
                deadline
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = digest.recover(signature);

        if (signer != user) revert InvalidSignature();

        // Increment nonce to prevent replay attacks
        nonces[user]++;

        // ====================================================================
        // EXECUTE ZAP
        // ====================================================================

        // Transfer WLD from user to this contract
        // User must have approved this contract to spend WLD
        IERC20(WLD_TOKEN).safeTransferFrom(user, address(this), wldAmount);

        // Swap WLD → USDC
        IERC20(WLD_TOKEN).safeApprove(SWAP_ROUTER, wldAmount);
        
        uint256 usdcReceived;
        try ISwapRouter(SWAP_ROUTER).exactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                tokenIn: WLD_TOKEN,
                tokenOut: USDC_TOKEN,
                fee: POOL_FEE,
                recipient: address(this),
                deadline: deadline,
                amountIn: wldAmount,
                amountOutMinimum: minUSDC,
                sqrtPriceLimitX96: 0
            })
        ) returns (uint256 amount) {
            usdcReceived = amount;
        } catch {
            IERC20(WLD_TOKEN).safeApprove(SWAP_ROUTER, 0);
            revert SwapFailed();
        }

        IERC20(WLD_TOKEN).safeApprove(SWAP_ROUTER, 0);

        if (usdcReceived < minUSDC) revert SlippageTooHigh();

        // Deduct protocol fee
        uint256 protocolFee = (usdcReceived * protocolFeeBps) / BPS_DENOMINATOR;
        uint256 usdcForShares = usdcReceived - protocolFee;

        if (protocolFee > 0) {
            IERC20(USDC_TOKEN).safeTransfer(treasury, protocolFee);
        }

        // Buy outcome shares
        IERC20(USDC_TOKEN).safeApprove(CTF_EXCHANGE, usdcForShares);
        
        try ICTFExchange(CTF_EXCHANGE).buyFromMinter(
            conditionId,
            outcomeIndex,
            usdcForShares
        ) returns (uint256 shares) {
            sharesReceived = shares;
        } catch {
            IERC20(USDC_TOKEN).safeApprove(CTF_EXCHANGE, 0);
            revert SharePurchaseFailed();
        }

        IERC20(USDC_TOKEN).safeApprove(CTF_EXCHANGE, 0);

        if (sharesReceived < minSharesOut) revert InsufficientOutput();

        // Return any dust to user (not relayer)
        uint256 wldDust = IERC20(WLD_TOKEN).balanceOf(address(this));
        if (wldDust > 0) {
            IERC20(WLD_TOKEN).safeTransfer(user, wldDust);
        }

        uint256 usdcDust = IERC20(USDC_TOKEN).balanceOf(address(this));
        if (usdcDust > 0) {
            IERC20(USDC_TOKEN).safeTransfer(user, usdcDust);
        }

        // ====================================================================
        // EMIT EVENTS
        // ====================================================================

        emit ZapExecuted(
            user,
            wldAmount,
            usdcReceived,
            conditionId,
            outcomeIndex,
            sharesReceived,
            protocolFee
        );

        emit GaslessZapExecuted(user, msg.sender, currentNonce);

        return sharesReceived;
    }

    // ============================================================================
    // VIEW FUNCTIONS
    // ============================================================================

    /// @notice Get the current nonce for a user
    /// @param user The user address
    /// @return The current nonce
    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }

    /// @notice Get the EIP-712 domain separator
    /// @return The domain separator
    function getDomainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    /// @notice Compute the digest for a zap intent
    /// @dev Useful for frontend to verify what they're signing
    /// @param user The user address
    /// @param wldAmount Amount of WLD
    /// @param minUSDC Minimum USDC
    /// @param conditionId Condition ID
    /// @param outcomeIndex Outcome index
    /// @param minSharesOut Minimum shares
    /// @param nonce Nonce
    /// @param deadline Deadline
    /// @return The EIP-712 digest
    function getZapDigest(
        address user,
        uint256 wldAmount,
        uint256 minUSDC,
        bytes32 conditionId,
        uint256 outcomeIndex,
        uint256 minSharesOut,
        uint256 nonce,
        uint256 deadline
    ) external view returns (bytes32) {
        bytes32 structHash = keccak256(
            abi.encode(
                ZAP_TYPEHASH,
                user,
                wldAmount,
                minUSDC,
                conditionId,
                outcomeIndex,
                minSharesOut,
                nonce,
                deadline
            )
        );
        return _hashTypedDataV4(structHash);
    }
}
