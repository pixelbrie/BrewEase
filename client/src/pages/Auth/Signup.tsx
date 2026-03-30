import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import Button from "../../components/Button";
import Input from "../../components/Input";
import brewEaseLogo from "../../assets/images/BrewEaseLogoTrans.png";
import backgroundLogin from "../../assets/images/BackgroundLogin.png";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";

interface SignupEmployeeContainerProps {
  name: string;
  email: string;
  password: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSignup: () => void;
  loading: boolean;
  error: string;
  onGoToLogin: () => void;
}

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
    // Implement your signup logic here, e.g., call an API to create the user account
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Example:
      // await api.signup({ name, email, password });

      // For now, just log the input values
      console.log("Signup button clicked with name: " + name);
      console.log("Signup button clicked with email: " + email);
      console.log("Signup button clicked with password: " + password);
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-6 py-10"
      style={{ backgroundImage: `url(${backgroundLogin})` }}
    >
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-coffee-100 p-10">
          <img
            src={brewEaseLogo}
            alt="BrewEase Logo"
            className="max-w-[320px] w-full object-contain"
          />
        </div>

        {/* sign up info */}
        <div className="flex flex-col justify-center items-center p-8 md:p-12">
          <div className="w-full max-w-md flex flex-col gap-8">
            <div className="flex flex-col items-center gap-3">
              {/* logo */}
              <img
                src={brewEaseLogo}
                alt="BrewEase Logo"
                className="w-32 md:hidden object-contain"
              />

              <h1 className="text-3xl font-bold text-coffee-800 text-center">
                Create your BrewEase account
              </h1>

              <p className="text-lg text-center text-neutral-400">
                Enter your details to get started
              </p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                {/* form */}
                <div className="flex flex-col gap-7 items-center justify-center w-full">
                  <Input
                    placeholder="Full Name"
                    type="text"
                    icon={<FaUser />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <Input
                    placeholder="Email"
                    type="email"
                    icon={<FaEnvelope />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Input
                    placeholder="Password"
                    type="password"
                    icon={<FaLock />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <Button
                    label="Sign Up"
                    className="w-full justify-center items-center bg-coffee-700 text-white font-bold py-4 px-8 rounded-full"
                    variant="secondary"
                    size="large"
                    onClick={handleSignup}
                  />

                  <span className="text-sm text-neutral-400 text-center">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="text-coffee-600 font-bold"
                    >
                      Back to Login
                    </button>
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
