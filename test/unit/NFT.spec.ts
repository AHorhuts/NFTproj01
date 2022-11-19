import {assert, expect, should} from "chai"
import {BigNumber, BigNumberish, ContractTransaction, FixedNumber} from "ethers"
import { deployments, network, ethers } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import {Horhuts, Horhuts__factory, MockV3Aggregator, PriceConsumerV3} from "../../typechain"
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {TransferEvent} from "../../typechain/contracts/NFT.sol/Horhuts";
import { getAddress, isAddress } from "ethers/lib/utils"
import { bigNum } from "@chainlink/test-helpers/dist/src/matchers"
import { Address } from "hardhat-deploy/types"



describe("NFT test", async () => {
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts

    const uris = [...Array(25).keys()].map( item => item.toFixed())
    
    

    let contract: Horhuts
    let deployer: SignerWithAddress
    let owner: SignerWithAddress
    let anotherAddr: SignerWithAddress
    let price: BigNumberish
    let wallet1: SignerWithAddress
    let wallet2: SignerWithAddress
    

    beforeEach(async () => {
        // await deployments.fixture(["mocks", "feed"])
        [deployer, owner, anotherAddr] = await ethers.getSigners()
        const factory = await ethers.getContractFactory("Horhuts") as Horhuts__factory
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

        const usedTokens = [0, 1, 2, 3, 4]

        // next should random mint
        for (let i = 0; i < 20; i++) {
            const tx = await contract.mint()
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
            await contract.mint()
        }
        await expect (contract.mint()).to.be.revertedWith('No more available NFT')  
    })
    
    it("withdraw test", async () =>{
        // 1. Contract balance equal 0
        // 2. Mint
        // 3. Check contract balance eq price
        // 4. Withdraw price
        // 4. Check contract balance eq 0
        const prevContractBalance = await ethers.provider.getBalance(contract.address)
        expect (prevContractBalance).to.be.equal("0")
            
        const tx = await contract.mint({ value: ethers.utils.parseEther('1') })
        await tx.wait()
        
        const currentContractBal = await ethers.provider.getBalance(contract.address)
        expect(currentContractBal).to.be.equal({value: ethers.utils.parseEther('1')})
        
        const setWithdrawTx = await (await contract.withdraw(ethers.utils.parseEther(await currentContractBal.toString())).to.be.equal('1'))
        await setWithdrawTx.wait()
        
        const pastContractBalance = await ethers.provider.getBalance(contract.address)
        expect(ethers.utils.formatEther(await pastContractBalance.toString())).to.be.equal('0')
        
        // await expect(prevContractBalance).greaterThanOrEqual(contract.withdraw(ethers.utils.parseEther('1') ))
    })
    
     it("it should return contract balance", async () => {
         const contractBalance = await ethers.provider.getBalance(contract.address)
         console.log(contractBalance)
     })
    
    it("random number test", async() => {
        for (let i = 0; i < 50; i++) {
            const randNum = await contract._random(i)
        
            expect(randNum).to.be.greaterThanOrEqual(0)
            expect (randNum).to.be.lessThanOrEqual(i)
        }
    })

    it("it should set mint price", async() => {
        //const prevPrice = expect(price).eq('')
        for (let i = 1, i < 10, i++) {
            const tx = await contract.setMintPrice(i)
            await tx.wait()

            const newPrice = expect(tx).eq(i)
            
        }
    })

    it("it should set token URI", async() =>{

    })
})
    


async function getTokenId(tx: ContractTransaction) {
    const {events} = await tx.wait()
    const transferEvent = events?.[0] as TransferEvent
    return transferEvent.args[2].toNumber()
}