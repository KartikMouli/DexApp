const hre = require("hardhat");
async function main() {

  const Upload = await hre.ethers.getContractFactory("CPAMM");
  const upload = await Upload.deploy('0x42d007E66728979dA89572511196Cd7cCc6AD85e','0xEc4940b3859Fa34b78c4F2f4B3F4293CE92F1053');

  await upload.waitForDeployment();

  console.log(
    `CPAMM Contract deployed to address ${upload.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
