import React from "react";
import { motion } from "motion/react";
import BeanLeafHero from "../assets/images/LeafandBeanHero.png";
import { LuShoppingBasket } from "react-icons/lu";

interface CustomerInfoSectionProps {
  onNext: () => void;
}

function CustomerInfoSection({ onNext }: CustomerInfoSectionProps) {
  const handleCustomerInfoSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onNext();
  };

  return (
    <motion.div
      className="flex flex-col w-full h-full bg-white items-start justify-start rounded-lg shadow-lg gap-6"
      style={{
        backgroundImage: `url(${BeanLeafHero})`,
        backgroundSize: "auto 42%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
      }}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex flex-1 flex-col p-6 w-full pt-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-coffee-600">
            Customer Info
          </h2>
          <p className="text-md text-neutral-500 mb-4">
            Look up a customer by name or order number.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xl">
          <label className="flex flex-col gap-2 text-md font-semibold text-neutral-700">
            Customer Name
            <input
              type="text"
              placeholder="Enter customer name"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base font-medium text-neutral-800 outline-none transition-colors focus:border-coffee-700"
            />
          </label>

          <label className="flex flex-col gap-2 text-md font-semibold text-neutral-700">
            Order Number
            <input
              type="text"
              placeholder="Enter order number"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base font-medium text-neutral-800 outline-none transition-colors focus:border-coffee-700"
            />
          </label>
        </div>

        <div className="flex w-full justify-end pt-6">
          <button
            type="button"
            onClick={handleCustomerInfoSubmit}
            className="rounded-full bg-coffee-700 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-coffee-900"
          >
            <div className="flex flex-row items-center gap-2">
              Continue To Order
              <LuShoppingBasket size={20} />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default CustomerInfoSection;