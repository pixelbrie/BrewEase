import { useState } from "react";
import {
  getMenuItemImage,
  withMenuItemImage,
} from "../../utils/menuImageMap.js";

type MenuCategory = "coffee" | "tea";

type PresetImageKey =
  | ""
  | "latte"
  | "espresso"
  | "americano"
  | "cappuccino"
  | "matcha"
  | "green tea"
  | "black tea"
  | "chai tea"
  | "herbal tea";

const presetOptions: Array<{
  value: PresetImageKey;
  label: string;
  category: MenuCategory;
}> = [
  { value: "latte", label: "Latte", category: "coffee" },
  { value: "espresso", label: "Espresso", category: "coffee" },
  { value: "americano", label: "Americano", category: "coffee" },
  { value: "cappuccino", label: "Cappuccino", category: "coffee" },
  { value: "matcha", label: "Matcha", category: "tea" },
  { value: "green tea", label: "Green Tea", category: "tea" },
  { value: "black tea", label: "Black Tea", category: "tea" },
  { value: "chai tea", label: "Chai Tea", category: "tea" },
  { value: "herbal tea", label: "Herbal Tea", category: "tea" },
];

function CreateMenuItemCard() {
  const [form, setForm] = useState({
    itemName: "",
    basePrice: "",
    categoryId: "coffee" as MenuCategory,
    description: "",
    presetImageKey: "" as PresetImageKey,
  });

  const [createdMessage, setCreatedMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const nextForm = {
        ...prev,
        [name]: value,
      };

      if (name === "categoryId") {
        const selectedCategory = value as MenuCategory;

        const selectedPreset = presetOptions.find(
          (option) => option.value === prev.presetImageKey,
        );

        if (selectedPreset && selectedPreset.category !== selectedCategory) {
          nextForm.presetImageKey = "";
        }
      }

      return nextForm;
    });
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

    const previewImage = form.presetImageKey
      ? getMenuItemImage(form.presetImageKey, form.categoryId)
      : getMenuItemImage(form.itemName.trim(), form.categoryId);

    const payload = {
      itemName: form.itemName.trim(),
      basePrice: parsedPrice,
      categoryId: form.categoryId,
      description: form.description.trim() || null,
      previewImage,
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
        presetImageKey: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create menu item.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPresetOptions = presetOptions.filter(
    (option) => option.category === form.categoryId,
  );

  const previewItem = withMenuItemImage({
    itemName: form.presetImageKey || form.itemName,
    categoryId: form.categoryId,
    previewImage: null,
  });

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

        <select
          name="presetImageKey"
          value={form.presetImageKey}
          onChange={handleChange}
          className="border border-coffee-300 rounded-md p-3"
        >
          <option value="">Select preset image</option>

          {filteredPresetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border border-coffee-300 rounded-md p-3 min-h-[100px]"
        />

        <div className="border border-coffee-200 rounded-md p-3 bg-coffee-50">
          <p className="text-sm font-semibold text-coffee-800 mb-2">
            Image Preview
          </p>

          {previewItem.previewImage ? (
            <img
              src={previewItem.previewImage}
              alt={form.itemName || "Preset preview"}
              className="w-full h-40 object-cover rounded-md border border-coffee-200"
            />
          ) : (
            <div className="w-full h-40 rounded-md border border-coffee-200 bg-white flex items-center justify-center text-sm text-coffee-500">
              No preview available
            </div>
          )}
        </div>

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