import React from "react";
import LoginContainer from "./pages/Auth/Login.js";
import Signup from "./pages/Auth/Signup.js";
import Dashboard from "./pages/Dashboard/Dashboard.js";
import MenuPage from "./pages/Menu/MenuPage.js";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import TestPage from "./pages/TestPage.js";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Pre Auth Pages */}
        <Route path="/" element={<LoginContainer />} />
        <Route path="/signup" element={<Signup />} />

        {/* Post Auth Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <MenuPage />
            </ProtectedRoute>
          }
        />

        <Route path="/testPage" element={<TestPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
