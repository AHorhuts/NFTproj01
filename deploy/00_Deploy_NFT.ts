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
    const [deployer] = await ethers.getSigners();

    const constructorArgs = [uris, '0x985AC3C3Dbb4135Bea36D643bf93d073A10520bc', '0x36f9bf9bc564684250f1729de1bf6dee1f33443d', price]


    const result = await deploy("SBML", {
        contract: "SBML",
        from: deployer.address,
        log: true,
        args: constructorArgs,
        gasPrice: '1004340328',
    })

    if (testnetChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying on etherscan...")
        await delay(20000)
        await verify(
            result.address,
            "contracts/NFT.sol:SBML",
            constructorArgs
        )
    }
}

export default deployFunction