import React from "react";

import backgroundLogin from "../assets/images/backgroundLogin.png";
import { AnimatePresence, motion, animate } from "motion/react";
import { useState } from "react";
import Input from "../components/Input.js";
import Button from "../components/Button.js";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import LoginChoice from "../components/LoginChoice";
import MemberChoiceImg from "../assets/images/img-MemberSelection.png";
import EmployeeChoiceImg from "../assets/images/img-EmployeeSelection.png";
import GuestChoiceImg from "../assets/images/img-GuestSelection.png";

//functions//

const handleGoCustomerLogin = () => {
  console.log("Go to customer login");
};

const handleGoEmployeeLogin = () => {
  console.log("Go to employee login");
};

const handleGoGuestLogin = () => {
  console.log("Go to guest login");
};

interface LoginContainerProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  navigate: (path: string) => void;
}

const CustomerLoginContainer = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: LoginContainerProps) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col gap-7 items-center justify-center h-full w-full bg-white p-8 rounded-lg shadow-lg"
    >
      <p className="text-lg text-center text-neutral-400">
        Please enter your details to join your account
      </p>

      {/* Email input field */}
      <Input
        placeholder="Email"
        type="email"
        icon={<FaEnvelope />}
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />

      {/* Password input field */}
      <Input
        placeholder="Password"
        type="password"
        value={password}
        icon={<FaLock />}
        onChange={(e) => onPasswordChange(e.target.value)}
      />

      {/* Login button */}
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

      {/* Sign Up link */}
      <span className="text-sm text-neutral-400">
        Don't have an account?{" "}
        <a href="#" className="text-coffee-600 font-bold">
          Sign Up
        </a>
      </span>

      <div className="flex flex-row gap-2 w-full items-center">
        <span className="bg-coffee-200 h-0.5 w-full border-neutralui-100"></span>
        <p className="text-lg text-center text-neutral-400">or</p>
        <span className="bg-coffee-200 h-0.5 w-full border-neutralui-100"></span>
      </div>
    </motion.div>
  );
};

function LoginContainer({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  navigate,
}: LoginContainerProps) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col items-center justify-center h-full w-full bg-white rounded-lg shadow-lg"
    >
      <div className="h-full text-lg text-center text-neutral-400 border border-gray-300 bg-white p-4 rounded-lg w-full flex flex-col items-center gap-4">
        <p>Select your login type to continue</p>
        <LoginChoice
          label="Customer"
          description="Sign in to your customer account to earn rewards and track your orders"
          onClick={handleGoCustomerLogin}
          icon={MemberChoiceImg}
          className="h-full"
        />
        <LoginChoice
          label="Guest"
          description="Continue as a guest without creating an account"
          onClick={handleGoGuestLogin}
          icon={GuestChoiceImg}
          className="h-full"
        />
        <LoginChoice
          label="Employee"
          description="Login as an Employee to manage orders, inventory, and more"
          onClick={handleGoEmployeeLogin}
          icon={EmployeeChoiceImg}
          className="h-full"
        />
      </div>
    </motion.div>
  );
}

export default LoginContainer;
