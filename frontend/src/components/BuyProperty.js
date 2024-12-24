import React, { useState } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";

const BuyProperty = ({ propertyId, propertyPrice }) => {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.buyProperty(propertyId, {
        value: ethers.utils.parseEther(propertyPrice.toString()),
      });
      await tx.wait();
      alert("Property purchased successfully!");
    } catch (error) {
      console.error("Error purchasing property:", error);
      alert("Failed to purchase the property.");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className={`p-2 rounded ${
        loading
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : "bg-green-500 text-white hover:bg-green-600"
      }`}
    >
      {loading ? "Processing..." : `Buy for ${propertyPrice} ETH`}
    </button>
  );
};

export default BuyProperty;
