import {assert, expect, should} from "chai"
import {BigNumber, BigNumberish, ContractTransaction, FixedNumber} from "ethers"
import { deployments, network, ethers } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import { getAddress, isAddress } from "ethers/lib/utils"
import { bigNum } from "@chainlink/test-helpers/dist/src/matchers"
import { Address } from "hardhat-deploy/types"
import {Horhuts, TransferEvent} from "../../typechain/contracts/NFT.sol/Horhuts";
import {Horhuts__factory} from "../../typechain/factories/contracts/NFT.sol/Horhuts__factory";
import { SBML } from "../../typechain";
import { wallet } from "@chainlink/test-helpers";



describe("NFT test", async () => {
    const uris = [...Array(25).keys()].map( item => item.toFixed())
    
    let contract: SBML
    let deployer: SignerWithAddress
    let owner: SignerWithAddress
    let anotherAddr: SignerWithAddress
    let price: BigNumberish
    let wallet1: SignerWithAddress
    let wallet2: SignerWithAddress
    let tokenURI: string
    

    beforeEach(async () => {
        // await deployments.fixture(["mocks", "feed"])
        [deployer, owner, anotherAddr, wallet1, wallet2] = await ethers.getSigners()
        let price = ethers.utils.parseEther('1')
        const factory = await ethers.getContractFactory("SBML") as Horhuts__factory
        contract = await factory.deploy(uris, wallet1.address, wallet2.address, price) // todo add price to constructor
        await contract.deployed()
    })

    it("Initial Mint test", async () => {
        await expect(contract.ownerOf(0)).revertedWith('ERC721: invalid token ID')

        const tx = await contract.mint({ value: ethers.utils.parseEther('1') })
        const receipt = await tx.wait()

        console.log(receipt.gasUsed.toString())

        expect(await contract.ownerOf(0)).equal(deployer.address)
        await expect(contract.ownerOf(1)).revertedWith('ERC721: invalid token ID')
    })

    it("multiply mint test", async () => {
        await contract.mint({ value: ethers.utils.parseEther('1') })
        await contract.mint({ value: ethers.utils.parseEther('1') })
        await contract.mint({ value: ethers.utils.parseEther('1') })
        await contract.mint({ value: ethers.utils.parseEther('1') })
        await contract.mint({ value: ethers.utils.parseEther('1') })

        expect(await contract.tokenURI(0)).equal('0')
        expect(await contract.tokenURI(1)).equal('1')
        expect(await contract.tokenURI(2)).equal('2')
        expect(await contract.tokenURI(3)).equal('3')
        expect(await contract.tokenURI(4)).equal('4')

        const usedTokens = [0, 1, 2, 3, 4]

        // next should random mint
        for (let i = 0; i < 20; i++) {
            const tx = await contract.mint({ value: ethers.utils.parseEther('1') })
            const tokenId = await getTokenId(tx)
            // console.log(tokenId);

            expect(tokenId).greaterThanOrEqual(5)
            expect(tokenId).lessThanOrEqual(25)
            expect(usedTokens.includes(tokenId)).false
            usedTokens.push(tokenId)         
        }
    })
    
    it("should revert mint after 25th tokenId", async () => {
        for (let i = 0; i <= 24; i++) {
            await contract.mint({ value: ethers.utils.parseEther('1') })
        }
        await expect (contract.mint()).to.be.revertedWith('No more available NFT')  
    })
    
    it("withdraw test", async () =>{
        // 1. Contract balance equal 0
        const prevContractBalance = await ethers.provider.getBalance(contract.address)
        expect (prevContractBalance).to.be.equal("0")
        
        // 1.1 wallets balance 
        const walletbal1 = await ethers.provider.getBalance(wallet1.address)
        const walletbal2 = await ethers.provider.getBalance(wallet2.address)

        // 2. Mint
        const tx = await contract.mint({ value: ethers.utils.parseEther('1') })
        await tx.wait()

        // 3. Check contract balance eq price
        const currentContractBal = await ethers.provider.getBalance(contract.address)
        expect(currentContractBal).to.be.equal(ethers.utils.parseEther('1'))

        // 4. Withdraw price
        const setWithdrawTx = await contract.withdraw(ethers.utils.parseEther('1'))
        await setWithdrawTx.wait()

        // 4. Check contract balance eq 0
        const newContractBalance = await ethers.provider.getBalance(contract.address)
        expect(newContractBalance).equal(0)

        // todo
        // 5. Check wallet1 balance
        expect(await ethers.provider.getBalance(wallet1.address)).equal(ethers.utils.parseEther('10000.1'))
        // 6. Check wallet2 balance 
        expect(await ethers.provider.getBalance(wallet2.address)).equal(ethers.utils.parseEther('10000.9'))
    })
    
    it("should return contract balance", async () => {
        const contractBalance = await ethers.provider.getBalance(contract.address)
        expect(contractBalance).exist
    })
    
    it("random number test", async() => {
        for (let i = 1; i < 50; i++) {
            const randNum = await contract.random(i)
        
            expect(randNum).greaterThanOrEqual(0)
            expect(randNum).lessThanOrEqual(i)
        }
    })

    it("should set mint price", async() => {
        await contract.setMintPrice(ethers.utils.parseEther('2'))
        const price = await contract.getMintPrice()
        expect (price).equal(ethers.utils.parseEther('2'))   
    })

    it("should set token URI", async() =>{
        await contract.setTokenURI(0, "https://test.url/0" )
        await contract.setTokenURI(1, "https://test.url/1" )
        await contract.setTokenURI(2, "https://test.url/2" )
        await contract.setTokenURI(3, "https://test.url/3" )

        expect(await contract.tokenURI(0)).equal("https://test.url/0")
        expect(await contract.tokenURI(1)).equal("https://test.url/1")
        expect(await contract.tokenURI(2)).equal("https://test.url/2")
        expect(await contract.tokenURI(3)).equal("https://test.url/3")
    })
})
    


async function getTokenId(tx: ContractTransaction) {
    const {events} = await tx.wait()
    const transferEvent = events?.[0] as TransferEvent
    return transferEvent.args[2].toNumber()
}