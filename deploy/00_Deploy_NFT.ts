const hre = require('hardhat')
import { DeployFunction } from "hardhat-deploy/types"
import { getNamedAccounts, deployments, network, ethers } from "hardhat"
import { BigNumber, BigNumberish, Contract } from "ethers"
import { ERC721, IERC721Metadata } from "../typechain"
import { developmentChains, testnetChains } from "../helper-hardhat-config"
import { delay } from "@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService"
import verify from "../utils/verify"
import { contract } from "@chainlink/test-helpers"
import { Address } from "hardhat-deploy/types"



const deployFunction: DeployFunction = async () => {
    const uris = [...Array(25).keys()].map( item => item.toFixed());
    let price = ethers.utils.parseEther('1');
    const { deploy, log} = deployments;
    const [deployer, owner, anotherAddr, wallet1, wallet2] = await ethers.getSigners();
    const chainId: number | undefined = network.config.chainId;

    const constructorArgs = [uris, price, wallet1.address, wallet2.address]
    let SBML: Contract


    const sbml = await deploy("SBML", {
        contract: "SBML",
        from: deployer.address,
        log: true,
        args: constructorArgs,
    })
    SBML = (await ethers.getContract("SBML")) as ERC721

    if (testnetChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying on etherscan...")
        await delay(20000)
        await verify(
            sbml.address,
            "contracts/NFT.sol:SBML",
            constructorArgs
        )
    }
}

export default deployFunction