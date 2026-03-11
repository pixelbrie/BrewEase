import React from "react";
import FilterContainer from "../layouts/FilterContainer.js";
import AddtoCartButton from "../components/AddtoCartButton.js";
import Dashboard from "./Dashboard/Dashboard.js";
import LoginContainer from "../layouts/LoginContainer.js";

function TestPage() {
  return (
    <>
      <div className="flex flex-row justify-center items-center h-screen w-screen gap-4 bg-coffee-300">
        <AddtoCartButton />
      </div>
    </>
  );
}

export default TestPage;
