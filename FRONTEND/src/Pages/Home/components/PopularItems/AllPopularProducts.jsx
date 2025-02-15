import React, { useEffect } from 'react'
import useItems from '../../../../Hooks/Items/useItems';
import ProductList from '../ProductList';

function AllPopularProducts() {
  const{popularItems,fetchPopularItems}=useItems();
useEffect(()=>{
  fetchPopularItems()
},[])
  console.log("popularItems",popularItems);
  if (!popularItems || popularItems.length === 0) {
    return <div className="text-center text-red-500 font-bold">No popular items available</div>;
  }
  return (
    <>
      <div className="  min-h-screen  bg-gray-50 py-10 px-4 md:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
        🛍️ Popular Products  
      </h1>

      {popularItems?.length > 0 ? (
        <div className="  grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {popularItems?.map((product) => (
            <>
                <ProductList product={product} mode ="popular" />
            </>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-10">
          🚫 No Popular products found  
        </p>
      )}
    </div>
    </>
  )
}

export default AllPopularProducts