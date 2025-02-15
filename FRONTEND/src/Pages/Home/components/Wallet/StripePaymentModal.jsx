import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(
  "pk_test_51LgX81SHEgAWx7EZb3IfN5mbYbOAxnsYQ7WXrmlaggS279EXYiCNxUZyqJl8W1WiPpIjRComAsANNBzLIzEDrDhs00xeY4jW3w"
);

const StripePaymentModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Deposit to Wallet</h2>
          <Elements stripe={stripePromise}>
            <PaymentForm onClose={onClose} onSuccess={onSuccess} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;
