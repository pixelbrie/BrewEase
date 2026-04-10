import React, { useState } from "react";
import { MdAccessTime } from "react-icons/md";

function ClockInOutCard() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [lastActionTime, setLastActionTime] = useState<string | null>(null);

  const handleClockToggle = () => {
    const now = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    setIsClockedIn((prev) => !prev);
    setLastActionTime(now);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full relative overflow-hidden">
      <MdAccessTime
        className="absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 text-coffee-400 opacity-30 pointer-events-none"
        size={120}
      />

      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-2xl font-bold text-coffee-900 mb-4">
          Time Clock
        </h2>

        <p className="text-coffee-700 text-lg mb-2">
          Status: {isClockedIn ? "Clocked In" : "Clocked Out"}
        </p>

        <div className="mt-auto">
          <button
            type="button"
            onClick={handleClockToggle}
            className={`w-full py-2 rounded-md text-white font-semibold transition ${
              isClockedIn
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isClockedIn ? "Clock Out" : "Clock In"}
          </button>

          <p className="text-sm text-coffee-500 mt-3">
            {lastActionTime
              ? `Last action at ${lastActionTime}`
              : "Not clocked in yet"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClockInOutCard;