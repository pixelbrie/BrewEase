import React from "react";
import LoginContainer from "./pages/Auth/Login.js";
import Signup from "./pages/Auth/Signup.js";
import Dashboard from "./pages/Dashboard/Dashboard.js";
import AdminDash from "./pages/Dashboard/AdminDash.js";
import PosDashboard from "./pages/Dashboard/PosDashboard.js";
import MenuPage from "./pages/Menu/MenuPage.js";
import { Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import TestPage from "./pages/TestPage.js";

function RoleBasedDashboard() {
  const { user } = useAuth();

  if (user?.role === "admin" || user?.role === "manager") {
    return <AdminDash />;
  }

  return <Dashboard />;
}

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
              <RoleBasedDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <PosDashboard />
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