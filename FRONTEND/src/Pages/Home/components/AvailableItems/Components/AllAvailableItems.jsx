import React, { useEffect } from 'react'
import useItems from '../../../../../Hooks/Items/useItems';
import ProductList from '../../ProductList';

function AllAvailableItems() {
    const{availableItems,fetchAvailableItems}=useItems();
    useEffect(()=>{
        fetchAvailableItems();
    },[])
    console.log("availableItems",availableItems);
    if (!availableItems || availableItems.length === 0) {
      return <div className="text-center text-red-500 font-bold">No   items available</div>;
    }
    return (
      <>
        <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          🛍️ Available Products  
        </h1>
  
        {availableItems?.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {availableItems?.map((product) => (
              <>
                  <ProductList product={product}  />
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

export default AllAvailableItems