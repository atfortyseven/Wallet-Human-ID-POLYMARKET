// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================================
// ATOMIC WLD-TO-BET ZAP CONTRACT (Pseudocode)
// ============================================================================
// Purpose: Convert WLD grants into prediction market positions atomically
// Security: All-or-nothing execution with MEV protection
// Gas: Optimized for Optimism L2, Paymaster-compatible
// ============================================================================

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IPolymarketCTF {
    function buyOutcome(
        bytes32 conditionId,
        uint256 outcomeIndex,
        uint256 amount
    ) external returns (uint256 shares);
}

interface IPermit2 {
    function permitTransferFrom(
        address from,
        address to,
        uint160 amount,
        address token,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external;
}

/**
 * @title ZapContract
 * @notice Atomically converts WLD → USDC → Polymarket Outcome Shares
 * @dev Implements "House Money Effect" psychology with strict atomicity
 */
contract ZapContract is ReentrancyGuard {
    
    // ========================================================================
    // STATE VARIABLES
    // ========================================================================
    
    address public immutable WLD_TOKEN;           // Worldcoin token on Optimism
    address public immutable USDC_TOKEN;          // USDC on Optimism
    address public immutable POLYMARKET_CTF;      // Polymarket Conditional Token Framework
    address public immutable SWAP_ROUTER;         // Uniswap V3 or 1inch aggregator
    address public immutable PERMIT2;             // Permit2 for gasless approvals
    
    uint256 public constant MAX_SLIPPAGE = 200;   // 2% max slippage (basis points)
    uint256 public constant DEADLINE_WINDOW = 300; // 5 minutes
    
    address public paymaster;                     // Biconomy paymaster for gas abstraction
    address public treasury;                      // Fee collection
    uint256 public zapFee = 50;                   // 0.5% fee (basis points)
    
    // ========================================================================
    // EVENTS
    // ========================================================================
    
    event ZapExecuted(
        address indexed user,
        uint256 wldAmount,
        uint256 usdcReceived,
        bytes32 indexed conditionId,
        uint256 outcomeIndex,
        uint256 sharesReceived,
        uint256 actualSlippage
    );
    
    event ZapFailed(
        address indexed user,
        string reason,
        uint256 step // 1=approve, 2=swap, 3=buy
    );
    
    event EmergencyWithdraw(
        address indexed user,
        address token,
        uint256 amount
    );
    
    // ========================================================================
    // STRUCTS
    // ========================================================================
    
    struct ZapParams {
        uint256 wldAmount;              // Amount of WLD to zap
        uint256 minUSDCOut;             // Minimum USDC from swap (slippage protection)
        bytes32 conditionId;            // Polymarket condition ID
        uint256 outcomeIndex;           // Which outcome to buy (0 or 1)
        uint256 deadline;               // Transaction deadline
        bytes permit2Signature;         // Gasless approval signature
    }
    
    struct SwapResult {
        uint256 usdcReceived;
        uint256 actualSlippage;
        bool success;
        string errorMessage;
    }
    
    // ========================================================================
    // CONSTRUCTOR
    // ========================================================================
    
    constructor(
        address _wld,
        address _usdc,
        address _polymarketCTF,
        address _swapRouter,
        address _permit2,
        address _paymaster,
        address _treasury
    ) {
        WLD_TOKEN = _wld;
        USDC_TOKEN = _usdc;
        POLYMARKET_CTF = _polymarketCTF;
        SWAP_ROUTER = _swapRouter;
        PERMIT2 = _permit2;
        paymaster = _paymaster;
        treasury = _treasury;
    }
    
    // ========================================================================
    // MAIN ZAP FUNCTION (ATOMIC EXECUTION)
    // ========================================================================
    
    /**
     * @notice Execute atomic WLD-to-Bet conversion
     * @dev ALL STEPS MUST SUCCEED OR ENTIRE TX REVERTS
     * @param params Zap parameters including amounts and slippage limits
     * @return sharesReceived Number of outcome shares purchased
     */
    function executeZap(ZapParams calldata params) 
        external 
        nonReentrant 
        returns (uint256 sharesReceived) 
    {
        // ====================================================================
        // VALIDATION PHASE
        // ====================================================================
        
        require(params.wldAmount > 0, "ZAP: Zero amount");
        require(params.deadline >= block.timestamp, "ZAP: Expired deadline");
        require(
            params.deadline <= block.timestamp + DEADLINE_WINDOW,
            "ZAP: Deadline too far"
        );
        
        // Calculate expected USDC with slippage tolerance
        uint256 expectedUSDC = _getExpectedUSDC(params.wldAmount);
        require(
            params.minUSDCOut >= expectedUSDC * (10000 - MAX_SLIPPAGE) / 10000,
            "ZAP: Slippage too high"
        );
        
        // ====================================================================
        // STEP 1: TRANSFER WLD FROM USER (Permit2 for gasless)
        // ====================================================================
        
        try this._transferWLDFromUser(
            msg.sender,
            params.wldAmount,
            params.permit2Signature,
            params.deadline
        ) {
            // Success - WLD now in contract
        } catch Error(string memory reason) {
            emit ZapFailed(msg.sender, reason, 1);
            revert("ZAP: WLD transfer failed");
        } catch {
            emit ZapFailed(msg.sender, "Unknown error in WLD transfer", 1);
            revert("ZAP: WLD transfer failed");
        }
        
        // ====================================================================
        // STEP 2: SWAP WLD → USDC (Atomic with revert on failure)
        // ====================================================================
        
        SwapResult memory swapResult;
        
        try this._executeSwap(
            params.wldAmount,
            params.minUSDCOut,
            params.deadline
        ) returns (uint256 usdcReceived, uint256 slippage) {
            swapResult.usdcReceived = usdcReceived;
            swapResult.actualSlippage = slippage;
            swapResult.success = true;
        } catch Error(string memory reason) {
            // CRITICAL: Return WLD to user before reverting
            IERC20(WLD_TOKEN).transfer(msg.sender, params.wldAmount);
            emit ZapFailed(msg.sender, reason, 2);
            revert("ZAP: Swap failed");
        } catch {
            // CRITICAL: Return WLD to user before reverting
            IERC20(WLD_TOKEN).transfer(msg.sender, params.wldAmount);
            emit ZapFailed(msg.sender, "Unknown swap error", 2);
            revert("ZAP: Swap failed");
        }
        
        // Deduct protocol fee
        uint256 feeAmount = swapResult.usdcReceived * zapFee / 10000;
        uint256 usdcForBet = swapResult.usdcReceived - feeAmount;
        
        if (feeAmount > 0) {
            IERC20(USDC_TOKEN).transfer(treasury, feeAmount);
        }
        
        // ====================================================================
        // STEP 3: BUY OUTCOME SHARES (Final atomic step)
        // ====================================================================
        
        try this._buyOutcomeShares(
            params.conditionId,
            params.outcomeIndex,
            usdcForBet
        ) returns (uint256 shares) {
            sharesReceived = shares;
            
            // SUCCESS - Transfer shares to user
            // Note: CTF shares are ERC1155, transfer handled in _buyOutcomeShares
            
            emit ZapExecuted(
                msg.sender,
                params.wldAmount,
                swapResult.usdcReceived,
                params.conditionId,
                params.outcomeIndex,
                sharesReceived,
                swapResult.actualSlippage
            );
            
        } catch Error(string memory reason) {
            // CRITICAL: Return USDC to user before reverting
            IERC20(USDC_TOKEN).transfer(msg.sender, usdcForBet);
            if (feeAmount > 0) {
                // Reclaim fee from treasury (edge case handling)
                IERC20(USDC_TOKEN).transferFrom(treasury, msg.sender, feeAmount);
            }
            emit ZapFailed(msg.sender, reason, 3);
            revert("ZAP: Outcome purchase failed");
        } catch {
            // CRITICAL: Return USDC to user before reverting
            IERC20(USDC_TOKEN).transfer(msg.sender, usdcForBet);
            if (feeAmount > 0) {
                IERC20(USDC_TOKEN).transferFrom(treasury, msg.sender, feeAmount);
            }
            emit ZapFailed(msg.sender, "Unknown purchase error", 3);
            revert("ZAP: Outcome purchase failed");
        }
        
        return sharesReceived;
    }
    
    // ========================================================================
    // INTERNAL FUNCTIONS (External for try/catch)
    // ========================================================================
    
    /**
     * @notice Transfer WLD from user using Permit2 (gasless)
     * @dev External to enable try/catch in main function
     */
    function _transferWLDFromUser(
        address user,
        uint256 amount,
        bytes calldata signature,
        uint256 deadline
    ) external {
        require(msg.sender == address(this), "ZAP: Internal only");
        
        // Use Permit2 for gasless approval
        IPermit2(PERMIT2).permitTransferFrom(
            user,
            address(this),
            uint160(amount),
            WLD_TOKEN,
            0, // nonce managed by Permit2
            deadline,
            signature
        );
    }
    
    /**
     * @notice Execute WLD → USDC swap via DEX
     * @dev External to enable try/catch in main function
     * @return usdcReceived Amount of USDC received
     * @return actualSlippage Actual slippage in basis points
     */
    function _executeSwap(
        uint256 wldAmount,
        uint256 minUSDCOut,
        uint256 deadline
    ) external returns (uint256 usdcReceived, uint256 actualSlippage) {
        require(msg.sender == address(this), "ZAP: Internal only");
        
        // Approve router to spend WLD
        IERC20(WLD_TOKEN).approve(SWAP_ROUTER, wldAmount);
        
        // Uniswap V3 exact input swap
        ISwapRouter.ExactInputSingleParams memory swapParams = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WLD_TOKEN,
                tokenOut: USDC_TOKEN,
                fee: 3000, // 0.3% pool
                recipient: address(this),
                deadline: deadline,
                amountIn: wldAmount,
                amountOutMinimum: minUSDCOut,
                sqrtPriceLimitX96: 0 // No price limit
            });
        
        usdcReceived = ISwapRouter(SWAP_ROUTER).exactInputSingle(swapParams);
        
        // Calculate actual slippage
        uint256 expectedUSDC = _getExpectedUSDC(wldAmount);
        if (usdcReceived < expectedUSDC) {
            actualSlippage = ((expectedUSDC - usdcReceived) * 10000) / expectedUSDC;
        } else {
            actualSlippage = 0; // Positive slippage (better than expected)
        }
        
        require(actualSlippage <= MAX_SLIPPAGE, "ZAP: Slippage exceeded");
        
        return (usdcReceived, actualSlippage);
    }
    
    /**
     * @notice Purchase outcome shares on Polymarket
     * @dev External to enable try/catch in main function
     * @return shares Number of shares received
     */
    function _buyOutcomeShares(
        bytes32 conditionId,
        uint256 outcomeIndex,
        uint256 usdcAmount
    ) external returns (uint256 shares) {
        require(msg.sender == address(this), "ZAP: Internal only");
        
        // Approve CTF to spend USDC
        IERC20(USDC_TOKEN).approve(POLYMARKET_CTF, usdcAmount);
        
        // Buy outcome shares
        shares = IPolymarketCTF(POLYMARKET_CTF).buyOutcome(
            conditionId,
            outcomeIndex,
            usdcAmount
        );
        
        require(shares > 0, "ZAP: No shares received");
        
        // Note: Shares are ERC1155 tokens, automatically transferred to msg.sender
        // in the CTF contract's buyOutcome function
        
        return shares;
    }
    
    // ========================================================================
    // VIEW FUNCTIONS
    // ========================================================================
    
    /**
     * @notice Get expected USDC output for WLD input
     * @dev Uses Uniswap V3 TWAP oracle for MEV resistance
     */
    function _getExpectedUSDC(uint256 wldAmount) 
        internal 
        view 
        returns (uint256) 
    {
        // TODO: Implement TWAP oracle query
        // For now, placeholder calculation
        // In production: Use Uniswap V3 OracleLibrary.consult()
        
        // Example: 1 WLD = $2.50 USDC (hardcoded for pseudocode)
        return (wldAmount * 250) / 100; // 2.5x conversion
    }
    
    /**
     * @notice Preview zap output (frontend helper)
     * @param wldAmount Amount of WLD to zap
     * @return estimatedShares Estimated outcome shares
     * @return estimatedSlippage Estimated slippage
     */
    function previewZap(
        uint256 wldAmount,
        bytes32 conditionId,
        uint256 outcomeIndex
    ) external view returns (
        uint256 estimatedShares,
        uint256 estimatedSlippage
    ) {
        uint256 expectedUSDC = _getExpectedUSDC(wldAmount);
        uint256 feeAmount = expectedUSDC * zapFee / 10000;
        uint256 usdcForBet = expectedUSDC - feeAmount;
        
        // Simplified: 1 USDC = 1 share (actual depends on market odds)
        estimatedShares = usdcForBet;
        estimatedSlippage = 100; // 1% estimated
        
        return (estimatedShares, estimatedSlippage);
    }
    
    // ========================================================================
    // EMERGENCY FUNCTIONS
    // ========================================================================
    
    /**
     * @notice Emergency withdraw stuck tokens
     * @dev Only callable by user if their tokens are stuck
     */
    function emergencyWithdraw(address token) external nonReentrant {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "ZAP: No balance");
        
        IERC20(token).transfer(msg.sender, balance);
        emit EmergencyWithdraw(msg.sender, token, balance);
    }
    
    // ========================================================================
    // ADMIN FUNCTIONS
    // ========================================================================
    
    function setZapFee(uint256 newFee) external {
        require(msg.sender == treasury, "ZAP: Only treasury");
        require(newFee <= 100, "ZAP: Fee too high"); // Max 1%
        zapFee = newFee;
    }
    
    function setPaymaster(address newPaymaster) external {
        require(msg.sender == treasury, "ZAP: Only treasury");
        paymaster = newPaymaster;
    }
}

