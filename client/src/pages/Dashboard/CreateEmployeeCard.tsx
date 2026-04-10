import React, { useState } from "react";

function CreateEmployeeCard() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    password: "",
    role: "barista",
  });

  const [createdMessage, setCreatedMessage] = useState("");
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [generatedPin, setGeneratedPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatedMessage("");
    setGeneratedUsername("");
    setGeneratedEmail("");
    setGeneratedPin("");
    setError("");

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create employee");
      }

      setCreatedMessage("Employee created successfully");
      setGeneratedUsername(data?.username || "");
      setGeneratedEmail(data?.email || "");
      setGeneratedPin(data?.pin || "");

      setForm({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        password: "",
        role: "barista",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <h2 className="text-2xl font-bold text-coffee-900 mb-4">
        Create Employee
      </h2>

      <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First name"
          className="border border-coffee-300 rounded-md p-3"
          required
        />

        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last name"
          className="border border-coffee-300 rounded-md p-3"
          required
        />

        <input
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={handleChange}
          className="border border-coffee-300 rounded-md p-3"
          required
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Temporary password"
          className="border border-coffee-300 rounded-md p-3"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border border-coffee-300 rounded-md p-3"
        >
          <option value="barista">barista</option>
          <option value="kitchen">kitchen</option>
          <option value="manager">manager</option>
          <option value="admin">admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-coffee-700 hover:bg-coffee-800 text-white px-4 py-3 rounded-md font-semibold transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Employee"}
        </button>
      </form>

      {createdMessage ? (
        <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-md text-sm">
          {createdMessage}
        </div>
      ) : null}

      {generatedUsername ? (
        <div className="mt-4 bg-coffee-100 text-coffee-900 p-3 rounded-md text-sm">
          Generated username:{" "}
          <span className="font-bold">{generatedUsername}</span>
        </div>
      ) : null}

      {generatedEmail ? (
        <div className="mt-3 bg-coffee-100 text-coffee-900 p-3 rounded-md text-sm">
          Generated email:{" "}
          <span className="font-bold">{generatedEmail}</span>
        </div>
      ) : null}

      {generatedPin ? (
        <div className="mt-3 bg-coffee-100 text-coffee-900 p-3 rounded-md text-sm">
          Generated PIN: <span className="font-bold">{generatedPin}</span>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 bg-red-100 text-red-800 p-3 rounded-md text-sm">
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default CreateEmployeeCard;