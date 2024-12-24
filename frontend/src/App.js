import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import About from "./components/About";
import ViewProperties from "./components/ViewProperties";
import ListProperty from "./components/ListProperty";
import Footer from "./components/Footer";
import PropertyDetails from "./components/PropertyDetails";
import LoginPage from "./components/LoginPage"; // Import the LoginPage component

const App = () => {
  const [account, setAccount] = useState(null); // State to track if the user is logged in

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Check if MetaMask is connected and get the account
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]); // Set the connected account
        }
      }
    } catch (error) {
      console.log("Error checking wallet connection:", error);
    }
  };

  // Handle login
  const handleLogin = (userAccount) => {
    setAccount(userAccount);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* If user is not logged in, redirect to Login */}
            <Route path="/" element={account ? <Home /> : <Navigate to="/login" />} />
            
            {/* Login Route */}
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

            {/* Other Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/view-properties" element={<ViewProperties />} />
            <Route path="/list-property" element={<ListProperty />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
