import React from "react";
import { motion } from "motion/react";
import coffeeFilterBackground from "../assets/images/bg-filterButton-coffee.png";
import teaFilterBackground from "../assets/images/bg-filterButton-matcha.png";

type FilterCategory = "all" | "coffee" | "tea";

interface FilterContainerProps {
  selectedCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
}

const filterButtons: Array<{
  category: FilterCategory;
  label: string;
  backgroundImage?: string;
}> = [
  { category: "all", label: "All" },
  {
    category: "tea",
    label: "Tea",
    backgroundImage: teaFilterBackground,
  },
  {
    category: "coffee",
    label: "Coffees",
    backgroundImage: coffeeFilterBackground,
  },
];

function FilterContainer({
  selectedCategory,
  onSelectCategory,
}: FilterContainerProps) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid h-full w-full grid-cols-1 gap-2 rounded-lg bg-white p-4 shadow-lg md:grid-cols-3"
    >
      {filterButtons.map(({ category, label, backgroundImage }) => {
        const isSelected = selectedCategory === category;

        return (
          <motion.button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            whileTap={{ scale: 0.98 }}
            animate={{}}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`relative min-h-[96px] overflow-hidden rounded-2xl border text-left transition duration-200 ${
              isSelected
                ? "border-coffee-700 ring-2 ring-coffee-700"
                : "border-coffee-200 hover:border-coffee-400"
            } ${backgroundImage ? "text-white" : "bg-coffee-50 text-coffee-900"}`}
          >
            {backgroundImage ? (
              <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                animate={{
                  y: isSelected ? -8 : 8,
                  scale: isSelected ? 1.2 : 1.14,
                }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              />
            ) : null}

            <motion.div
              aria-hidden="true"
              className={`absolute inset-0 ${
                backgroundImage
                  ? isSelected
                    ? "bg-black/25"
                    : "bg-black/35"
                  : "bg-transparent"
              }`}
              animate={{}}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            />

            <div className="relative flex h-full items-end p-5">
              <span className="text-2xl font-bold">{label}</span>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export default FilterContainer;
