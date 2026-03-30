import React from "react";
import { useNavigate } from "react-router-dom";

function MenuPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-coffee-300 p-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-coffee-900">POS Menu</h1>
        <p className="text-neutral-600">You signed in with the POS PIN.</p>

        <button
          onClick={() => navigate("/")}
          className="bg-coffee-700 text-white font-bold py-3 px-6 rounded-full"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default MenuPage;