import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
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

      {error ? (
        <p className="text-red-500 text-sm text-center w-full">{error}</p>
      ) : null}

      <Button
        label={loading ? "Logging in..." : "Login"}
        className="w-full justify-center items-center bg-coffee-700 text-white font-bold py-4 px-8 rounded-full"
        variant="secondary"
        size="large"
        onClick={onLogin}
      />

      <p className="text-sm text-center text-neutral-500">
        Employee accounts are created by an admin.
      </p>
    </div>
  );
}

function PinPadButton({
  label,
  onClick,
  className = "",
  disabled = false,
}: {
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[72px] rounded-2xl border border-coffee-200 bg-white text-coffee-900 text-2xl font-bold shadow-sm transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-coffee-50 ${className}`}
    >
      {label}
    </button>
  );
}

function AgentLoginContainer({
  pin,
  onPinChange,
  onLogin,
  loading,
  error,
}: AgentLoginContainerProps) {
  const handleDigitPress = (digit: string) => {
    if (pin.length >= 4 || loading) {
      return;
    }

    onPinChange(`${pin}${digit}`);
  };

  const handleBackspace = () => {
    if (loading) {
      return;
    }

    onPinChange(pin.slice(0, -1));
  };

  const handleClear = () => {
    if (loading) {
      return;
    }

    onPinChange("");
  };

  const maskedPin = pin.padEnd(4, "•");
  const keypadDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full">
      <p className="text-lg text-center text-neutral-400">
        Enter your 4-digit PIN to access the POS system
      </p>

      <div className="w-full rounded-3xl border border-coffee-200 bg-coffee-50 p-5 shadow-sm">
        <div className="mb-4 rounded-2xl bg-white border border-coffee-200 px-5 py-4 text-center shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-coffee-500 mb-2">
            PIN Entry
          </p>
          <p className="text-4xl font-bold tracking-[0.45em] text-coffee-900 pl-3 select-none">
            {maskedPin}
          </p>
        </div>

        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          value={pin}
          onChange={(e) => onPinChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && pin.length === 4) {
              onLogin();
            }
          }}
          placeholder="Enter PIN"
          className="mb-4 w-full rounded-2xl border border-coffee-200 bg-white px-4 py-3 text-center text-lg font-semibold text-coffee-900 outline-none focus:ring-2 focus:ring-coffee-300"
        />

        <div className="grid grid-cols-3 gap-3">
          {keypadDigits.map((digit) => (
            <PinPadButton
              key={digit}
              label={digit}
              onClick={() => handleDigitPress(digit)}
              disabled={loading}
            />
          ))}

          <PinPadButton
            label="Clear"
            onClick={handleClear}
            className="text-base"
            disabled={loading || pin.length === 0}
          />

          <PinPadButton
            label="0"
            onClick={() => handleDigitPress("0")}
            disabled={loading}
          />

          <PinPadButton
            label={<FiDelete className="mx-auto" />}
            onClick={handleBackspace}
            disabled={loading || pin.length === 0}
          />
        </div>
      </div>

      {error ? (
        <p className="text-red-500 text-sm text-center w-full">{error}</p>
      ) : null}

      <Button
        label={loading ? "Logging in..." : "Enter POS"}
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
  const { login, refreshUser } = useAuth();

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
      setError(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePinLogin = async () => {
    setError("");

    if (pin.length !== 4) {
      setError("Please enter your 4-digit PIN.");
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
        body: JSON.stringify({ pin }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.error || "PIN login failed.");
      }

      await refreshUser();
      navigate("/pos");
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