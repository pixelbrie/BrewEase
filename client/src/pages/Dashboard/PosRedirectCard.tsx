import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

function PosRedirectCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col justify-between"
    >
      <div>
        <h2 className="text-xl font-bold text-coffee-900 mb-2">
          Point of Sale
        </h2>
        <p className="text-coffee-700">
          Open the POS system to start taking customer orders.
        </p>
      </div>

      <button
        onClick={() => navigate("/menu")}
        className="mt-4 bg-coffee-800 hover:bg-coffee-900 text-white px-4 py-2 rounded-md font-semibold transition"
      >
        Go to POS
      </button>
    </motion.div>
  );
}

export default PosRedirectCard;