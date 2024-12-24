import { ethers } from "ethers";
import RealEstateABI from "../abis/RealEstate.json"; // Import ABI
// import { JsonRpcProvider } from "ethers";
// import { parseEther } from "ethers";
// import { JsonRpcProvider } from "ethers";
import { Contract } from "ethers";



const contractAddress = "0xCA11a6Acd180d3a602eCc83c0B05880Dde6fda20";

export const getContract = async () => {
  const { ethereum } = window;
  if (!ethereum) {
    alert("Please install MetaMask!");
    return;
  }

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = provider.getSigner();
const contract = new Contract(contractAddress, RealEstateABI.abi, signer);
  return contract;
};

export const connectToMetaMask = async () => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected to MetaMask");
  } catch (error) {
    console.log("Error connecting to MetaMask", error);
  }
};
