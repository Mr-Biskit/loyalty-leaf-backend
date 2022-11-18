require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")

require("dotenv").config()

const MUMBAI_RPC_URL = process.env.MUMBAI_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        mumbai: {
            chainId: 80001,
            blockConfirmations: 1,
            url: MUMBAI_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
        localhost: {
            chainId: 31337,
        },
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: false,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    solidity: "0.8.17",
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
}
