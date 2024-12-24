import { useState, useEffect } from "react";
import { ethers } from "ethers";
import  ABI  from "../abis/RealEstate.json";  // Replace with your contract ABI and address

const CONTRACT_ADDRESS = "0x98B59A46B4D4b91e8eF61bC89ae68B5C8aCe35CE";

export const useContract = () => {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const currentSigner = provider.getSigner();
          setSigner(currentSigner);
          setUserAddress(await currentSigner.getAddress());

          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ABI.abis, currentSigner);
          setContract(contractInstance);
        } else {
          console.error("Ethereum provider is not available.");
        }
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    initializeContract();
  }, []);

  return { contract, signer, userAddress };
};
