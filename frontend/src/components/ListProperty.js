import React, { useState } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";

const ListProperty = () => {
  const [form, setForm] = useState({
    price: "",
    title: "",
    category: "",
    images: "",
    address: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.listProperty(
        "0x49CB9dC4BB77f0f8174eB48c258B8722459CA69E", // Replace with the owner's address
        ethers.utils.parseEther(form.price),
        form.title,
        form.category,
        form.images,
        form.address,
        form.description
      );
      await tx.wait();
      alert("Property listed successfully!");
      console.log(tx);
    } catch (error) {
      console.error(error);
      alert("Error listing property.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">List Your Property</h1>
      <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
        {["price", "title", "category", "images", "address", "description"].map(
          (field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              className="p-2 border rounded"
              onChange={handleChange}
            />
          )
        )}
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Listing..." : "List Property"}
        </button>
      </div>
    </div>
  );
};

export default ListProperty;
