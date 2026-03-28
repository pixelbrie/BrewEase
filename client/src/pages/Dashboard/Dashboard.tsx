import React, { useState } from "react";
import FilterContainer from "../../layouts/FilterContainer.js";
import CustomerInfoSection from "../../layouts/CustomerInfoSection.js";
import OrderInfo from "../../layouts/OrderInfo.js";
import UserInfoSection from "../../layouts/UserInfoSection.js";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [customerStep, setCustomerStep] = useState<"customer" | "order">(
    "customer"
  );

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
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-start h-screen w-screen gap-2 p-8 bg-coffee-300">
      {/* Left Column */}
      <div className="flex flex-col w-3/4 h-full items-start justify-start gap-2 min-h-0">
        {/* User Info Section */}
        <div className="flex flex-col w-full basis-1/4 min-h-0">
          <UserInfoSection
            displayName={user?.displayName ?? null}
            role={user?.role ?? null}
            tenantId={user?.tenantId ?? null}
            onLogout={handleLogout}
          />
        </div>

        {/* Customer Info Section and Order Info Section */}
        <div className="flex flex-col w-full basis-3/4 min-h-0">
          {customerStep === "customer" ? (
            <CustomerInfoSection onNext={() => setCustomerStep("order")} />
          ) : (
            <OrderInfo
              items={[]}
              onBack={() => setCustomerStep("customer")}
            />
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col w-full h-full gap-2 min-h-0">
        <div className="flex w-full basis-1/4 min-h-0">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex w-full h-full"
          >
            <FilterContainer />
          </motion.div>
        </div>

        <div className="flex w-full basis-3/4 min-h-0">
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
    </div>
  );
}

export default Dashboard;
