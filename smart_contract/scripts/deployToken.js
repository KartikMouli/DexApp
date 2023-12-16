const hre = require("hardhat");
// CPAMM Contract deployed to address 0x4A30354A316471B32767FA940FE7D981E008c6Ed
// Token1 deployed to address 0x733Fd671fa49f9D043fe2E5E9e5251AE9e992e4E
// Token2 deployed to address 0xf451bD175B5d4D64A8E9a46F64150a2D51836d5f
async function main() {

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(100000);

  await token.waitForDeployment();

  console.log(
    `Token2 deployed to address ${token.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
