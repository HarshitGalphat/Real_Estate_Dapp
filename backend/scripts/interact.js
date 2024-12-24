const Web3 = require('web3'); // Import Web3
const HDWalletProvider = require('@truffle/hdwallet-provider'); // Import HDWalletProvider
const RealEstate = artifacts.require("RealEstate");

const provider = new HDWalletProvider("tired armed razor mother maximum infant tone myself expire rifle addict shaft", "http://127.0.0.1:8545"); // Replace "your mnemonic" with your actual mnemonic
const web3 = new Web3(provider); // Create a Web3 instance with the provider

const main = async () => {
  const accounts = await web3.eth.getAccounts();
  const instance = await RealEstate.deployed();

  // Example: List a property
  await instance.listProperty(accounts[0], web3.utils.toWei("1", "ether"), "My Property", "Category", "image_url", "123 Main St", "Description");

  // Example: Get all properties
  const properties = await instance.getAllProperty();
  console.log(properties);
};

main()
  .then(() => provider.engine.stop())
  .catch(err => {
    console.error(err);
    provider.engine.stop();
  });