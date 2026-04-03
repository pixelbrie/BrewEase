import { useState } from "react";
import { motion } from "motion/react";

function ClockInOutCard() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [lastAction, setLastAction] = useState("Not clocked in yet");

  const handleToggleClock = () => {
    const now = new Date().toLocaleString();

    if (isClockedIn) {
      setLastAction(`Clocked out at ${now}`);
      setIsClockedIn(false);
    } else {
      setLastAction(`Clocked in at ${now}`);
      setIsClockedIn(true);
    }
  };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col justify-between"
    >
      <div>
        <h2 className="text-xl font-bold text-coffee-900 mb-2">Time Clock</h2>
        <p className="text-coffee-700 mb-3">
          Status:{" "}
          <span className="font-semibold">
            {isClockedIn ? "Clocked In" : "Clocked Out"}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleToggleClock}
          className={`px-4 py-2 rounded-md font-semibold text-white transition ${
            isClockedIn
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isClockedIn ? "Clock Out" : "Clock In"}
        </button>

        <p className="text-sm text-coffee-600">{lastAction}</p>
      </div>
    </motion.div>
  );
}

export default ClockInOutCard;