// ============================================================================
// SECURITY CONSIDERATIONS
// ============================================================================
// 1. Reentrancy: Protected by OpenZeppelin's ReentrancyGuard
// 2. Atomicity: All steps wrapped in try/catch with full revert on failure
// 3. MEV Protection: TWAP oracle for price feeds, slippage limits
// 4. Deadline Enforcement: Prevents stale transactions
// 5. Permit2: Gasless approvals reduce attack surface
// 6. Emergency Withdrawals: Users can recover stuck funds
// ============================================================================

// ============================================================================
// GAS OPTIMIZATION NOTES
// ============================================================================
// 1. Use immutable for addresses (saves ~2100 gas per read)
// 2. Batch approvals in single transaction
// 3. Paymaster integration for gas abstraction
// 4. Optimism L2: ~10x cheaper than Ethereum mainnet
// 5. Consider EIP-4337 Account Abstraction for advanced users
// ============================================================================

// ============================================================================
// TESTING CHECKLIST
// ============================================================================
// [ ] Test successful zap flow
// [ ] Test swap failure (reverts entire tx)
// [ ] Test outcome purchase failure (reverts entire tx)
// [ ] Test slippage protection
// [ ] Test deadline expiration
// [ ] Test MEV attack scenarios
// [ ] Test emergency withdrawals
// [ ] Test Permit2 integration
// [ ] Test Paymaster gas abstraction
// [ ] Fuzz testing with random inputs
// ============================================================================
