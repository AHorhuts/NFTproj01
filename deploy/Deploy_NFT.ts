const hre = require('hardhat')
import { DeployFunction } from "hardhat-deploy/types"
import { getNamedAccounts, deployments, network, ethers } from "hardhat"
import { BigNumber, Contract } from "ethers"
import { ERC721, IERC721Metadata } from "../typechain"
import { developmentChains, testnetChains } from "../helper-hardhat-config"
import { delay } from "@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService"
import verify from "../utils/verify"
import { contract } from "@chainlink/test-helpers"

const deployFunction: DeployFunction = async () => {
    const { deploy, log} = deployments;
    const [deployer, owner, anotherAddr, wallet1, wallet2] = await ethers.getSigners();
    const chainId: number | undefined = network.config.chainId;

    const constructorArgs = ["SBML X", "SBML"]
    let SBML: Contract


    const nft = await deploy("SBML", {
        contract: "NFT",
        from: deployer.address,
        log: true,
        args: constructorArgs,
    })
    SBML = (await ethers.getContract("SBML")) as ERC721

    if (developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying on etherscan...")
        await delay(20000)
        await verify(
            nft.address,
            "contracts/NFT.sol:SBML",
            constructorArgs
        )
    }
}

