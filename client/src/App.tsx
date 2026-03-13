import React from "react";
import TestPage from "./pages/TestPage";
import LoginContainer from "./pages/Auth/Login.js";
import Dashboard from "./pages/Dashboard/Dashboard.js";
import { Route, Routes } from "react-router";

function App() {
  return (
    <>
      <Routes>
        <Route path="/test" element={<TestPage />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
