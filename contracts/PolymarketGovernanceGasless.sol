// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PolymarketGovernanceGasless
 * @notice Simplified governance contract supporting EIP-712 signatures and World ID
 * @dev Implements gasless voting where a relayer pays gas fees.
 */

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

contract PolymarketGovernanceGasless {
    // --- EIP-712 Constants ---
    bytes32 private constant EIP712_DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant VOTE_TYPEHASH = keccak256("Vote(uint256 proposalId,uint256 support,uint256 nullifierHash)");
    bytes32 private constant PROPOSAL_TYPEHASH = keccak256("Proposal(string question,string description,uint256 category,uint256 nullifierHash)");

    // --- State ---
    IWorldID public immutable worldID;
    uint256 public immutable internalGroupId; // World ID Group ID (usually 1)
    uint256 public immutable externalNullifierHash; // Action ID hash
    
    mapping(uint256 => bool) public nullifierHashes; // Prevent double voting/proposing per nullifier
    mapping(bytes32 => bool) public executedSignatures; // Anti-replay for signatures

    event VoteCast(uint256 indexed proposalId, address indexed voter, uint256 support, uint256 nullifierHash);
    event ProposalCreated(uint256 indexed proposalId, address indexed creator, string question);

    constructor(
        IWorldID _worldID, 
        string memory _appId, 
        string memory _actionId
    ) {
        worldID = _worldID;
        internalGroupId = 1;
        externalNullifierHash = abi.decode(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked(_appId)), _actionId))), (uint256));
    }

    // --- Core Logic ---

    function executeVoteWithSignature(
        address voter,
        uint256 proposalId,
        uint256 support, // 0=Against, 1=For, 2=Abstain
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        // 1. Replay Protection
        bytes32 structHash = keccak256(abi.encode(VOTE_TYPEHASH, proposalId, support, nullifierHash));
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = ecrecover(digest, v, r, s);
        
        require(signer == voter, "Invalid signature");
        require(!executedSignatures[digest], "Signature already executed");
        executedSignatures[digest] = true;

        // 2. Sybil Resistance (World ID)
        // Verify that the user hasn't voted with this World ID nullifier before (logic simplified for demo)
        // In a real app, nullifierHash should be scoped per proposal or global depending on rules.
        // potentially: keccak256(abi.encode(proposalId, nullifierHash))
        
        require(!nullifierHashes[nullifierHash], "Duplicate World ID usage");
        
        worldID.verifyProof(
            root,
            internalGroupId,
            abi.decode(abi.encodePacked(keccak256(abi.encodePacked(voter))), (uint256)), // Signal = Voter Address
            nullifierHash,
            externalNullifierHash,
            proof
        );

        nullifierHashes[nullifierHash] = true;

        // 3. Cast Vote
        emit VoteCast(proposalId, voter, support, nullifierHash);
    }
    
    // --- Internal EIP-712 Helpers (Simplified) ---

    function _domainSeparatorV4() internal view returns (bytes32) {
        return keccak256(abi.encode(
            EIP712_DOMAIN_TYPEHASH,
            keccak256(bytes("Polymarket HumanDAO")),
            keccak256(bytes("1")),
            block.chainid,
            address(this)
        ));
    }

    function _hashTypedDataV4(bytes32 structHash) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(
            "\x19\x01",
            _domainSeparatorV4(),
            structHash
        ));
    }
}
