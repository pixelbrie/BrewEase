import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { LuSearch } from "react-icons/lu";

type LookupType = "phone" | "email";

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  rewardsPoints: number;
  rewardsTier: string;
};

interface CustomerLookupCardProps {
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer | null) => void;
}

function CustomerLookupCard({
  selectedCustomer,
  onCustomerSelect,
}: CustomerLookupCardProps) {
  const [lookupType, setLookupType] = useState<LookupType>("phone");
  const [searchValue, setSearchValue] = useState("");
  const [message, setMessage] = useState("");

  const mockCustomers: Customer[] = useMemo(
    () => [
      {
        id: "cust-001",
        firstName: "Bri",
        lastName: "Talley",
        phone: "9545551111",
        email: "bri@example.com",
        rewardsPoints: 125,
        rewardsTier: "Gold",
      },
      {
        id: "cust-002",
        firstName: "Chris",
        lastName: "Lopez",
        phone: "7545552222",
        email: "chris@example.com",
        rewardsPoints: 42,
        rewardsTier: "Silver",
      },
      {
        id: "cust-003",
        firstName: "Niel",
        lastName: "Rivera",
        phone: "3055553333",
        email: "niel@example.com",
        rewardsPoints: 10,
        rewardsTier: "Bronze",
      },
    ],
    [],
  );

  const handleLookup = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      setMessage("Please enter a phone number or email.");
      return;
    }

    const foundCustomer =
      lookupType === "phone"
        ? mockCustomers.find(
            (customer) =>
              customer.phone.replace(/\D/g, "") ===
              normalizedSearch.replace(/\D/g, ""),
          )
        : mockCustomers.find(
            (customer) => customer.email.toLowerCase() === normalizedSearch,
          );

    if (!foundCustomer) {
      onCustomerSelect(null);
      setMessage("Customer not found. Order will remain as guest.");
      return;
    }

    onCustomerSelect(foundCustomer);
    setMessage("Customer found.");
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
          attach rewards.
        </p>
      </div>

      <form onSubmit={handleLookup} className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <button
            type="button"
            onClick={() => setLookupType("phone")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              lookupType === "phone"
                ? "bg-coffee-700 text-white"
                : "bg-coffee-100 text-coffee-700"
            }`}
          >
            Phone
          </button>

          <button
            type="button"
            onClick={() => setLookupType("email")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              lookupType === "email"
                ? "bg-coffee-700 text-white"
                : "bg-coffee-100 text-coffee-700"
            }`}
          >
            Email
          </button>
        </div>

        <div className="flex flex-row items-center gap-2">
          <input
            type={lookupType === "phone" ? "tel" : "email"}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={
              lookupType === "phone"
                ? "Enter customer phone number"
                : "Enter customer email"
            }
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base font-medium text-neutral-800 outline-none transition-colors focus:border-coffee-700"
          />

          <button
            type="submit"
            className="rounded-lg bg-coffee-700 px-4 py-3 text-white transition-colors hover:bg-coffee-900"
          >
            <LuSearch size={20} />
          </button>
        </div>
      </form>

      {message ? <p className="text-sm text-coffee-600">{message}</p> : null}

      {selectedCustomer ? (
        <div className="rounded-lg border border-coffee-200 bg-coffee-50 p-4">
          <h3 className="text-lg font-bold text-coffee-900">
            {selectedCustomer.firstName} {selectedCustomer.lastName}
          </h3>

          <div className="mt-2 space-y-1 text-sm text-coffee-800">
            <p>Phone: {selectedCustomer.phone}</p>
            <p>Email: {selectedCustomer.email}</p>
            <p>Rewards Points: {selectedCustomer.rewardsPoints}</p>
            <p>Rewards Tier: {selectedCustomer.rewardsTier}</p>
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