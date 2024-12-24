import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import metamaskIcon from "../assets/metamask-icon.svg"; // Import MetaMask icon image

const LoginPage = ({ onLogin }) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // To navigate to the home page after login

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Check if MetaMask is already connected
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          onLogin(accounts[0]); // Notify parent component that the user is logged in
          navigate("/"); // Redirect to home if logged in
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  // Request MetaMask login (connect wallet)
  const loginWithMetaMask = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask is not installed! Please install it to use this app.");
        return;
      }

      // Request MetaMask to connect
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const userAccount = accounts[0];
        setAccount(userAccount);
        onLogin(userAccount); // Pass the logged-in account to the parent (App)
        navigate("/"); // Redirect to home page
      } else {
        console.log("No account selected");
      }
    } catch (error) {
      console.error("Error logging in with MetaMask:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login with MetaMask</h2>

        {account ? (
          <div className="text-center">
            <p className="text-lg text-gray-800">Logged in as: {account}</p>
          </div>
        ) : (
          <div className="flex justify-center items-center space-x-2">
            <img
              src={'/metamask.png'}
              alt="MetaMask logo"
              className="w-8 h-8"
            />
            <button
              onClick={loginWithMetaMask}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              disabled={loading}
            >
              {loading ? "Connecting..." : "Login with MetaMask"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
