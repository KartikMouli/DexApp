const hre = require("hardhat");
async function main() {

  const Upload = await hre.ethers.getContractFactory("CPAMM");
  const upload = await Upload.deploy("0xf3197E7ce6C96441cE999eC7a50fdA6ffB3F580E", "0x94093684edcd531364BB3834697C45C8940Fabe3");

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
