import { useState } from "react";

type MenuCategory = "coffee" | "tea";

function CreateMenuItemCard() {
  const [form, setForm] = useState({
    itemName: "",
    basePrice: "",
    categoryId: "coffee" as MenuCategory,
    description: "",
  });

  const [createdMessage, setCreatedMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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

    const parsedPrice = Number(form.basePrice);

    if (!form.itemName.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Please enter a valid item name and price.");
      return;
    }

    const payload = {
      itemName: form.itemName.trim(),
      basePrice: parsedPrice,
      categoryId: form.categoryId,
      description: form.description.trim() || null,
      previewImage: null,
      sizes: ["small", "medium", "large"],
      flavors: [],
      available: true,
      taxable: true,
    };

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create menu item.");
      }

      setCreatedMessage(`${payload.itemName} added to menu`);

      setForm({
        itemName: "",
        basePrice: "",
        categoryId: "coffee",
        description: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create menu item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <h2 className="text-2xl font-bold text-coffee-900 mb-4">
        Create Menu Listing
      </h2>

      <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3">
        <input
          name="itemName"
          value={form.itemName}
          onChange={handleChange}
          placeholder="Item name"
          className="border border-coffee-300 rounded-md p-3"
          required
        />

        <input
          name="basePrice"
          type="number"
          step="0.01"
          min="0"
          value={form.basePrice}
          onChange={handleChange}
          placeholder="Price"
          className="border border-coffee-300 rounded-md p-3"
          required
        />

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="border border-coffee-300 rounded-md p-3"
        >
          <option value="coffee">coffee</option>
          <option value="tea">tea</option>
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border border-coffee-300 rounded-md p-3 min-h-[100px]"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-coffee-700 hover:bg-coffee-800 text-white px-4 py-3 rounded-md font-semibold transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Listing"}
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