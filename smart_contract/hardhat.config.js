require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: { // Add Sepolia network configuration
      url: "https://sepolia.infura.io/v3/66bdec5a7e554343a20de72c07721744", // Replace with your Infura Project ID
      accounts: ["5ab2fa5be5a1947f1845bd4e4b08fe82a7312a33f32ce618de1f93b244e98c2e"],
    },
  },
  paths: {
    artifacts: "./lib/src/artifacts",
  },
};
