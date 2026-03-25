import React from "react";
import LoginContainer from "./pages/Auth/Login.js";
import Signup from "./pages/Auth/Signup.js";
import Dashboard from "./pages/Dashboard/Dashboard.js";
import MenuPage from "./pages/Menu/MenuPage.js";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import ProtectedRoute from "./components/ProtectedRoute.js";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginContainer />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;