import React from "react";
import { motion } from "motion/react";
import type { Customer } from "./CustomerLookupCard.js";

type ModifierSelection = {
  size: "small" | "medium" | "large";
  milk: "whole" | "oat" | "almond";
  note: string;
};

export type CartItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: ModifierSelection;
};

interface CartSummaryProps {
  customer: Customer | null;
  orderNumber: string;
  items: CartItem[];
  onCheckout: () => void;
}

function CartSummary({
  customer,
  orderNumber,
  items,
  onCheckout,
}: CartSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <motion.div
      className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-6 gap-4 overflow-y-auto"
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-coffee-900">Cart Summary</h2>
        <p className="text-sm text-coffee-600">Order #: {orderNumber}</p>
        <p className="text-sm text-coffee-700">
          Customer:{" "}
          <span className="font-semibold">
            {customer ? `${customer.firstName} ${customer.lastName}` : "Guest"}
          </span>
        </p>

        {customer ? (
          <p className="text-sm text-coffee-700">
            Rewards:{" "}
            <span className="font-semibold">
              {customer.rewardsPoints} pts · {customer.rewardsTier}
            </span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        {/* when it is empty */}
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-coffee-300 p-4 text-sm text-coffee-600">
            No items in cart yet.
          </div>
        ) : (
          // when it has more than 1 item
          items.map((item) => (
            <div
              key={item.id}
              // this is the main card container
              className="rounded-lg border border-coffee-200 bg-coffee-50 p-4 shadow-md"
            >
              {/* item info constainer */}
              <div className="flex flex-row justify-between items-start gap-3">
                <div>
                  {/* title of the item */}
                  <p className="font-semibold text-coffee-900">
                    {item.name} x{item.quantity}
                  </p>

                  {/* modifiers listings */}
                  {item.modifiers ? (
                    <div className="mt-2 text-sm text-coffee-700 space-y-1">
                      <p>Size: {item.modifiers.size}</p>
                      <p>Milk: {item.modifiers.milk}</p>
                      {item.modifiers.note ? (
                        <p>Note: {item.modifiers.note}</p>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <p className="font-semibold text-coffee-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto border-t border-coffee-200 pt-4 flex flex-col gap-3">
        <div className="flex flex-row justify-between items-center">
          <span className="text-lg font-bold text-coffee-900">Subtotal</span>
          <span className="text-lg font-bold text-coffee-900">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full rounded-md bg-coffee-800 px-4 py-3 font-semibold text-white transition hover:bg-coffee-900 disabled:cursor-not-allowed disabled:bg-coffee-300 disabled:text-coffee-600"
        >
          Checkout
        </button>
      </div>
    </motion.div>
  );
}

export default CartSummary;
