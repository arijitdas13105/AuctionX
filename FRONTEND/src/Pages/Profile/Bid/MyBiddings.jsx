import React from "react";
import BiddingCard from "./Component/BiddingCard";
import useBid from "../../../Hooks/Bidding/useBid";

function MyBiddings() {
  const { userBids, loading, fetchUserBids } = useBid();
  // console.log("biddings",biddings);
  return (
    <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-auto  ">
      {/* <BiddingCard/> */}
      {userBids?.length > 0 ? (
        userBids.map((bidding) => (
          <BiddingCard key={bidding.id} bidding={bidding} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center ">
          <span className="text-2xl font-bold ">No Biddings Found</span>
          <button
            className="bg-blue-400 p-2 rounded-md mt-4 "
            onClick={fetchUserBids}
          >
            Add New Bidding
          </button>
        </div>
      )}
    </div>
  );
}

export default MyBiddings;
