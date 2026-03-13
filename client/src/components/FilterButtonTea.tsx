import React, { useState } from "react";
import { motion, press, animate } from "motion/react";

interface FilterButtonTeaParam {
  label: string;
  subLabel: string;
  bgImage: string;
  onClick?: () => void;
  className?: string;
}

function FilterButtonTea({
  className = "",
  label = "Tea",
  subLabel = "10 items",
  bgImage,
  onClick = () => {
    console.log("Filter button clicked");
  },
}: FilterButtonTeaParam) {
  const handlePress = () => {
    press("#filter-button", (element: any) => {
      animate(element, { scale: 0.9 }, { duration: 0.3, ease: "easeInOut" });

      return () => {
        animate(element, { scale: 1 }, { duration: 0.3, ease: "easeOut" });
      };
    });
    onClick();
  };

  return (
    <motion.div
      id="filter-button"
      onClick={handlePress}
      className={`w-1/2 h-full rounded-2xl flex items-start text-left p-8 cursor-pointer shadow-lg ${className}`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "20% 40%",
      }}
    >
      <div className="flex flex-col w-full h-1/3 text-lefts">
        <p className="text-white font-bold text-3xl">{label}</p>
        <p className="text-slate-200 text-md opacity-70">{subLabel}</p>
      </div>
    </motion.div>
  );
}

export default FilterButtonTea;
