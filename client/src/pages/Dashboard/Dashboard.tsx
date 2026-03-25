import React, { useState } from "react";
import FilterContainer from "../../layouts/FilterContainer.js";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

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
        <p className="text-xl font-semibold text-coffee-900">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-start items-start h-screen w-screen gap-4 p-8 bg-coffee-300">
      <div className="flex flex-col w-1/2 h-full gap-4">
        <motion.div
          className="flex flex-col w-full bg-white rounded-lg shadow-lg p-8 gap-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-coffee-900">
              Welcome, {user?.displayName || "User"}
            </h1>

            <p className="text-neutral-600">
              Signed in as {user?.email || "No email found"}
            </p>

            <p className="text-neutral-600">
              Role: <span className="font-semibold">{user?.role || "No role found"}</span>
            </p>

            <p className="text-neutral-600">
              Tenant: <span className="font-semibold">{user?.tenantId || "No tenant found"}</span>
            </p>
          </div>

          <div className="flex flex-row gap-3 pt-2">
            <button
              onClick={handleLogout}
              className="bg-coffee-700 text-white font-bold py-3 px-6 rounded-full"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col w-3/4 gap-4 h-full">
        <div>
          <FilterContainer />
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-8"
        >
          menuView
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;