import hre from "hardhat"

const verify = async (contractAddress: string, contract: string, args: any[]) => {
    console.log("Verifying contract...")
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
            contract,
        })
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}

export default verify