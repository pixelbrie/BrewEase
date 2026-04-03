import React, { useState } from "react";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: "coffee" | "tea" | "latte";
};

type ModifierSelection = {
  size: "small" | "medium" | "large";
  milk: "whole" | "oat" | "almond";
  note: string;
};

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (
    item: MenuItem,
    modifiers: ModifierSelection,
    finalPrice: number,
  ) => void;
}

function MenuGrid({ items, onAddToCart }: MenuGridProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [milk, setMilk] = useState<"whole" | "oat" | "almond">("whole");
  const [note, setNote] = useState("");

  const getFinalPrice = (basePrice: number) => {
    let finalPrice = basePrice;

    if (size === "large") {
      finalPrice += 0.75;
    }

    if (milk === "oat" || milk === "almond") {
      finalPrice += 0.5;
    }

    return Number(finalPrice.toFixed(2));
  };

  const handleAddClick = (item: MenuItem) => {
    if (selectedItemId === item.id) {
      const finalPrice = getFinalPrice(item.price);

      onAddToCart(
        item,
        {
          size,
          milk,
          note,
        },
        finalPrice,
      );

      setSelectedItemId(null);
      setSize("medium");
      setMilk("whole");
      setNote("");
      return;
    }

    setSelectedItemId(item.id);
    setSize("medium");
    setMilk("whole");
    setNote("");
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-coffee-700">
        No menu items available for this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
      {items.map((item) => {
        const isOpen = selectedItemId === item.id;
        const previewPrice = isOpen ? getFinalPrice(item.price) : item.price;

        return (
          <div
            key={item.id}
            className="bg-coffee-50 border border-coffee-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm"
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-coffee-900">{item.name}</h3>
              <p className="text-coffee-700 capitalize">{item.category}</p>
              <p className="text-lg font-semibold text-coffee-800">
                ${previewPrice.toFixed(2)}
              </p>
            </div>

            {isOpen ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-semibold text-coffee-800 mb-1">
                    Size
                  </label>
                  <select
                    value={size}
                    onChange={(e) =>
                      setSize(e.target.value as "small" | "medium" | "large")
                    }
                    className="w-full rounded-md border border-coffee-300 px-3 py-2"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-coffee-800 mb-1">
                    Milk
                  </label>
                  <select
                    value={milk}
                    onChange={(e) =>
                      setMilk(e.target.value as "whole" | "oat" | "almond")
                    }
                    className="w-full rounded-md border border-coffee-300 px-3 py-2"
                  >
                    <option value="whole">Whole Milk</option>
                    <option value="oat">Oat Milk</option>
                    <option value="almond">Almond Milk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-coffee-800 mb-1">
                    Note
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Extra hot, less ice, no foam..."
                    className="w-full rounded-md border border-coffee-300 px-3 py-2"
                  />
                </div>
              </div>
            ) : null}

            <button
              onClick={() => handleAddClick(item)}
              className="mt-2 bg-coffee-800 hover:bg-coffee-900 text-white px-4 py-2 rounded-md font-semibold transition"
            >
              {isOpen ? "Confirm Add To Cart" : "Customize"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default MenuGrid;