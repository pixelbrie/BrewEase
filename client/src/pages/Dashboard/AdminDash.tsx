import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import UserInfoSection from "../../layouts/UserInfoSection.js";

type AdminView = "create-user" | "reports";

function AdminDash() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [activeView, setActiveView] = useState<AdminView>("create-user");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-coffee-300">
        <p className="text-xl font-semibold text-coffee-900">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-coffee-300 p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <UserInfoSection
          displayName={user?.displayName ?? null}
          role={user?.role ?? null}
          tenantId={null}
          onLogout={handleLogout}
        />

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex w-full min-h-[650px] bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <aside className="w-[240px] shrink-0 bg-coffee-900 text-white p-4 flex flex-col gap-3">
            <h2 className="text-xl font-bold border-b border-coffee-700 pb-3">
              Admin Panel
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
              onClick={() => setActiveView("reports")}
              className={`w-full text-left px-4 py-3 rounded-md font-semibold transition ${
                activeView === "reports"
                  ? "bg-white text-coffee-900"
                  : "bg-coffee-800 hover:bg-coffee-700 text-white"
              }`}
            >
              Reports
            </button>

            <button
              onClick={() => navigate("/pos")}
              className="mt-auto w-full text-left px-4 py-3 rounded-md font-semibold bg-coffee-700 hover:bg-coffee-600 transition"
            >
              Open POS
            </button>
          </aside>

          <section className="flex-1 p-6 overflow-y-auto bg-white">
            {activeView === "create-user" ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold text-coffee-900">Create User</h2>
                <p className="text-coffee-700">
                  Add new employees and assign their role.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border border-coffee-300 rounded-md p-3"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="border border-coffee-300 rounded-md p-3"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="border border-coffee-300 rounded-md p-3"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="border border-coffee-300 rounded-md p-3"
                  />
                  <select className="border border-coffee-300 rounded-md p-3">
                    <option value="barista">barista</option>
                    <option value="manager">manager</option>
                    <option value="admin">admin</option>
                    <option value="kitchen">kitchen</option>
                  </select>
                </div>

                <button className="w-fit bg-coffee-800 hover:bg-coffee-900 text-white px-6 py-3 rounded-md font-semibold transition">
                  Create Employee
                </button>
              </div>
            ) : null}

            {activeView === "reports" ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold text-coffee-900">Reports</h2>
                <p className="text-coffee-700">
                  View high-level operational metrics.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-coffee-50 border border-coffee-200 rounded-lg p-4">
                    <p className="text-sm text-coffee-600">Orders Today</p>
                    <p className="text-2xl font-bold text-coffee-900">148</p>
                  </div>

                  <div className="bg-coffee-50 border border-coffee-200 rounded-lg p-4">
                    <p className="text-sm text-coffee-600">Revenue</p>
                    <p className="text-2xl font-bold text-coffee-900">$1,284</p>
                  </div>

                  <div className="bg-coffee-50 border border-coffee-200 rounded-lg p-4">
                    <p className="text-sm text-coffee-600">Top Item</p>
                    <p className="text-2xl font-bold text-coffee-900">Latte</p>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDash;