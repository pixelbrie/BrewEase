import { useState } from "react";

function CreateEmployeeCard() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "barista",
  });

  const [loading, setLoading] = useState(false);
  const [createdMessage, setCreatedMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCreatedMessage("");

    try {
      const data = await createEmployee(form);

      setCreatedMessage(
        `Employee created: ${data.displayName} | Role: ${data.role} | POS PIN: ${data.pin}`,
      );

      setForm({
        firstName: "",
        lastName: "",
        email: "",
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
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
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border border-coffee-300 rounded-md p-3"
          required
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
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
          <option value="manager">manager</option>
          <option value="admin">admin</option>
          <option value="kitchen">kitchen</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-coffee-800 hover:bg-coffee-900 text-white px-4 py-3 rounded-md font-semibold transition"
        >
          {loading ? "Creating..." : "Create Employee"}
        </button>
      </form>

      {createdMessage ? (
        <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-md">
          {createdMessage}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 bg-red-100 text-red-800 p-3 rounded-md">
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default CreateEmployeeCard;