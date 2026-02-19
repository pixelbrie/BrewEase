import React from "react";
import Button from "../components/Button";
import Input from "../components/Input";
function TestPage() {
  return (
    <div className="flex 1 flex-col gap-8 bg-neutralui-100 text-white items-center justify-center h-screen">
      {/* <Button
        label="Order Now"
        variant="primary"
        size="large"
        onClick={() => console.log("Button clicked!")}
        icon={<LuArrowRight />}
      /> */}

      <Input placeholder="Email" type="email" />
      <Input placeholder="Password" type="password" />
      <Button
        label="Login"
        className="w-64 justify-center items-center bg-coffee-700 hover:bg-coffee-600 text-white font-bold py-4 px-8 rounded-full"
        variant="secondary"
        size="large"
        onClick={() => console.log("Button clicked!")}
      />
    </div>
  );
}

export default TestPage;
