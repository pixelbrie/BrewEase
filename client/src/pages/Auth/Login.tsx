import React from "react";
import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { FaEnvelope, FaLock } from "react-icons/fa";
import brewEaseLogo from "../../assets/images/BrewEaseLogoTrans.png";
import backgroundLogin from "../../assets/images/backgroundLogin.png";
import { AnimatePresence, motion } from "motion/react";

//NOTES: Brie
/*
* We are aiming to make sure that the login is for the employee and the PIN is for the POS system to be able to change
the products and manage the orders. The customer login is not a priority at the moment, but we can add it later if we have time. 
For now, we will focus on the employee login and the POS system. The customer login can be added later as a separate page or as a modal. 
*/

// interfaces for the login containers to manage state and props
interface LoginContainerProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

interface AgentLoginContainerProps {
  pin: string;
  onPinChange: (value: string) => void;
}

// LoginContainer component for customer login

function LoginContainer({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: LoginContainerProps) {
  return (
    <div className="flex flex-col gap-7 items-center justify-center w-full">
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
    </div>
  );
}

// AgentLoginContainer component for agent login

function AgentLoginContainer({ pin, onPinChange }: AgentLoginContainerProps) {
  return (
    <div className="flex flex-col gap-7 items-center justify-center w-full">
      <p className="text-lg text-center text-neutral-400">
        Please enter your details to join your account
      </p>

      {/* PIN input field */}
      <Input
        placeholder="PIN"
        type="password"
        icon={<FaLock />}
        length={4}
        value={pin}
        onChange={(e) => onPinChange(e.target.value)}
      />

      {/* Login button */}
      <Button
        label="Login"
        className="w-full justify-center items-center bg-coffee-700 text-white font-bold py-4 px-8 rounded-full"
        variant="secondary"
        size="large"
        onClick={() => console.log(`Login button clicked with PIN: ${pin}`)}
      />

      {/* Sign Up link */}
      <span className="text-sm text-neutral-400">
        Don't have an account?{" "}
        <a href="#" className="text-coffee-600 font-bold">
          Sign Up
        </a>
      </span>
    </div>
  );
}

function Login() {
  //Variables to hold form data and current page state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [currentPage, setCurrentPage] = useState("customer");

  const handlePageChange = (e: React.MouseEvent) => {
    e.preventDefault();

    // Toggle between customer and agent login pages
    setCurrentPage(currentPage === "customer" ? "agent" : "customer");
  };
  return (
    <div
      className="flex 1 flex-col text-coffee-800 items-center justify-center h-screen"
      style={{
        backgroundImage: `url(${backgroundLogin})`,
        backgroundSize: "cover",
      }}
    >
      {/* Login Form */}
      <div className="font-nunito flex flex-col lg:w-[500px] sm:w-[500px] xs:w-[300px] gap-7 items-center justify-center p-20 rounded-xl bg-neutral-100">
        <img
          src={brewEaseLogo}
          alt="BrewEase Logo"
          className="w-28 h-28 mb-4"
        />
        <AnimatePresence mode="wait" initial={false}>
          {currentPage === "customer" ? (
            <motion.div
              key="customer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-3xl font-bold">EMPLOYEE LOGIN</p>
            </motion.div>
          ) : (
            <motion.div
              key="agent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-3xl font-bold">AGENT LOGIN</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animate the customer/agent switch only (not on each keystroke). */}
        <AnimatePresence mode="wait" initial={false}>
          {currentPage === "customer" ? (
            <motion.div
              key="customer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <LoginContainer
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
              />
            </motion.div>
          ) : (
            <motion.div
              key="agent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AgentLoginContainer pin={pin} onPinChange={setPin} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-row gap-4 w-full items-center">
          <span className="bg-coffee-200 h-0.5 w-full border-neutralui-100"></span>
          <a
            href="#"
            className="text-coffee-600 font-bold whitespace-nowrap"
            onClick={handlePageChange}
          >
            {currentPage === "customer" ? "POS Mode" : "Employee Login"}
          </a>
          <span className="bg-coffee-200 h-0.5 w-full border-neutralui-100"></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
