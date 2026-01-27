import { expect } from "chai";
import { ethers } from "hardhat";
import { HumanFiGovernance } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("HumanFiGovernance", function () {
    let humanFi: HumanFiGovernance;
    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let worldIdRouter: SignerWithAddress; // Mock World ID
    let zapContract: SignerWithAddress; // Mock Zap Contract

    const APP_ID = "app_test_123";
    const GROUP_ID = 1;

    beforeEach(async function () {
        [owner, user1, user2, worldIdRouter, zapContract] = await ethers.getSigners();

        // Deploy HumanFiGovernance
        const HumanFiGovernance = await ethers.getContractFactory("HumanFiGovernance");
        humanFi = await HumanFiGovernance.deploy(
            worldIdRouter.address,
            APP_ID,
            zapContract.address
        );
        await humanFi.deployed();
    });

    describe("Deployment", function () {
        it("Should set the correct owner", async function () {
            expect(await humanFi.owner()).to.equal(owner.address);
        });

        it("Should set the correct World ID router", async function () {
            expect(await humanFi.worldId()).to.equal(worldIdRouter.address);
        });

        it("Should set the correct Zap contract", async function () {
            expect(await humanFi.zapContract()).to.equal(zapContract.address);
        });
    });

    describe("Proposal Creation", function () {
        it("Should create a proposal successfully", async function () {
            const description = "Test Proposal";
            const conditionId = ethers.utils.formatBytes32String("condition1");
            const votingPeriod = 86400; // 1 day

            await expect(
                humanFi.createProposal(description, conditionId, votingPeriod, 0)
            ).to.emit(humanFi, "ProposalCreated");

            const proposal = await humanFi.getProposal(0);
            expect(proposal.description).to.equal(description);
            expect(proposal.conditionId).to.equal(conditionId);
            expect(proposal.executed).to.be.false;
        });

        it("Should reject invalid voting periods", async function () {
            const description = "Test Proposal";
            const conditionId = ethers.utils.formatBytes32String("condition1");

            // Too short
            await expect(
                humanFi.createProposal(description, conditionId, 3600, 0)
            ).to.be.revertedWithCustomError(humanFi, "InvalidVotingPeriod");

            // Too long
            await expect(
                humanFi.createProposal(description, conditionId, 8 * 86400, 0)
            ).to.be.revertedWithCustomError(humanFi, "InvalidVotingPeriod");
        });

        it("Should increment proposal count", async function () {
            const description = "Test Proposal";
            const conditionId = ethers.utils.formatBytes32String("condition1");
            const votingPeriod = 86400;

            expect(await humanFi.getProposalCount()).to.equal(0);

            await humanFi.createProposal(description, conditionId, votingPeriod, 0);
            expect(await humanFi.getProposalCount()).to.equal(1);

            await humanFi.createProposal(description, conditionId, votingPeriod, 0);
            expect(await humanFi.getProposalCount()).to.equal(2);
        });
    });

    describe("Voting Power Management", function () {
        it("Should allow Zap contract to update shares", async function () {
            const conditionId = ethers.utils.formatBytes32String("condition1");
            const shares = 100;

            await humanFi.connect(zapContract).updateShares(user1.address, conditionId, shares);

            expect(await humanFi.getUserVotingPower(user1.address, conditionId)).to.equal(shares);
            expect(await humanFi.getTotalVotingPower(conditionId)).to.equal(shares);
        });

        it("Should allow owner to update shares", async function () {
            const conditionId = ethers.utils.formatBytes32String("condition1");
            const shares = 100;

            await humanFi.connect(owner).updateShares(user1.address, conditionId, shares);

            expect(await humanFi.getUserVotingPower(user1.address, conditionId)).to.equal(shares);
        });

        it("Should reject unauthorized share updates", async function () {
            const conditionId = ethers.utils.formatBytes32String("condition1");
            const shares = 100;

            await expect(
                humanFi.connect(user1).updateShares(user2.address, conditionId, shares)
            ).to.be.revertedWith("Unauthorized");
        });

        it("Should update total shares correctly", async function () {
            const conditionId = ethers.utils.formatBytes32String("condition1");

            await humanFi.connect(zapContract).updateShares(user1.address, conditionId, 100);
            expect(await humanFi.getTotalVotingPower(conditionId)).to.equal(100);

            await humanFi.connect(zapContract).updateShares(user2.address, conditionId, 50);
            expect(await humanFi.getTotalVotingPower(conditionId)).to.equal(150);

            // Update user1's shares
            await humanFi.connect(zapContract).updateShares(user1.address, conditionId, 200);
            expect(await humanFi.getTotalVotingPower(conditionId)).to.equal(250);
        });
    });

    describe("Admin Functions", function () {
        it("Should allow owner to update quorum", async function () {
            await humanFi.setQuorumPercentage(30);
            expect(await humanFi.quorumPercentage()).to.equal(30);
        });

        it("Should reject invalid quorum", async function () {
            await expect(
                humanFi.setQuorumPercentage(101)
            ).to.be.revertedWith("Invalid quorum");
        });

        it("Should allow owner to update approval threshold", async function () {
            await humanFi.setApprovalThreshold(70);
            expect(await humanFi.approvalThreshold()).to.equal(70);
        });

        it("Should allow owner to update Zap contract", async function () {
            const newZap = user1.address;
            await humanFi.setZapContract(newZap);
            expect(await humanFi.zapContract()).to.equal(newZap);
        });

        it("Should reject zero address for Zap contract", async function () {
            await expect(
                humanFi.setZapContract(ethers.constants.AddressZero)
            ).to.be.revertedWithCustomError(humanFi, "ZeroAddress");
        });
    });

    describe("View Functions", function () {
        it("Should return correct proposal details", async function () {
            const description = "Test Proposal";
            const conditionId = ethers.utils.formatBytes32String("condition1");
            const votingPeriod = 86400;

            await humanFi.createProposal(description, conditionId, votingPeriod, 0);

            const proposal = await humanFi.getProposal(0);
            expect(proposal.description).to.equal(description);
            expect(proposal.conditionId).to.equal(conditionId);
            expect(proposal.yesVotes).to.equal(0);
            expect(proposal.noVotes).to.equal(0);
        });

        it("Should revert for invalid proposal ID", async function () {
            await expect(
                humanFi.getProposal(999)
            ).to.be.revertedWithCustomError(humanFi, "InvalidProposalId");
        });
    });
});
