import React from "react";
import OrderCard from "./Component/OrderCard";
import useOrder from "../../../Hooks/order/useOrder";

function MyOrder() {
  const { orders, loading, fetchUserOrders } = useOrder();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (orders?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold">No orders found</p>
      </div>
    );
  }

  return (
    <div className="p-2 h-full overflow-auto flex flex-col gap-5">
      {orders?.map((item) => (
        <OrderCard
          key={item.order_id}
          orderId={item.order_id}
          imageUrl={item.item_image_url}
          name={item.item_title}
          price={item.item_price}
          status={item.delivery_status}
          orderDate={item.order_date}
        />
      ))}
    </div>
  );
}

export default MyOrder;
