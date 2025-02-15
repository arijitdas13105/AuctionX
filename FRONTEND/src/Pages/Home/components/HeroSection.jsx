import React, { useEffect, useState } from "react";
import HeroVideo2 from "../../../assets/HeroVideo2.mp4";
import useItems from "../../../Hooks/Items/useItems";
import ProductList from "./ProductList";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();
  const { availableItems, fetchAvailableItems, loading } = useItems();
  const [searchResults, setSearchResults] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetchAvailableItems();
  }, []);
  console.log("availableItems in Hero", availableItems);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      const filteredItems = availableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
          item.description.toLowerCase().includes(inputValue.toLowerCase())
      );

      console.log("Search Results:", filteredItems);

      setSearchResults(filteredItems);
      navigate("/search", { state: { results: filteredItems } });
    } else {
      console.log("Input is empty. No search performed.");
      setSearchResults([]);
    }
  };
  return (
    <>
      <div className="relative w-full h-[400px] p-3 overflow-hidden ">
        <video
          src={HeroVideo2}
          autoPlay
          loop
          muted
          className="absolute inset-0 min-w-full min-h-full object-fill"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
          <h2 className="text-white font-bold text-3xl p-4 rounded">
            Find, Bid, Sell – Your Marketplace for Everyone!
          </h2>
          <div className="  flex flex-col sm:flex-row gap-2 w-full max-w-md items-center ">
            <input
              type="text"
              placeholder="Search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="sm:w-[400px] w-52  p-2 rounded-md"
            />
            <button
              onClick={() => handleSubmit()}
              className="bg-blue-400 p-2 w-fit text-white font-bold rounded-md"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroSection;
