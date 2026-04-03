import { useState } from "react";

type MenuCategory = "coffee" | "tea" | "latte";

interface CreateMenuItemCardProps {
  onCreateMenuItem: (item: {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrice = Number(form.price);

    if (!form.name.trim() || Number.isNaN(parsedPrice)) {
      return;
    }

    onCreateMenuItem({
      name: form.name.trim(),
      price: parsedPrice,
      category: form.category,
    });

    setCreatedMessage(`${form.name.trim()} added to menu`);

    setForm({
      name: "",
      price: "",
      category: "coffee",
    });
  };

  return (
    <div className="bg-coffee-50 rounded-lg p-4 h-full">
      <h2 className="text-xl font-bold text-coffee-900 mb-3">
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
          <option value="latte">latte</option>
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
    </div>
  );
}

export default CreateMenuItemCard;