import React, { useState } from "react";
import FilterButtonCoffee from "../components/FilterButtonCoffee.js";
import FilterButtonTea from "../components/FilterButtonTea.js";
import bgFilterCoffee from "../assets/images/bg-filterButton-coffee.png";
import bgFilterTea from "../assets/images/bg-filterButton-matcha.png";
import { motion, animate } from "motion/react";

function FilterContainer() {
  const [selectedFilter, setSelectedFilter] = useState(true);

  const handleCoffeeClick = () => {
    setSelectedFilter(true);
  };

  const handleTeaClick = () => {
    setSelectedFilter(false);
  };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-row justify-center items-center h-full w-full gap-4 "
    >
      <FilterButtonTea
        className={
          !selectedFilter
            ? "transition-opacity duration-300 opacity-100"
            : "opacity-50"
        }
        label="Tea"
        subLabel="12 items"
        bgImage={bgFilterTea}
        onClick={handleTeaClick}
      />
      <FilterButtonCoffee
        className={
          selectedFilter
            ? "transition-opacity duration-300 opacity-100"
            : "opacity-50"
        }
        label="Coffee"
        subLabel="20 items"
        bgImage={bgFilterCoffee}
        onClick={handleCoffeeClick}
      />
    </motion.div>
  );
}

export default FilterContainer;
