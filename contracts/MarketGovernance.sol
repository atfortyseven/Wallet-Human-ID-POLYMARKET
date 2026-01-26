// ============================================================================
// MARKET GOVERNANCE CONTRACT (Pseudocode)
// ============================================================================
// Purpose: Sybil-resistant market creation with Merkle-based royalties
// Architecture: Off-chain voting + on-chain settlement
// ============================================================================

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IWorldIDVerifier {
    function verifyProof(
        uint256 root,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external view;
}

/**
 * @title MarketGovernance
 * @notice Sybil-resistant market creation with pull-based royalties
 * @dev Implements "1 Person = 1 Vote" via World ID
 */
contract MarketGovernance is ReentrancyGuard {
    
    // ========================================================================
    // STATE VARIABLES
    // ========================================================================
    
    IWorldIDVerifier public immutable worldId;
    IERC20 public immutable usdc;
    
    address public treasury;
    uint256 public votingThreshold = 100; // Minimum votes to approve
    uint256 public votingPeriod = 7 days;
    
    // Merkle distribution tracking
    mapping(bytes32 => bool) public merkleRootPublished;
    mapping(bytes32 => mapping(address => bool)) public hasClaimed;
    
    // Proposal tracking (minimal on-chain storage)
    mapping(bytes32 => ProposalState) public proposals;
    
    struct ProposalState {
        address creator;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool approved;
        bool executed;
        uint256 totalRoyalties;
    }
    
    // ========================================================================
    // EVENTS
    // ========================================================================
    
    event ProposalCreated(
        bytes32 indexed proposalId,
        address indexed creator,
        uint256 deadline
    );
    
    event VoteCast(
        bytes32 indexed proposalId,
        uint256 nullifierHash,
        bool support
    );
    
    event ProposalApproved(bytes32 indexed proposalId);
    
    event MerkleRootPublished(
        bytes32 indexed merkleRoot,
        uint256 totalAmount,
        uint256 periodEnd
    );
    
    event RoyaltyClaimed(
        address indexed creator,
        bytes32 indexed merkleRoot,
        uint256 amount
    );
    
    // ========================================================================
    // PROPOSAL CREATION
    // ========================================================================
    
    /**
     * @notice Create market proposal (requires World ID)
     * @dev Most data stored off-chain, only hash on-chain
     */
    function createProposal(
        bytes32 proposalId,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        // Verify World ID (orb level)
        _verifyWorldID(nullifierHash, proposalId, proof);
        
        require(proposals[proposalId].creator == address(0), "Proposal exists");
        
        proposals[proposalId] = ProposalState({
            creator: msg.sender,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + votingPeriod,
            approved: false,
            executed: false,
            totalRoyalties: 0
        });
        
        emit ProposalCreated(proposalId, msg.sender, block.timestamp + votingPeriod);
    }
    
    // ========================================================================
    // VOTING (Off-chain aggregation, on-chain settlement)
    // ========================================================================
    
    /**
     * @notice Cast vote (World ID verified)
     * @dev Called by backend after collecting signatures
     */
    function castVote(
        bytes32 proposalId,
        uint256 nullifierHash,
        bool support,
        uint256[8] calldata proof
    ) external {
        ProposalState storage proposal = proposals[proposalId];
        
        require(block.timestamp <= proposal.deadline, "Voting ended");
        require(!proposal.approved, "Already approved");
        
        // Verify World ID
        _verifyWorldID(nullifierHash, proposalId, proof);
        
        // Update vote count
        if (support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }
        
        emit VoteCast(proposalId, nullifierHash, support);
        
        // Auto-approve if threshold met
        if (proposal.votesFor >= votingThreshold) {
            proposal.approved = true;
            emit ProposalApproved(proposalId);
        }
    }
    
    /**
     * @notice Batch vote settlement (gas optimization)
     * @dev Backend submits multiple votes in single tx
     */
    function batchCastVotes(
        bytes32[] calldata proposalIds,
        uint256[] calldata nullifierHashes,
        bool[] calldata supports,
        uint256[8][] calldata proofs
    ) external {
        require(
            proposalIds.length == nullifierHashes.length &&
            proposalIds.length == supports.length &&
            proposalIds.length == proofs.length,
            "Array length mismatch"
        );
        
        for (uint256 i = 0; i < proposalIds.length; i++) {
            castVote(proposalIds[i], nullifierHashes[i], supports[i], proofs[i]);
        }
    }
    
    // ========================================================================
    // ROYALTY DISTRIBUTION (Merkle Tree - Pull Pattern)
    // ========================================================================
    
    /**
     * @notice Publish weekly Merkle root (admin only)
     * @dev Root generated off-chain from accumulated fees
     */
    function publishMerkleRoot(
        bytes32 merkleRoot,
        uint256 totalAmount,
        uint256 periodEnd
    ) external {
        require(msg.sender == treasury, "Only treasury");
        require(!merkleRootPublished[merkleRoot], "Root already published");
        
        merkleRootPublished[merkleRoot] = true;
        
        emit MerkleRootPublished(merkleRoot, totalAmount, periodEnd);
    }
    
    /**
     * @notice Claim royalties (pull pattern)
     * @dev User provides Merkle proof to claim rewards
     */
    function claimRoyalty(
        bytes32 merkleRoot,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external nonReentrant {
        require(merkleRootPublished[merkleRoot], "Invalid root");
        require(!hasClaimed[merkleRoot][msg.sender], "Already claimed");
        
        // Verify Merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(
            MerkleProof.verify(merkleProof, merkleRoot, leaf),
            "Invalid proof"
        );
        
        // Mark as claimed
        hasClaimed[merkleRoot][msg.sender] = true;
        
        // Transfer USDC
        require(usdc.transfer(msg.sender, amount), "Transfer failed");
        
        emit RoyaltyClaimed(msg.sender, merkleRoot, amount);
    }
    
    /**
     * @notice Batch claim multiple periods
     * @dev Gas optimization for users with multiple unclaimed periods
     */
    function batchClaimRoyalties(
        bytes32[] calldata merkleRoots,
        uint256[] calldata amounts,
        bytes32[][] calldata merkleProofs
    ) external nonReentrant {
        require(
            merkleRoots.length == amounts.length &&
            merkleRoots.length == merkleProofs.length,
            "Array length mismatch"
        );
        
        uint256 totalClaim = 0;
        
        for (uint256 i = 0; i < merkleRoots.length; i++) {
            bytes32 merkleRoot = merkleRoots[i];
            uint256 amount = amounts[i];
            
            require(merkleRootPublished[merkleRoot], "Invalid root");
            require(!hasClaimed[merkleRoot][msg.sender], "Already claimed");
            
            // Verify proof
            bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
            require(
                MerkleProof.verify(merkleProofs[i], merkleRoot, leaf),
                "Invalid proof"
            );
            
            hasClaimed[merkleRoot][msg.sender] = true;
            totalClaim += amount;
            
            emit RoyaltyClaimed(msg.sender, merkleRoot, amount);
        }
        
        require(usdc.transfer(msg.sender, totalClaim), "Transfer failed");
    }
    
    // ========================================================================
    // INTERNAL FUNCTIONS
    // ========================================================================
    
    function _verifyWorldID(
        uint256 nullifierHash,
        bytes32 signal,
        uint256[8] calldata proof
    ) internal view {
        // World ID verification
        // In production: call worldId.verifyProof()
        // For pseudocode: simplified
        
        require(nullifierHash != 0, "Invalid nullifier");
        // Additional verification logic here
    }
    
    // ========================================================================
    // VIEW FUNCTIONS
    // ========================================================================
    
    function getProposalState(bytes32 proposalId)
        external
        view
        returns (ProposalState memory)
    {
        return proposals[proposalId];
    }
    
    function canClaim(bytes32 merkleRoot, address user)
        external
        view
        returns (bool)
    {
        return merkleRootPublished[merkleRoot] && !hasClaimed[merkleRoot][user];
    }
}

// ============================================================================
// OFF-CHAIN MERKLE TREE GENERATION (Node.js Script)
// ============================================================================

/*
// merkle-generator.js

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function generateWeeklyMerkleTree() {
    // 1. Query accumulated royalties from database
    const royalties = await prisma.royaltyAccrual.findMany({
        where: {
            merkleTreeId: null,
            claimed: false
        },
        include: {
            proposal: true
        }
    });
    
    // 2. Aggregate by creator
    const creatorTotals = {};
    for (const royalty of royalties) {
        const creator = royalty.proposal.creatorAddress;
        if (!creatorTotals[creator]) {
            creatorTotals[creator] = 0;
        }
        creatorTotals[creator] += parseFloat(royalty.amount);
    }
    
    // 3. Generate leaves
    const leaves = Object.entries(creatorTotals).map(([address, amount]) => {
        return keccak256(
            ethers.utils.solidityPack(['address', 'uint256'], [address, amount])
        );
    });
    
    // 4. Build Merkle tree
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const root = tree.getHexRoot();
    
    // 5. Store in database
    const distribution = await prisma.merkleDistribution.create({
        data: {
            merkleRoot: root,
            totalAmount: Object.values(creatorTotals).reduce((a, b) => a + b, 0),
            periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            periodEnd: new Date(),
            treeData: {
                leaves: creatorTotals,
                root: root
            },
            status: 'PUBLISHED'
        }
    });
    
    // 6. Publish to smart contract
    const contract = new ethers.Contract(GOVERNANCE_ADDRESS, ABI, signer);
    await contract.publishMerkleRoot(
        root,
        distribution.totalAmount,
        Math.floor(Date.now() / 1000)
    );
    
    console.log(`Merkle root published: ${root}`);
    return distribution;
}

// Run weekly via cron
generateWeeklyMerkleTree();
*/
