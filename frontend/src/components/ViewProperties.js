import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract"; // Replace with your contract utility function

const ViewProperties = () => {
  const [properties, setProperties] = useState([]);
  const [propertyToEdit, setPropertyToEdit] = useState({
    id: null,
    title: "",
    category: "",
    images: "",
    address: "",
    description: "",
    price: "",
  });
  const [signer, setSigner] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [reviewRating, setReviewRating] = useState(1);
  const [reviewsVisible, setReviewsVisible] = useState({}); // Track visibility of reviews per property

  // Initialize provider and signer
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

  // Fetch all properties from the smart contract
  const fetchProperties = async () => {
    try {
      const contract = await getContract();
      const propertiesData = await contract.getAllProperty();
      setProperties(
        propertiesData.map((p) => ({
          id: p.productID.toNumber(),
          title: p.propertyTitle,
          category: p.category,
          images: p.images,
          address: p.propertyAddress,
          description: p.description,
          price: ethers.utils.formatEther(p.price), // Convert price to ETH
          reviews: p.reviews,
        }))
      );
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  // Update property details
  const handleUpdateProperty = async () => {
    try {
      if (!signer) {
        console.error("Signer not available");
        return;
      }
      const contract = await getContract();
      const tx = await contract.updateProperty(
        await signer.getAddress(),
        propertyToEdit.id,
        propertyToEdit.title,
        propertyToEdit.category,
        propertyToEdit.images,
        propertyToEdit.address,
        propertyToEdit.description
      );
      await tx.wait();
      console.log("Property updated successfully");
      setPropertyToEdit({ id: null, title: "", category: "", images: "", address: "", description: "", price: "" });
      fetchProperties();
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  // Delete property
  const handleDeleteProperty = async (propertyId) => {
    try {
      const contract = await getContract();
      const tx = await contract.deleteProperty(propertyId);
      await tx.wait();
      console.log("Property deleted successfully");
      fetchProperties();
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  // Buy a property
  const handleBuyProperty = async (propertyId, price) => {
    try {
      if (!signer) {
        console.error("Signer not available");
        return;
      }

      const buyerAddress = await signer.getAddress();
      const priceInWei = ethers.utils.parseEther(price);
      const contract = await getContract();

      const tx = await contract.buyProperty(propertyId, buyerAddress, {
        value: priceInWei,
      });
      await tx.wait();
      console.log("Property bought successfully");
      alert("Congratulations ! Property bought successfully");
      fetchProperties(); // Refresh properties list after purchase
    } catch (error) {
      console.error("Error buying property:", error);
    }
  };

  // Add a review for a property
  const handleAddReview = async (propertyId) => {
    try {
      if (!signer) {
        console.error("Signer not available");
        return;
      }

      const contract = await getContract();
      const tx = await contract.addReview(
        propertyId,
        reviewRating,
        newReview,
        await signer.getAddress()
      );
      await tx.wait();
      console.log("Review added successfully");
      setNewReview(""); // Clear review input
      setReviewRating(1); // Reset rating
      fetchProperties(); // Refresh property list
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  // Like a review
  const handleLikeReview = async (propertyId, reviewIndex) => {
    try {
      if (!signer) {
        console.error("Signer not available");
        return;
      }
      const contract = await getContract();
      const tx = await contract.likeReview(propertyId, reviewIndex, await signer.getAddress());
      await tx.wait();
      console.log("Review liked successfully");
      fetchProperties(); // Refresh after liking a review
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  // Toggle visibility of reviews
  const toggleReviews = (propertyId) => {
    setReviewsVisible((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  // Fetch properties on initial load
  useEffect(() => {
    fetchProperties();
  }, []);

  // Function to display stars for ratings
  const displayStars = (rating) => {
    return "*".repeat(rating); // Repeat '*' based on rating value (1-5 stars)
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="border rounded-lg shadow-md bg-white overflow-hidden">
            <img src={property.images} alt={property.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800">{property.title}</h2>
              <p className="text-gray-600">Price: {property.price} ETH</p>
              <p className="text-gray-600">Category: {property.category}</p>
              <p className="text-gray-600">Address: {property.address}</p>
              <p className="text-gray-600">{property.description}</p>

              <button onClick={() => handleBuyProperty(property.id, property.price)} className="bg-green-500 text-white py-1 px-2 rounded mt-4">
                Buy Property
              </button>

              {/* Reviews Toggle */}
              <button onClick={() => toggleReviews(property.id)} className="bg-blue-500 text-white py-1 px-2 rounded mt-4 ml-2">
                {reviewsVisible[property.id] ? "Hide Reviews" : "Show Reviews"}
              </button>

              {/* Reviews */}
              {reviewsVisible[property.id] && (
                <div className="mt-4">
                  <h3 className="font-semibold">Reviews:</h3>
                  {property.reviews && property.reviews.length > 0 ? (
                    property.reviews.map((review, index) => (
                      <div key={index} className="border-t mt-2 pt-2">
                        <p className="text-gray-800">{review.comment}</p>
                        <p className="text-gray-600">Rating: {displayStars(review.rating)}</p>
                        <button onClick={() => handleLikeReview(property.id, index)} className="text-blue-500 mt-2">
                          Like ({review.likes || 0})
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              )}

              {/* Review Submission */}
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
                <button onClick={() => handleAddReview(property.id)} className="bg-blue-500 text-white py-1 px-2 rounded">
                  Submit Review
                </button>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() =>
                    setPropertyToEdit({
                      id: property.id,
                      title: property.title,
                      category: property.category,
                      images: property.images,
                      address: property.address,
                      description: property.description,
                      price: property.price,
                    })
                  }
                  className="bg-yellow-500 text-white py-1 px-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Property Modal */}
      {propertyToEdit.id && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Property</h2>
            <input
              type="text"
              placeholder="Title"
              value={propertyToEdit.title}
              onChange={(e) => setPropertyToEdit({ ...propertyToEdit, title: e.target.value })}
              className="block w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Category"
              value={propertyToEdit.category}
              onChange={(e) => setPropertyToEdit({ ...propertyToEdit, category: e.target.value })}
              className="block w-full p-2 mb-4 border rounded"
            />
            <textarea
              placeholder="Description"
              value={propertyToEdit.description}
              onChange={(e) => setPropertyToEdit({ ...propertyToEdit, description: e.target.value })}
              className="block w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={propertyToEdit.images}
              onChange={(e) => setPropertyToEdit({ ...propertyToEdit, images: e.target.value })}
              className="block w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={propertyToEdit.address}
              onChange={(e) => setPropertyToEdit({ ...propertyToEdit, address: e.target.value })}
              className="block w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Price"
              value={propertyToEdit.price}
              onChange={(e) => setPropertyToEdit({ ...propertyToEdit, price: e.target.value })}
              className="block w-full p-2 mb-4 border rounded"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUpdateProperty}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={() => setPropertyToEdit({ id: null, title: "", category: "", images: "", address: "", description: "", price: "" })}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProperties;
