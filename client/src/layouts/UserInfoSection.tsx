import React from "react";
import { motion } from "motion/react";
import { LuArrowLeft, LuLogOut } from "react-icons/lu";

interface UserInfoSectionProps {
  displayName?: string | null;
  role?: string | null;
  tenantId?: string | null;
  onLogout: () => void;
  onBackToAdmin?: () => void;
}

function UserInfoSection({
  displayName,
  role,
  tenantId,
  onLogout,
  onBackToAdmin,
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
          <div className="flex items-center gap-3">
            {onBackToAdmin ? (
              <button
                type="button"
                onClick={onBackToAdmin}
                className="flex items-center gap-2 rounded-full bg-coffee-800 px-4 py-3 font-bold text-white transition hover:bg-coffee-900"
              >
                <LuArrowLeft size={18} />
                <span>Admin</span>
              </button>
            ) : null}

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full bg-red-800 px-3 py-3 font-bold text-white transition hover:bg-red-600"
            >
              <LuLogOut size={20} />
            </button>
          </div>
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
