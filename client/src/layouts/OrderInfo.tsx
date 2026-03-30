import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { IoMdTrash } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";

// Defines the structure of an order item, which includes
// an optional price field for calculating totals.
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price?: number;
}

// The OrderInfo component displays the list of items in the current order,
// allows editing item quantities, and removing items before proceeding to payment.
interface OrderInfoProps {
  items?: OrderItem[];
  onBack: () => void;
  onNext?: () => void;
}

function OrderInfo({ items = [], onBack, onNext }: OrderInfoProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>(items);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [draftQuantity, setDraftQuantity] = useState(1);

  useEffect(() => {
    setOrderItems(items);
  }, [items]);

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handles the removal of an item from the orderItems state.
  const handleRemoval = (itemId: string) => {
    setOrderItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    );
  };

  // Opens the edit splash and sets the current editing item and its quantity as draft.
  const handleEditOpen = (item: OrderItem) => {
    setEditingItem(item);
    setDraftQuantity(item.quantity);
  };

  // Closes the edit splash without saving changes. Resets draft quantity to 1 for next time.
  const handleEditClose = () => {
    setEditingItem(null);
    setDraftQuantity(1);
  };

  // Handles the item by updating the quantity in the orderItems state.
  // In a real app, this would also involve API calls to update the order on the backend.
  const handleSaveEdit = () => {
    if (!editingItem) {
      return;
    }
    setOrderItems((currentItems) =>
      currentItems.map((item) =>
        item.id === editingItem.id
          ? { ...item, quantity: draftQuantity }
          : item,
      ),
    );
    handleEditClose();
  };

  return (
    <>
      <motion.div
        className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-6 gap-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-coffee-600">
              Order Info
            </h2>
            <p className="text-sm text-neutral-500">
              Selected items will appear here before checkout.
            </p>
          </div>
          <div className="rounded-full bg-coffee-100 px-4 py-2 text-sm font-semibold text-coffee-900">
            {totalItems} item{totalItems === 1 ? "" : "s"}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50">
          {orderItems.length === 0 ? (
            <div className="flex h-full min-h-32 items-center justify-center text-center text-sm font-medium text-neutral-400">
              No items selected yet.
            </div>
          ) : (
            <div className="flex flex-col">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-row items-center justify-between bg-white px-4 py-3 shadow-sm border-b border-neutral-200"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-800">
                      {item.name}
                    </span>
                    <span className="text-sm text-neutral-500">
                      Qty: {item.quantity}
                    </span>
                  </div>

                  <div className="flex flex-row gap-3">
                    {typeof item.price === "number" ? (
                      <span className="font-semibold text-coffee-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    ) : null}

                    <MdModeEditOutline
                      size={24}
                      className="text-coffee-700 hover:text-coffee-900 cursor-pointer mb-2"
                      onClick={() => handleEditOpen(item)}
                    />
                    <IoMdTrash
                      size={24}
                      className="text-red-500 hover:text-red-700 cursor-pointer mb-2"
                      onClick={() => handleRemoval(item.id)}
                    />
                  </div>
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

      {/* Edit Order Item Splash */}
      {editingItem ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-coffee-900/35 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex w-full max-w-md flex-col gap-6 rounded-[2rem] bg-[#fff8ee] px-8 py-8 shadow-2xl"
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coffee-600">
                Edit Order Item
              </p>
              <h3 className="text-3xl font-bold text-coffee-900">
                {editingItem.name}
              </h3>
              <p className="text-sm text-neutral-600">
                This splash can later support menu-driven item updates too. For
                now it edits the current order item quantity.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-neutral-500">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setDraftQuantity((current) => Math.max(1, current - 1))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 text-xl font-bold text-coffee-900 transition-colors hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="min-w-10 text-center text-2xl font-bold text-coffee-900">
                    {draftQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDraftQuantity((current) => current + 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 text-xl font-bold text-coffee-900 transition-colors hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {typeof editingItem.price === "number" ? (
                <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm font-semibold text-neutral-600">
                  <span>Updated Total</span>
                  <span className="text-lg text-coffee-900">
                    ${(editingItem.price * draftQuantity).toFixed(2)}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleEditClose}
                className="rounded-full border border-coffee-700 px-6 py-3 text-sm font-bold text-coffee-700 transition-colors hover:bg-coffee-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="rounded-full bg-coffee-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-coffee-900"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </>
  );
}

export default OrderInfo;
