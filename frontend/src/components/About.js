// About.js
import React from "react";

const About = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">About Us</h1>
        <p className="text-gray-700 leading-relaxed mb-4">
          Real Estate DApp is a blockchain-powered platform that aims to bring
          transparency, efficiency, and trust to the real estate industry. By
          leveraging the power of decentralized technology, we enable users to
          buy, sell, and manage properties with unparalleled security and ease.
        </p>
        <h2 className="text-2xl font-bold mb-2 text-blue-600">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Our mission is to eliminate fraud and intermediaries in real estate
          transactions, reducing costs and ensuring fairness for all parties
          involved.
        </p>
        <h2 className="text-2xl font-bold mb-2 text-blue-600">Key Features</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Smart contracts for secure and transparent transactions</li>
          <li>Decentralized property listings</li>
          <li>Immutable ownership records</li>
          <li>Lower transaction costs</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
