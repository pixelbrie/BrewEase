import React, { useEffect, useState } from "react";
import FilterContainer from "../../layouts/FilterContainer.js";
import UserInfoSection from "../../layouts/UserInfoSection.js";
import CustomerLookupCard, {
  type Customer,
} from "../../layouts/CustomerLookupCard.js";
import CartSummary, { type CartItem } from "../../layouts/CartSummary.js";
import OrderReadySplash from "../../layouts/OrderReadySplash.js";
import MenuGrid from "../../pos/MenuGrid.js";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";

type MenuItem = {
  itemId: string;
  itemName: string;
  basePrice: number;
  categoryId: "coffee" | "tea";
  description?: string | null;
  previewImage?: string | null;
};

type ModifierSelection = {
  size: "small" | "medium" | "large";
  milk: "whole" | "oat" | "almond";
  note: string;
};

function generateDailyOrderNumber() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${month}${day}-${random}`;
}

function PosDashboard() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const canReturnToAdmin =
    user?.role === "admin" || user?.role === "manager";

  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "coffee" | "tea"
  >("all");

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [orderNumber, setOrderNumber] = useState(generateDailyOrderNumber());
  const [lastSubmittedOrderNumber, setLastSubmittedOrderNumber] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOrderReadyOpen, setIsOrderReadyOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState("");

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setMenuLoading(true);
        setMenuError("");

        const response = await fetch("http://localhost:8080/api/menu", {
          method: "GET",
          credentials: "include",
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : [];

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load menu");
        }

        setMenuItems(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error("Failed to load menu:", error);
        setMenuError(error.message || "Failed to load menu");
      } finally {
        setMenuLoading(false);
      }
    };

    loadMenu();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAddToCart = (
    menuItem: MenuItem,
    modifiers: ModifierSelection,
    finalPrice: number,
  ) => {
    const modifierKey = `${menuItem.itemId}-${modifiers.size}-${modifiers.milk}-${modifiers.note.trim()}`;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === modifierKey);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === modifierKey
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          id: modifierKey,
          name: menuItem.itemName,
          price: finalPrice,
          quantity: 1,
          modifiers,
        },
      ];
    });
  };

  const filteredMenuItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.categoryId === selectedCategory);

  const handleSelectCategory = (category: "all" | "coffee" | "tea") => {
    setSelectedCategory(category);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || checkoutLoading) {
      return;
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const payload = {
      items: cartItems.map((item) => ({
        itemId: item.id,
        itemName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.price * item.quantity,
        modifiers: item.modifiers || null,
      })),
      customerId: selectedCustomer?.customerId || null,
      customerName: selectedCustomer
        ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`.trim()
        : "Guest",
      orderType: "in-store",
      notes: "",
      subtotal,
      tax: 0,
      total: subtotal,
      status: "sent",
    };

    try {
      setCheckoutLoading(true);

      const response = await fetch("http://localhost:8080/api/orders", {
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
        throw new Error(data?.error || "Failed to send order");
      }

      setLastSubmittedOrderNumber(data?.orderNumber || orderNumber);
      setCartItems([]);
      setSelectedCustomer(null);
      setOrderNumber(generateDailyOrderNumber());
      setIsOrderReadyOpen(true);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(error instanceof Error ? error.message : "Failed to send order");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-coffee-300">
        <p className="text-xl font-semibold text-coffee-900">Loading POS...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row items-start h-screen w-screen gap-2 p-8 bg-coffee-300">
        <div className="flex flex-col w-3/4 h-full gap-2 min-h-0">
          <div className="w-full shrink-0">
            <UserInfoSection
              displayName={user?.displayName ?? null}
              role={user?.role ?? null}
              tenantId={null}
              onLogout={handleLogout}
              {...(canReturnToAdmin
                ? { onBackToAdmin: () => navigate("/dashboard") }
                : {})}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-2 flex-1 min-h-0">
            <div className="min-h-0 overflow-y-auto">
              <CustomerLookupCard
                selectedCustomer={selectedCustomer}
                onCustomerSelect={setSelectedCustomer}
              />
            </div>

            <div className="min-h-0">
              <CartSummary
                customer={selectedCustomer}
                orderNumber={orderNumber}
                items={cartItems}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full h-full gap-2 min-h-0">
          <div className="flex w-full shrink-0 min-h-[110px]">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex w-full h-full"
            >
              <FilterContainer
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
              />
            </motion.div>
          </div>

          <div className="flex-1 min-h-0">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-6 overflow-y-auto gap-4"
            >
              {menuLoading ? (
                <div className="flex items-center justify-center h-full text-coffee-700">
                  Loading menu...
                </div>
              ) : menuError ? (
                <div className="flex items-center justify-center h-full text-red-600">
                  {menuError}
                </div>
              ) : (
                <div className="flex-1 min-h-0">
                  <MenuGrid
                    filterKey={selectedCategory}
                    items={filteredMenuItems}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOrderReadyOpen ? (
          <OrderReadySplash
            orderNumber={lastSubmittedOrderNumber}
            onClose={() => setIsOrderReadyOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default PosDashboard;