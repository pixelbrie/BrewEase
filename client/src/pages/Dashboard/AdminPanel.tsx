import React, { useState } from "react";
import CreateEmployeeCard from "./CreateEmployeeCard.js";
import CreateMenuItemCard from "./CreateMenuItemCard.js";

type MenuCategory = "coffee" | "tea" | "latte";

interface AdminPanelProps {
  onCreateMenuItem: (item: {
    name: string;
    price: number;
    category: MenuCategory;
  }) => void;
}

type AdminView = "create-user" | "create-menu";

function AdminPanel({ onCreateMenuItem }: AdminPanelProps) {
  const [activeView, setActiveView] = useState<AdminView>("create-user");

  return (
    <div className="flex w-full h-full min-h-0 bg-white rounded-lg shadow-lg overflow-hidden">
      <aside className="w-[220px] shrink-0 bg-coffee-900 text-white p-4 flex flex-col gap-3">
        <h2 className="text-lg font-bold border-b border-coffee-700 pb-3">
          Admin Tools
        </h2>

        <button
          onClick={() => setActiveView("create-user")}
          className={`w-full text-left px-4 py-3 rounded-md font-semibold transition ${
            activeView === "create-user"
              ? "bg-white text-coffee-900"
              : "bg-coffee-800 hover:bg-coffee-700 text-white"
          }`}
        >
          Create User
        </button>

        <button
          onClick={() => setActiveView("create-menu")}
          className={`w-full text-left px-4 py-3 rounded-md font-semibold transition ${
            activeView === "create-menu"
              ? "bg-white text-coffee-900"
              : "bg-coffee-800 hover:bg-coffee-700 text-white"
          }`}
        >
          Create Menu Item
        </button>
      </aside>

      <section className="flex-1 min-h-0 overflow-y-auto p-6 bg-white">
        {activeView === "create-user" ? (
          <CreateEmployeeCard />
        ) : (
          <CreateMenuItemCard onCreateMenuItem={onCreateMenuItem} />
        )}
      </section>
    </div>
  );
}

export default AdminPanel;