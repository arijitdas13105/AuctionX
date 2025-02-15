import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductList from '../components/ProductList';
 
function SearchItems() {
  const location = useLocation();
  const searchResults = location.state?.results || [];

  return (
    <>

<div className="  min-h-screen  bg-gray-50 py-10 px-4 md:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
        🛍️ Search Products  
      </h1>
      {searchResults?.length > 0 ? (
        <div className="  grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {searchResults?.map((product) => (
            <>
                <ProductList product={product}   />
            </>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-10">
          🚫  Product Not Found  
        </p>
      )}


    </div>
    </>
  );
}

 

export default SearchItems