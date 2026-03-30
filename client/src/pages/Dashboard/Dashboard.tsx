import React, { useState } from "react";
import FilterContainer from "../../layouts/FilterContainer.js";
import CustomerInfoSection from "../../layouts/CustomerInfoSection.js";
import OrderInfo from "../../layouts/OrderInfo.js";
import OrderReadySplash from "../../layouts/OrderReadySplash.js";
import UserInfoSection from "../../layouts/UserInfoSection.js";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";

// Mock data for order items to demonstrate the OrderInfo component.
// In a real application, this data would come from an API call based on the selected customer/order.
const mockOrderItems = [
  { id: "1", name: "Cappuccino", quantity: 2, price: 3.5 },
  { id: "2", name: "Blueberry Muffin", quantity: 1, price: 2.0 },
  { id: "3", name: "Iced Matcha Latte", quantity: 1, price: 5.25 },
  { id: "4", name: "Espresso", quantity: 2, price: 2.75 },
  { id: "5", name: "Chocolate Croissant", quantity: 1, price: 3.95 },
  { id: "6", name: "Vanilla Cold Brew", quantity: 1, price: 4.5 },
  { id: "7", name: "Chai Tea Latte", quantity: 3, price: 4.0 },
];

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [customerStep, setCustomerStep] = useState<"customer" | "order">(
    "customer",
  );
  const [showOrderReadySplash, setShowOrderReadySplash] = useState(false);

  // Handles user logout by calling the logout function from the auth context
  // and navigating back to the login page.
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
    <>
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
                items={mockOrderItems} // Replace with actual order items when available
                onBack={() => setCustomerStep("customer")}
                // For demo purposes, we show the order ready splash immediately after the order info step.
                // In a real app, this would likely be triggered by an API response indicating the order is ready.
                onNext={() => setShowOrderReadySplash(true)}
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
              {/* Filter container for menu items
              TODO: Implement filter functionality once the menu API is available */}
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
      {showOrderReadySplash ? (
        <OrderReadySplash
          onClose={() => {
            setShowOrderReadySplash(false);
            setCustomerStep("customer");
          }}
        />
      ) : null}
    </>
  );
}

export default Dashboard;
