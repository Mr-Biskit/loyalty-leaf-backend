const hre = require("hardhat")

async function main() {
    const [owner] = await hre.ethers.getSigners()
    const VRFMock = await hre.ethers.getContractFactory("VRFCoordinatorV2Mock")
    const vrfMock = await VRFMock.deploy()
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
