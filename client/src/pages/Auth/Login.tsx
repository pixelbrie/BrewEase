import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { FaEnvelope, FaLock } from "react-icons/fa";
import brewEaseLogo from "../../assets/images/BrewEaseLogoTrans.png";
import backgroundLogin from "../../assets/images/BackgroundLogin.png";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";

interface EmployeeLoginContainerProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
  loading: boolean;
  error: string;
  onGoToSignup: () => void;
}

interface AgentLoginContainerProps {
  pin: string;
  onPinChange: (value: string) => void;
  onLogin: () => void;
  loading: boolean;
  error: string;
}

function EmployeeLoginContainer({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onLogin,
  loading,
  error,
  onGoToSignup,
}: EmployeeLoginContainerProps) {
  return (
    <div className="flex flex-col gap-7 items-center justify-center w-full">
      <p className="text-lg text-center text-neutral-400">
        Please enter your employee account details
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
        icon={<FaLock />}
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm text-center w-full">{error}</p>}

      <Button
        label={loading ? "Logging in..." : "Login"}
        className="w-full justify-center items-center bg-coffee-700 text-white font-bold py-4 px-8 rounded-full"
        variant="secondary"
        size="large"
        onClick={onLogin}
      />

      <span className="text-sm text-neutral-400">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onGoToSignup}
          className="text-coffee-600 font-bold"
        >
          Sign Up
        </button>
      </span>
    </div>
  );
}

function AgentLoginContainer({
  pin,
  onPinChange,
  onLogin,
  loading,
  error,
}: AgentLoginContainerProps) {
  return (
    <div className="flex flex-col gap-7 items-center justify-center w-full">
      <p className="text-lg text-center text-neutral-400">
        Enter your 4-digit PIN to access the POS system
      </p>

      <Input
        placeholder="PIN"
        type="password"
        icon={<FaLock />}
        value={pin}
        onChange={(e) => onPinChange(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm text-center w-full">{error}</p>}

      <Button
        label={loading ? "Logging in..." : "Login"}
        className="w-full justify-center items-center bg-coffee-700 text-white font-bold py-4 px-8 rounded-full"
        variant="secondary"
        size="large"
        onClick={onLogin}
      />
    </div>
  );
}

function LoginContainer() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [currentPage, setCurrentPage] = useState<"employee" | "agent">("employee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmployeeLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);

      if (error.status === 404 || error.message === "User not found") {
        navigate("/signup");
        return;
      }

      setError(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePinLogin = async () => {
    setError("");

    if (!pin) {
      setError("Please enter your PIN.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/auth/pin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          pin,
        }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.error || "PIN login failed.");
      }

      navigate("/menu");
    } catch (error: any) {
      console.error("PIN login failed:", error);
      setError(error.message || "PIN login failed.");
    } finally {
      setLoading(false);
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

        <div className="flex flex-col justify-center items-center p-8 md:p-12">
          <div className="w-full max-w-md flex flex-col gap-8">
            <div className="flex flex-col items-center gap-3">
              <img
                src={brewEaseLogo}
                alt="BrewEase Logo"
                className="w-32 md:hidden object-contain"
              />

              <h1 className="text-3xl font-bold text-coffee-800 text-center">
                Welcome to BrewEase
              </h1>

              <div className="flex bg-coffee-100 rounded-full p-1 w-full max-w-sm">
                <button
                  onClick={() => {
                    setCurrentPage("employee");
                    setError("");
                  }}
                  className={`w-1/2 py-3 rounded-full font-semibold transition ${
                    currentPage === "employee"
                      ? "bg-coffee-700 text-white"
                      : "text-coffee-700"
                  }`}
                >
                  Employee Login
                </button>

                <button
                  onClick={() => {
                    setCurrentPage("agent");
                    setError("");
                  }}
                  className={`w-1/2 py-3 rounded-full font-semibold transition ${
                    currentPage === "agent"
                      ? "bg-coffee-700 text-white"
                      : "text-coffee-700"
                  }`}
                >
                  POS PIN
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                {currentPage === "employee" ? (
                  <EmployeeLoginContainer
                    email={email}
                    password={password}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onLogin={handleEmployeeLogin}
                    loading={loading}
                    error={error}
                    onGoToSignup={() => navigate("/signup")}
                  />
                ) : (
                  <AgentLoginContainer
                    pin={pin}
                    onPinChange={setPin}
                    onLogin={handlePinLogin}
                    loading={loading}
                    error={error}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginContainer;