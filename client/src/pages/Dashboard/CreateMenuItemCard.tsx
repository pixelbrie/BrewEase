import { useState } from "react";

type MenuCategory = "coffee" | "tea";

interface CreateMenuItemCardProps {
  onCreateMenuItem?: (item: {
    name: string;
    price: number;
    category: MenuCategory;
  }) => void;
}

function CreateMenuItemCard({ onCreateMenuItem }: CreateMenuItemCardProps) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "coffee" as MenuCategory,
  });

  const [createdMessage, setCreatedMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatedMessage("");
    setError("");

    const parsedPrice = Number(form.price);

    if (!form.name.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Please enter a valid item name and price.");
      return;
    }

    const newItem = {
      name: form.name.trim(),
      price: parsedPrice,
      category: form.category,
    };

    try {
      if (onCreateMenuItem) {
        onCreateMenuItem(newItem);
      }

      setCreatedMessage(`${newItem.name} added to menu`);

      setForm({
        name: "",
        price: "",
        category: "coffee",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create menu item.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <h2 className="text-2xl font-bold text-coffee-900 mb-4">
        Create Menu Listing
      </h2>

      <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Item name"
          className="border border-coffee-300 rounded-md p-3"
          required
        />

        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="border border-coffee-300 rounded-md p-3"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border border-coffee-300 rounded-md p-3"
        >
          <option value="coffee">coffee</option>
          <option value="tea">tea</option>
        </select>

        <button
          type="submit"
          className="bg-coffee-700 hover:bg-coffee-800 text-white px-4 py-3 rounded-md font-semibold transition"
        >
          Add Listing
        </button>
      </form>

      {createdMessage ? (
        <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-md text-sm">
          {createdMessage}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 bg-red-100 text-red-800 p-3 rounded-md text-sm">
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default CreateMenuItemCard;