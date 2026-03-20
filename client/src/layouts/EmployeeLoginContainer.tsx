import React from "react";
import { motion } from "motion/react";
import { IoClose } from "react-icons/io5";

interface EmployeeLoginContainerProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onClose: () => void;
}

const EmployeeLoginContainer = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onClose,
}: EmployeeLoginContainerProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full bg-white rounded-lg shadow-lg"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <p className="text-lg text-center text-neutral-400">
        Employee login coming soon!
      </p>

      <div className="">
        Back
        <IoClose />
      </div>
    </motion.div>
  );
};

export default EmployeeLoginContainer;
