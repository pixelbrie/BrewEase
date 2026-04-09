import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

type MenuItem = {
  itemId: string;
  itemName: string;
  basePrice: number;
  categoryId: "coffee" | "tea";
  description?: string | null;
  previewImage?: string | null;
};

function MenuManagementCard() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:8080/api/menu", {
        method: "GET",
        credentials: "include",
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : [];

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load menu items");
      }

      setMenuItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load menu items:", err);
      setError(err.message || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async (itemId: string, itemName: string) => {
    const confirmed = window.confirm(`Delete "${itemName}" from the menu?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(itemId);

      const response = await fetch(`http://localhost:8080/api/menu/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete menu item");
      }

      setMenuItems((current) =>
        current.filter((item) => item.itemId !== itemId)
      );
      setOpenMenuId(null);
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err.message || "Failed to delete menu item");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-coffee-900">Manage Menu</h2>

        <button
          type="button"
          onClick={loadMenuItems}
          className="rounded-md bg-coffee-100 px-4 py-2 text-sm font-semibold text-coffee-900 hover:bg-coffee-200 transition"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-coffee-700">Loading menu items...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : menuItems.length === 0 ? (
        <div className="text-coffee-700">No menu items found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {menuItems.map((item) => (
            <div
              key={item.itemId}
              className="relative border border-coffee-200 rounded-lg bg-coffee-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  {item.previewImage ? (
                    <img
                      src={item.previewImage}
                      alt={item.itemName}
                      className="w-20 h-20 rounded-lg object-cover border border-coffee-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-coffee-100 border border-coffee-200 flex items-center justify-center text-sm text-coffee-500">
                      No Image
                    </div>
                  )}

                  <div>
                    <p className="text-lg font-bold text-coffee-900">
                      {item.itemName}
                    </p>

                    <p className="text-sm text-coffee-700 capitalize">
                      {item.categoryId}
                    </p>

                    <p className="text-sm font-semibold text-coffee-800 mt-1">
                      ${Number(item.basePrice).toFixed(2)}
                    </p>

                    {item.description ? (
                      <p className="text-sm text-coffee-600 mt-1">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div
                  className="relative"
                  ref={openMenuId === item.itemId ? dropdownRef : null}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuId((current) =>
                        current === item.itemId ? null : item.itemId
                      )
                    }
                    className="rounded-full p-2 hover:bg-coffee-200 transition"
                  >
                    <BsThreeDotsVertical className="text-coffee-900" />
                  </button>

                  {openMenuId === item.itemId ? (
                    <div className="absolute right-0 mt-2 w-36 rounded-lg border border-coffee-200 bg-white shadow-lg z-20">
                      <button
                        type="button"
                        onClick={() => {
                          alert("Edit is next. Delete is wired first.");
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-coffee-900 hover:bg-coffee-50 transition"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.itemId, item.itemName)}
                        disabled={deletingId === item.itemId}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                      >
                        {deletingId === item.itemId ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuManagementCard;