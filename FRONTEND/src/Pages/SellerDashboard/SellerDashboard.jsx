import React from 'react';
import CreateItem from './components/CreateItem';
import SellerProducts from './components/SellerProducts';

function SellerDashboard() {
  return (
    <div className="flex flex-col lg:flex-row p-5 gap-6 w-full h-screen">
      {/* Create Item Section */}
      <div className="w-full lg:w-[50%] hidden sm:block  ">
        <CreateItem />
      </div>

      {/* Seller Products Section */}
      <div className="w-full lg:w-[50%] border rounded-lg p-6 overflow-auto">
        <SellerProducts />
      </div>
    </div>
  );
}

export default SellerDashboard;
 