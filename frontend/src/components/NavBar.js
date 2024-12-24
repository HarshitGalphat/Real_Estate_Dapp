// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";


const Navbar = () => {

    const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Connection failed:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to connect.");
    }
  };

  return (
    <nav className="bg-sky-950 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Real Estate DApp</h1>
        <div className="space-x-6 font-bold">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/view-properties" className="hover:underline">
            Properties
          </Link>
          <Link to="/list-property" className="hover:underline">
            List Property
          </Link>
        </div>
        <button
          onClick={connectWallet}
          className="px-6 py-2 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-700"
        >
          {walletAddress
            ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(
                walletAddress.length - 4
              )}`
            : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
