import React from 'react';

const Home = () => {
  return (
    <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url(/home.jpg)" }}>
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-start w-full h-full px-8">
        <h1 className="text-4xl md:text-5xl text-white font-semibold leading-tight mb-6 max-w-xl">
          Discover Your Dream Home
        </h1>

        <p className="text-lg md:text-xl text-white mb-8 max-w-3xl">
          Our real estate platform leverages the power of blockchain technology to make property transactions
          secure, transparent, and efficient. Browse through a wide variety of residential, commercial, and industrial
          properties available for sale or rent.
        </p>

        {/* Explore All Button */}
        <a href="/view-properties" className="bg-yellow-500 text-black py-3 px-10 rounded-full text-lg font-semibold hover:bg-yellow-400 transition duration-300">
          Explore All Properties
        </a>
      </div>
    </div>
  );
};

export default Home;
