import React from "react";
import { motion } from "motion/react";
import LoginChoice from "../components/LoginChoice";
import MemberChoiceImg from "../assets/images/img-MemberSelection.png";
import EmployeeChoiceImg from "../assets/images/img-EmployeeSelection.png";
import GuestChoiceImg from "../assets/images/img-GuestSelection.png";

interface SelectionLoginContainerProps {
  onSelect: (type: "customer" | "employee" | "guest" | "loggedInUser") => void;
}

const SelectionLoginContainer = ({
  onSelect,
}: SelectionLoginContainerProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full bg-white rounded-lg shadow-lg"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="h-full text-lg text-center text-neutral-400 border border-gray-300 bg-white p-4 rounded-lg w-full flex flex-col items-center gap-4">
        <p>Select your login type to continue</p>
        <LoginChoice
          label="Customer"
          description="Sign in to your customer account to earn rewards and track your orders"
          onClick={() => onSelect("customer")}
          icon={MemberChoiceImg}
          className="h-full"
        />
        <LoginChoice
          label="Guest"
          description="Continue as a guest without creating an account"
          onClick={() => onSelect("guest")}
          icon={GuestChoiceImg}
          className="h-full"
        />
        <LoginChoice
          label="Employee"
          description="Login as an Employee to manage orders, inventory, and more"
          onClick={() => onSelect("employee")}
          icon={EmployeeChoiceImg}
          className="h-full"
        />
      </div>
    </motion.div>
  );
};

export default SelectionLoginContainer;
