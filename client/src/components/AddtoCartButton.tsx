import React from "react";
import { motion } from "motion/react";
import { useState } from "react";
import { TbShoppingBagPlus } from "react-icons/tb";
import { LuCheck } from "react-icons/lu";

interface AddtoCartButtonProps {
  onClick?: () => void;
  // You can add props here if needed, such as item details or a callback function
}

function AddtoCartButton({ onClick }: AddtoCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    // Here you would typically handle the logic to add the item to the cart
    console.log("Added to cart?: " + !isAdded);
    setIsAdded(!isAdded);
    if (onClick) {
      onClick();
    }
  };
  return (
    <>
      <motion.button
        className={style.button}
        onClick={handleAddToCart}
        animate={{
          scale: isAdded ? 1.2 : 1,
          backgroundColor: isAdded ? "#4CAF50" : "#6B4226",
        }}
        transition={{ duration: 0.3 }}
      >
        {isAdded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
          >
            <LuCheck style={style.icon} />
          </motion.div>
        ) : (
          <TbShoppingBagPlus style={style.icon} />
        )}
      </motion.button>
    </>
  );
}

const style = {
  button:
    "flex items-center justify-center bg-coffee-700 text-white text-2xl font-bold p-1 rounded-full w-[70px] h-[70px]",
  icon: {},
};

export default AddtoCartButton;
