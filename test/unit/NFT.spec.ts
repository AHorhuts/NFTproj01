import {assert, expect} from "chai"
import {BigNumber, ContractTransaction} from "ethers"
import { deployments, network, ethers } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import {Horhuts, Horhuts__factory, MockV3Aggregator, PriceConsumerV3} from "../../typechain"
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {TransferEvent} from "../../typechain/contracts/NFT.sol/Horhuts";


describe("NFT test", async () => {
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts

    const uris = [...Array(25).keys()].map( item => item.toFixed())

    let contract: Horhuts
    let deployer: SignerWithAddress

    beforeEach(async () => {
        // await deployments.fixture(["mocks", "feed"])
        [deployer] = await ethers.getSigners()
        const factory = await ethers.getContractFactory("Horhuts") as Horhuts__factory
        contract = await factory.deploy(uris)
        await contract.deployed()
    })

    it("Initial Mint test", async () => {
        await expect(contract.ownerOf(0)).revertedWith('ERC721: invalid token ID')

        const tx = await contract.mint()
        const receipt = await tx.wait()

        console.log(receipt.gasUsed.toString())

        expect(await contract.ownerOf(0)).equal(deployer.address)
        await expect(contract.ownerOf(1)).revertedWith('ERC721: invalid token ID')
    })

    it("multiply mint test", async () => {
        await contract.mint()
        await contract.mint()
        await contract.mint()
        await contract.mint()
        await contract.mint()

        expect(await contract.tokenURI(0)).equal('0')
        expect(await contract.tokenURI(1)).equal('1')
        expect(await contract.tokenURI(2)).equal('2')
        expect(await contract.tokenURI(3)).equal('3')
        expect(await contract.tokenURI(4)).equal('4')

        // next should random mint
        const tx = await contract.mint()
        const tokenId = await getTokenId(tx)

        expect(tokenId).greaterThanOrEqual(6)
        expect(tokenId).lessThanOrEqual(25)
    })
})


async function getTokenId(tx: ContractTransaction) {
    const {events} = await tx.wait()
    const transferEvent = events?.[0] as TransferEvent
    return transferEvent.args[2].toNumber()
}