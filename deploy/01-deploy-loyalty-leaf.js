const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
// const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let VRFCoordinatorV2Mock

    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address
        const tx = await VRFCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscribtionId = txReceipt.events[0].args.subId
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscribtionId = networkConfig[chainId].subscriptionId
    }

    log("------------------------------------------------------------------")

    const args = [
        vrfCoordinatorV2Address,
        subscribtionId,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].callbackGasLimit,
    ]

    const loyatyLeaf = await deploy("LoyaltyLeaf", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    //     log("Verifying....")
    //     await verify(loyaltyLeaf.address, args)
    // }
    // log("------------------------------------------")
}

module.exports.tags = ["all", "loyaltyLeaf", "main"]
