import React from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { FaEnvelope, FaLock } from "react-icons/fa";
import brewEaseLogo from "../assets/images/BrewEaseLogoTrans.png";
import backgroundLogin from "../assets/images/backgroundLogin.png";
function TestPage() {
  return (
    <div
      className="flex 1 flex-col text-coffee-800 items-center justify-center h-screen"
      style={{
        backgroundImage: `url(${backgroundLogin})`,
        backgroundSize: "cover",
      }}
    >
      {/* Login Form Test */}
      <div className="font-nunito flex flex-col lg:w-[500px] sm:w-[500px] xs:w-[300px] gap-7 items-center justify-center p-20 rounded-xl bg-neutral-100">
        <img
          src={brewEaseLogo}
          alt="BrewEase Logo"
          className="w-28 h-28 mb-4"
        />
        <p className="text-3xl font-bold">Customer Login</p>
        <p className="text-lg text-center text-neutral-400">
          Please enter your details to join your account
        </p>
        <Input placeholder="Email" type="email" icon={<FaEnvelope />} />
        <Input placeholder="Password" type="password" icon={<FaLock />} />
        <Button
          label="Login"
          className="w-64 justify-center items-center bg-coffee-700 text-white font-bold py-4 px-8 rounded-full"
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
          className="w-64 justify-center items-center bg-coffee-700 text-white font-bold py-4 px-8 rounded-full"
          variant="secondary"
          size="large"
          onClick={() => console.log("Login button clicked")}
        />
      </div>
    </div>
  );
}

export default TestPage;
