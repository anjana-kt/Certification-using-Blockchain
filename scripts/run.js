const hre = require("hardhat");

async function main() {

  // We get the contract to deploy
  const TokenPlatform = await hre.ethers.getContractFactory("TokenPlatform");
  const tokenPlatform = await TokenPlatform.deploy();

  await tokenPlatform.deployed();

  console.log("TokenPlatform deployed to:",tokenPlatform.address);

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(tokenPlatform.address);

  await token.deployed();

  console.log("Token deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });