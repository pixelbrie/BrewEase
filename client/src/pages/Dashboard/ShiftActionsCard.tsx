function ShiftActionsCard() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <h2 className="text-2xl font-bold text-coffee-900 mb-4">
        Shift Actions
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-md font-semibold transition">
          Drop Shift
        </button>

        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md font-semibold transition">
          Pick Up Shift
        </button>

        <button className="bg-gray-400 text-white px-4 py-3 rounded-md font-semibold cursor-not-allowed">
          Open Scheduler
        </button>
      </div>

      <p className="text-sm text-coffee-600 mt-3">
        Scheduler is static for now. This is a placeholder for the future
        scheduling feature.
      </p>
    </div>
  );
}

export default ShiftActionsCard;