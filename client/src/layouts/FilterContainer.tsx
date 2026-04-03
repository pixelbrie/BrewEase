import React from "react";
import { motion } from "motion/react";

type FilterCategory = "all" | "coffee" | "tea" | "latte";

interface FilterContainerProps {
  selectedCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
}

function FilterContainer({
  selectedCategory,
  onSelectCategory,
}: FilterContainerProps) {
  const baseButtonClass =
    "px-4 py-3 rounded-lg font-semibold transition border text-sm md:text-base";

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-row flex-wrap justify-center items-center h-full w-full gap-2 bg-white rounded-lg shadow-lg p-4"
    >
      <button
        onClick={() => onSelectCategory("all")}
        className={`${baseButtonClass} ${
          selectedCategory === "all"
            ? "bg-coffee-800 text-white border-coffee-800"
            : "bg-coffee-50 text-coffee-800 border-coffee-200"
        }`}
      >
        All
      </button>

      <button
        onClick={() => onSelectCategory("coffee")}
        className={`${baseButtonClass} ${
          selectedCategory === "coffee"
            ? "bg-coffee-800 text-white border-coffee-800"
            : "bg-coffee-50 text-coffee-800 border-coffee-200"
        }`}
      >
        Coffee
      </button>

      <button
        onClick={() => onSelectCategory("tea")}
        className={`${baseButtonClass} ${
          selectedCategory === "tea"
            ? "bg-coffee-800 text-white border-coffee-800"
            : "bg-coffee-50 text-coffee-800 border-coffee-200"
        }`}
      >
        Tea
      </button>

      <button
        onClick={() => onSelectCategory("latte")}
        className={`${baseButtonClass} ${
          selectedCategory === "latte"
            ? "bg-coffee-800 text-white border-coffee-800"
            : "bg-coffee-50 text-coffee-800 border-coffee-200"
        }`}
      >
        Lattes
      </button>
    </motion.div>
  );
}

export default FilterContainer;