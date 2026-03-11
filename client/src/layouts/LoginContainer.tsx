import React from "react";

import backgroundLogin from "../assets/images/backgroundLogin.png";
import { AnimatePresence, motion, animate } from "motion/react";
import { useState } from "react";
import Input from "../components/Input.js";
import Button from "../components/Button.js";
import { FaEnvelope, FaLock } from "react-icons/fa";

interface LoginContainerProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

function LoginContainer({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: LoginContainerProps) {
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

      {/* Access to Agent Login */}
      <div className="flex flex-row gap-2 w-full items-center">
        <span className="bg-coffee-200 h-0.5 w-full border-neutralui-100"></span>
        <p className="text-lg text-center text-neutral-400">or</p>
        <span className="bg-coffee-200 h-0.5 w-full border-neutralui-100"></span>
      </div>

      {/* Continue as Guest button */}
      <Button
        label="Continue as Guest"
        className="justify-center items-center bg-coffee-700 text-white font-bold py-4 px-8 rounded-full"
        variant="secondary"
        size="large"
        onClick={() => console.log("Login button clicked")}
      />
    </motion.div>
  );
}

export default LoginContainer;
