import React from "react";
import { motion } from "motion/react";
import { LuLogOut } from "react-icons/lu";

interface UserInfoSectionProps {
  displayName?: string | null;
  role?: string | null;
  tenantId?: string | null;
  onLogout: () => void;
}

function UserInfoSection({
  displayName,
  role,
  tenantId,
  onLogout,
}: UserInfoSectionProps) {
  return (
    <motion.div
      className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-6 gap-4"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-row w-full items-center justify-between">
          {/* Title */}
          <h1 className="text-3xl font-bold text-coffee-900">
            👋 Welcome! {displayName || "User"}
          </h1>
          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="bg-red-800 hover:bg-red-600 text-white font-bold py-3 px-3 rounded-full"
          >
            <LuLogOut size={20} />
          </button>
        </div>
        {/* User Info */}
        <p className="text-neutral-600 font-bold">
          Role: <span className="font-semibold">{role || "No role found"}</span>
        </p>

        <p className="text-neutral-600 font-bold">
          Tenant:{" "}
          <span className="font-semibold">{tenantId || "No tenant found"}</span>
        </p>
      </div>

      <div className="flex flex-row gap-3 pt-2"></div>
    </motion.div>
  );
}

export default UserInfoSection;
