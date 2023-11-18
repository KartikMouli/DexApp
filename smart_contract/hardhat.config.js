require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: { // Add Sepolia network configuration
      url: process.env.INFURA_PROJECT_ID, // Replace with your Infura Project ID
      accounts: [process.env.METAMASK_ACC_KEY],
    },
  },
  paths: {
    artifacts: "./lib/src/artifacts",
  },
};
