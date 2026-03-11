import React from "react";
import FilterContainer from "../../layouts/FilterContainer.js";
import LoginContainer from "../../layouts/LoginContainer.js";
import { motion, animate } from "motion/react";

function Dashboard() {
  return (
    // Main container for the dashboard page
    <div className="flex flex-row justify-start items-start h-screen w-screen gap-4 p-8 bg-coffee-300">
      {/* Left side of the dashboard */}
      <div className="flex flex-col w-3/4 gap-4 h-full">
        {/* Filter container */}
        <FilterContainer />

        {/* Menu view */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col w-full h-3/4 bg-white rounded-lg shadow-lg p-8"
        >
          menuView
        </motion.div>

        {/* Item detail view */}
        <motion.div
          className="flex flex-col w-full h-1/4 bg-white rounded-lg shadow-lg p-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          itemDetailView
        </motion.div>
      </div>

      {/* Right side of the dashboard */}

      <div className="flex flex-col w-1/4 h-full gap-4">
        {/* Login container */}
        <LoginContainer
          email=""
          password=""
          onEmailChange={() => {}}
          onPasswordChange={() => {}}
        />

        {/* Order summary view */}
        <motion.div
          className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          orderSummaryView
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
