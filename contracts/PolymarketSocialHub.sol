// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PolymarketSocialHub
 * @notice Central Hub for SocialFi (Tips) and Referral Proxy with fee capture.
 */
contract PolymarketSocialHub is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    address public treasury;
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Fee Config
    uint256 public tipFeeBps = 500;      // 5% Platform Fee
    uint256 public referralFeeBps = 10;  // 0.1% Trade Fee

    event TipSent(address indexed from, address indexed to, uint256 netAmount, uint256 fee);
    event ReferralTrade(address indexed user, uint256 volume, uint256 fee);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    constructor(address _usdc, address _treasury) Ownable(msg.sender) {
        require(_usdc != address(0) && _treasury != address(0), "Invalid addresses");
        usdc = IERC20(_usdc);
        treasury = _treasury;
    }

    // --- MODULE 1: TIPS ---
    function sendTip(address _trader, uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        uint256 fee = (_amount * tipFeeBps) / FEE_DENOMINATOR;
        uint256 netAmount = _amount - fee;

        usdc.safeTransferFrom(msg.sender, address(this), _amount);
        
        if (fee > 0) {
            usdc.safeTransfer(treasury, fee);
        }
        usdc.safeTransfer(_trader, netAmount);

        emit TipSent(msg.sender, _trader, netAmount, fee);
    }

    // --- MODULE 2: REFERRAL PROXY ---
    // Note: ensure 'forceApprove' is available in your OpenZeppelin version. 
    // If using <5.0, use safeApprove with 0 first or just approve.
    function executeProxyTrade(address _exchange, uint256 _amount, bytes calldata _data) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        uint256 fee = (_amount * referralFeeBps) / FEE_DENOMINATOR;
        uint256 netAmount = _amount - fee;

        // 1. Collect Funds
        usdc.safeTransferFrom(msg.sender, address(this), _amount);
        
        // 2. Fee to Treasury
        if (fee > 0) {
            usdc.safeTransfer(treasury, fee);
        }

        // 3. Execute on Polymarket
        // Using forceApprove if using OZ 5.x, otherwise use approve/safeApprove logic
        usdc.forceApprove(_exchange, netAmount);
        
        (bool success, ) = _exchange.call(_data);
        require(success, "Polymarket execution failed");

        emit ReferralTrade(msg.sender, _amount, fee);
    }

    // --- ADMIN ---
    function setFees(uint256 _tipFee, uint256 _refFee) external onlyOwner {
        require(_tipFee <= 1000 && _refFee <= 200, "Fees too high");
        tipFeeBps = _tipFee;
        referralFeeBps = _refFee;
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid address");
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }
}
