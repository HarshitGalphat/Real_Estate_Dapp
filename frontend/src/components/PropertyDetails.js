import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";

const PropertyDetails = () => {
  const { id } = useParams(); // Access property ID from the URL
  const [property, setProperty] = useState(null);
  const [signer, setSigner] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [reviewRating, setReviewRating] = useState(1);

  useEffect(() => {
    const setupProvider = async () => {
      const { ethereum } = window;
      if (ethereum) {
        const tempProvider = new ethers.providers.Web3Provider(ethereum);
        const tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);
      } else {
        console.error("Ethereum provider not found. Please install MetaMask.");
      }
    };
    setupProvider();
  }, []);

  const fetchPropertyDetails = async () => {
    try {
      const contract = await getContract();
      const propertyData = await contract.getPropertyDetails(id);
      setProperty({
        id: propertyData.productID.toNumber(),
        title: propertyData.propertyTitle,
        price: ethers.utils.formatEther(propertyData.price), // Convert price to ETH
        description: propertyData.description,
        reviews: propertyData.reviews,
        images: propertyData.images,
        address: propertyData.propertyAddress,
      });
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const handleAddReview = async () => {
    try {
      if (!signer) {
        console.error("Signer not available");
        return;
      }

      const contract = await getContract();
      const tx = await contract.addReview(
        property.id,
        reviewRating,
        newReview,
        await signer.getAddress()
      );
      await tx.wait();
      console.log("Review added successfully");
      setNewReview(""); // Clear review input
      setReviewRating(1); // Reset rating
      fetchPropertyDetails(); // Refresh property details after adding review
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const displayStars = (rating) => {
    return "*".repeat(rating); // Repeat '*' based on rating value (1-5 stars)
  };

  return property ? (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{property.title}</h1>
      <img src={property.images} alt={property.title} className="w-full h-48 object-cover mb-4" />
      <p className="text-gray-600">Price: {property.price} ETH</p>
      <p className="text-gray-600">Address: {property.address}</p>
      <p className="text-gray-600 mt-4">{property.description}</p>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Add a review..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
        />
        <select
          value={reviewRating}
          onChange={(e) => setReviewRating(parseInt(e.target.value))}
          className="block w-full p-2 border rounded mb-2"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <option key={star} value={star}>{`${star} Star${star > 1 ? "s" : ""}`}</option>
          ))}
        </select>
        <button onClick={handleAddReview} className="bg-blue-500 text-white py-1 px-2 rounded">
          Submit Review
        </button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Reviews:</h3>
        {property.reviews && property.reviews.length > 0 ? (
          property.reviews.map((review, index) => (
            <div key={index} className="border-t mt-2 pt-2">
              <p className="text-gray-800">{review.comment}</p>
              <p className="text-gray-600">Rating: {displayStars(review.rating)} </p> {/* Display stars */}
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  ) : (
    <p>Loading property details...</p>
  );
};

export default PropertyDetails;
