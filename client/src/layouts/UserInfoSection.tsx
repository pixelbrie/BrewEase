import React from "react";
import brewEaseLogo from "../assets/images/BrewEaseLogoTrans.png";

function UserInfoSection({
  displayName,
  role,
  tenantId,
  onLogout,
  onBackToAdmin,
}: {
  displayName: string | null;
  role: string | null;
  tenantId?: string | null;
  onLogout: () => void;
  onBackToAdmin?: () => void;
}) {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-coffee-100 flex items-center justify-center overflow-hidden border border-coffee-200 shrink-0">
          <img
            src={brewEaseLogo}
            alt="BrewEase Logo"
            className="w-10 h-10 object-contain"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-coffee-900">
            Welcome{displayName ? `, ${displayName}` : ""}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-coffee-700">
            {role ? (
              <span className="bg-coffee-100 text-coffee-900 px-3 py-1 rounded-full font-semibold capitalize">
                {role}
              </span>
            ) : null}

            {tenantId ? (
              <span className="bg-coffee-50 text-coffee-700 px-3 py-1 rounded-full">
                {tenantId}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {onBackToAdmin ? (
          <button
            type="button"
            onClick={onBackToAdmin}
            className="bg-coffee-100 hover:bg-coffee-200 text-coffee-900 px-4 py-2 rounded-md font-semibold transition"
          >
            Back to Admin
          </button>
        ) : null}

        <button
          type="button"
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserInfoSection;