import React from "react";
import FilterContainer from "../../layouts/FilterContainer.js";
import LoginContainer from "../../layouts/MasterAuthContainer.js";
import { motion, animate } from "motion/react";

function Dashboard() {
  return (
    // Main container for the dashboard page
    <div className="flex flex-row justify-start items-start h-screen w-screen gap-4 p-8 bg-coffee-300">
      {/* Right side of the dashboard */}

      <div className="flex flex-col w-1/2 h-full gap-4">
        {/* Login container */}
        <LoginContainer
          email=""
          password=""
          onEmailChange={() => {}}
          onPasswordChange={() => {}}
        />

        {/* Order summary view */}
        {/* Hid to do some testing */}
        {/* <motion.div
          className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          orderSummaryView
        </motion.div> */}
      </div>

      {/* Left side of the dashboard */}

      <div className="flex flex-col w-3/4 gap-4 h-full">
        {/* Filter container */}
        <div>
          <FilterContainer />
        </div>

        {/* Menu view */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-8
          "
        >
          menuView
        </motion.div>

        {/* Item detail view */}
        {/* hid for some automation */}
        {/* <motion.div
          className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-8 row-span-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          itemDetailView
        </motion.div> */}
      </div>
    </div>
  );
}

export default Dashboard;
