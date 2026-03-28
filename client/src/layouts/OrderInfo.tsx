import React from "react";
import { motion } from "motion/react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price?: number;
}

interface OrderInfoProps {
  items?: OrderItem[];
  onBack: () => void;
  onNext?: () => void;
}

function OrderInfo({ items = [], onBack, onNext }: OrderInfoProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-6 gap-4"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-coffee-900">Order Info</h2>
          <p className="text-sm text-neutral-500">
            Selected items will appear here before checkout.
          </p>
        </div>
        <div className="rounded-full bg-coffee-100 px-4 py-2 text-sm font-semibold text-coffee-900">
          {totalItems} item{totalItems === 1 ? "" : "s"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        {items.length === 0 ? (
          <div className="flex h-full min-h-32 items-center justify-center text-center text-sm font-medium text-neutral-400">
            No items selected yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-neutral-800">
                    {item.name}
                  </span>
                  <span className="text-sm text-neutral-500">
                    Qty: {item.quantity}
                  </span>
                </div>
                {typeof item.price === "number" ? (
                  <span className="font-semibold text-coffee-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex w-full items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-coffee-700 px-6 py-3 text-sm font-bold text-coffee-700 transition-colors hover:bg-coffee-100"
        >
          Back To Customer
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-coffee-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-coffee-900"
        >
          Pay
        </button>
      </div>
    </motion.div>
  );
}

export default OrderInfo;
