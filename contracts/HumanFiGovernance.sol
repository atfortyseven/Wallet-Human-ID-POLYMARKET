// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IWorldID {
    function verifyProof(
        uint256 root,
        uint256 group_id,
        uint256 signal_hash,
        uint256 nullifier_hash,
        uint256 external_nullifier_hash,
        uint256[8] calldata proof
    ) external view;
}

contract HumanFiGovernance is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable wldToken;
    IWorldID public immutable worldIdRouter;
    uint256 public immutable externalNullifier;

    mapping(address => uint256) public votingPower;
    mapping(uint256 => bool) public nullifierHasVoted;

    event ZapExecuted(address indexed user, uint256 amount);
    event Voted(address indexed user, uint256 nullifierHash);

    constructor(
        address _wldToken,
        address _worldIdRouter,
        string memory _appId
    ) Ownable(msg.sender) {
        wldToken = IERC20(_wldToken);
        worldIdRouter = IWorldID(_worldIdRouter);
        // Hasheamos el App ID para seguridad consistente
        externalNullifier = abi.decode(abi.encodePacked(keccak256(abi.encodePacked(_appId))), (uint256));
    }

    function zap(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        wldToken.safeTransferFrom(msg.sender, address(this), amount);
        votingPower[msg.sender] += amount;
        emit ZapExecuted(msg.sender, amount);
    }

    function voteWithWorldID(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        require(votingPower[msg.sender] > 0, "No skin in the game (Zap first)");
        require(!nullifierHasVoted[nullifierHash], "Already voted");

        worldIdRouter.verifyProof(
            root,
            1, // Group ID (Orb)
            1, // Signal (Proposal ID fijo para demo)
            nullifierHash,
            externalNullifier,
            proof
        );

        nullifierHasVoted[nullifierHash] = true;
        emit Voted(msg.sender, nullifierHash);
    }
}