async function main() {
  const GasReceiptStorage = await ethers.getContractFactory("GasReceiptStorage");
  const gasReceiptStorage = await GasReceiptStorage.deploy();

  await gasReceiptStorage.deployed();

  console.log("GasReceiptStorage deployed to:", gasReceiptStorage.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });