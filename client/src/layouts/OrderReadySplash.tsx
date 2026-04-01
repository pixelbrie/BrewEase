import React from "react";
import { motion } from "motion/react";

interface OrderReadySplashProps {
  onClose: () => void; //  Callback function to close the splash and return to the dashboard
}

// The OrderReadySplash component is a modal that appears when an order is marked as ready.
// It provides feedback to the user that the order has been successfully processed and sent to the barista queue.
function OrderReadySplash({ onClose }: OrderReadySplashProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-coffee-900/35 p-8 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex w-full max-w-2xl flex-col items-center rounded-[2rem] bg-[#fff8ee] px-10 py-14 text-center shadow-2xl"
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 16 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-coffee-700 text-5xl text-white">
          ✓
        </div>
        <h2 className="text-4xl font-bold text-coffee-900">Order Ready</h2>
        <p className="mt-4 max-w-lg text-lg text-neutral-600">
          Payment was successful. The order has been sent to the barista queue.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-10 rounded-full bg-coffee-700 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-coffee-900"
        >
          Back To Dashboard
        </button>
      </motion.div>
    </motion.div>
  );
}

export default OrderReadySplash;
