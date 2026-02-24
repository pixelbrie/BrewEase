import React, { useEffect } from "react";
import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { FaEnvelope, FaLock } from "react-icons/fa";
import brewEaseLogo from "../../assets/images/BrewEaseLogoTrans.png";
import backgroundLogin from "../../assets/images/backgroundLogin.png";
import { motion } from "motion/react";

function Login() {
  //Variables to hold form data and current page state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [currentPage, setCurrentPage] = useState("customer");

  const handlePageChange = () => {
    // Toggle between customer and agent login pages
    setCurrentPage(currentPage === "customer" ? "agent" : "customer");
  };

  const LoginContainer = () => {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-7 items-center justify-center w-full">
            <p className="text-lg text-center text-neutral-400">
              Please enter your details to join your account
            </p>
            <Input
              placeholder="Email"
              type="email"
              icon={<FaEnvelope />}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              icon={<FaLock />}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <Button
              label="Login"
              className="w-full justify-center items-center bg-coffee-700 text-white font-bold py-4 px-8 rounded-full"
              variant="secondary"
              size="large"
              onClick={() => console.log("Login button clicked")}
            />
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
            <Button
              label="Continue as Guest"
              className="justify-center items-center bg-coffee-700 text-white font-bold py-4 px-8 rounded-full"
              variant="secondary"
              size="large"
              onClick={() => console.log("Login button clicked")}
            />
          </div>
        </motion.div>
      </>
    );
  };

  const AgentLoginContainer = () => {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-7 items-center justify-center w-full">
            <p className="text-lg text-center text-neutral-400">
              Please enter your details to join your account
            </p>
            <Input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              type="password"
              icon={<FaLock />}
              length={4}
            />
            <Button
              label="Login"
              className="w-full justify-center items-center bg-coffee-700 text-white font-bold py-4 px-8 rounded-full"
              variant="secondary"
              size="large"
              onClick={() => console.log("Login button clicked")}
            />
            <span className="text-sm text-neutral-400">
              Don't have an account?{" "}
              <a href="#" className="text-coffee-600 font-bold">
                Sign Up
              </a>
            </span>
          </div>
        </motion.div>
      </>
    );
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

        <p className="text-3xl font-bold">
          {currentPage === "customer" ? "Customer Login" : "Agent Login"}
        </p>

        {currentPage === "customer" ? (
          <LoginContainer />
        ) : (
          <AgentLoginContainer />
        )}

        <div className="flex flex-row gap-4 w-full items-center">
          <span className="bg-coffee-200 h-0.5 w-full border-neutralui-100"></span>
          <a
            href="#"
            className="text-coffee-600 font-bold whitespace-nowrap"
            onClick={handlePageChange}
          >
            {currentPage === "customer" ? "Agent Login" : "Customer Login"}
          </a>
          <span className="bg-coffee-200 h-0.5 w-full border-neutralui-100"></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
