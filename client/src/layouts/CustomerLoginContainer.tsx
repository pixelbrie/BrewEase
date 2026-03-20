import React from "react";
import { motion } from "motion/react";
import Input from "../components/Input";
import Button from "../components/Button";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Logo from "../assets/images/BrewEaseLogoTrans.png";

interface CustomerLoginContainerProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onClose: () => void;
}

const CustomerLoginContainer = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onClose,
}: CustomerLoginContainerProps) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col gap-7 items-center justify-start h-full w-full bg-white p-8 rounded-lg shadow-lg"
    >
      {/* Close Button */}
      <div className="w-full flex justify-end mb-10">
        <IoClose
          className="text-2xl text-neutral-400 cursor-pointer"
          onClick={onClose}
        />
      </div>

      <img src={Logo} alt="BrewEase Logo" className="w-20 h-20" />

      <p className="text-lg text-center text-neutral-400">
        Please enter your details to join your account
      </p>
      <Input
        placeholder="Email"
        type="email"
        icon={<FaEnvelope />}
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        icon={<FaLock />}
        onChange={(e) => onPasswordChange(e.target.value)}
      />
      <Button
        label="Login"
        className="w-full justify-center items-center bg-coffee-700 text-white font-bold py-4 px-8 rounded-full"
        variant="secondary"
        size="large"
        onClick={() =>
          console.log(
            "Login button clicked with email: " +
              email +
              " and password: " +
              password,
          )
        }
      />
      <span className="text-sm text-neutral-400">
        Don't have an account?{" "}
        <a href="#" className="text-coffee-600 font-bold">
          Sign Up
        </a>
      </span>
    </motion.div>
  );
};

export default CustomerLoginContainer;
