import React, { useState } from "react";
import { motion } from "motion/react";
import { LuSearch, LuUserPlus } from "react-icons/lu";

export type Customer = {
  customerId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  totalSpent?: number;
  lastVisit?: any;
};

interface CustomerLookupCardProps {
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer | null) => void;
}

function getRewardTier(points: number) {
  if (points >= 100) return "Gold";
  if (points >= 40) return "Silver";
  return "Bronze";
}

function CustomerLookupCard({
  selectedCustomer,
  onCustomerSelect,
}: CustomerLookupCardProps) {
  const [searchValue, setSearchValue] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!searchValue.trim()) {
      setMessage("Enter phone number or email");
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams({
        query: searchValue.trim(),
      });

      const res = await fetch(
        `http://localhost:8080/api/customers/lookup?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        onCustomerSelect(null);
        setMessage(data?.error || "Customer not found");
        return;
      }

      onCustomerSelect(data);
      setMessage("Customer found");
      setShowCreate(false);
    } catch (err) {
      console.error("Lookup failed:", err);
      setMessage("Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!form.firstName.trim()) {
      setMessage("First name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.error || "Failed to create customer");
        return;
      }

      onCustomerSelect(data);
      setMessage("Customer created and attached to order");
      setShowCreate(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      console.error("Create customer failed:", err);
      setMessage("Create customer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col w-full bg-white rounded-lg shadow-lg p-6 gap-4"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-coffee-900">Customer Lookup</h2>
        <p className="text-sm text-coffee-600">
          Orders start as guest by default. Search by phone number or email to
          attach a customer.
        </p>
      </div>

      <form onSubmit={handleLookup} className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Enter customer phone number or email"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base font-medium text-neutral-800 outline-none transition-colors focus:border-coffee-700"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-coffee-700 px-4 py-3 text-white transition-colors hover:bg-coffee-900 disabled:opacity-60"
          >
            <LuSearch size={20} />
          </button>
        </div>
      </form>

      <div className="flex flex-row gap-2">
        <button
          type="button"
          onClick={() => setShowCreate((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-md bg-coffee-100 hover:bg-coffee-200 px-4 py-2 text-sm font-semibold text-coffee-800 transition"
        >
          <LuUserPlus size={18} />
          {showCreate ? "Close Signup" : "Sign Up Customer"}
        </button>
      </div>

      {showCreate ? (
        <form
          onSubmit={handleCreate}
          className="rounded-lg border border-coffee-200 bg-coffee-50 p-4 grid grid-cols-1 gap-3"
        >
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleCreateChange}
            placeholder="First Name"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3"
            required
          />

          <input
            name="lastName"
            value={form.lastName}
            onChange={handleCreateChange}
            placeholder="Last Name"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleCreateChange}
            placeholder="Email"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3"
          />

          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleCreateChange}
            placeholder="Phone Number"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-coffee-800 hover:bg-coffee-900 text-white px-4 py-3 font-semibold transition disabled:opacity-60"
          >
            Create Customer
          </button>
        </form>
      ) : null}

      {message ? <p className="text-sm text-coffee-600">{message}</p> : null}

      {selectedCustomer ? (
        <div className="rounded-lg border border-coffee-200 bg-coffee-50 p-4">
          <h3 className="text-lg font-bold text-coffee-900">
            {selectedCustomer.firstName} {selectedCustomer.lastName}
          </h3>

          <div className="mt-2 space-y-1 text-sm text-coffee-800">
            <p>Phone: {selectedCustomer.phone || "—"}</p>
            <p>Email: {selectedCustomer.email || "—"}</p>
            <p>Loyalty Points: {selectedCustomer.loyaltyPoints ?? 0}</p>
            <p>
              Rewards Tier: {getRewardTier(selectedCustomer.loyaltyPoints ?? 0)}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-coffee-300 bg-coffee-50 p-4 text-sm text-coffee-700">
          No customer attached. This order is currently a guest order.
        </div>
      )}
    </motion.div>
  );
}

export default CustomerLookupCard;