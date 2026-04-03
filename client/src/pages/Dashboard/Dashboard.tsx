import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import UserInfoSection from "../../layouts/UserInfoSection.js";

type BaristaView = "schedule" | "training";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [activeView, setActiveView] = useState<BaristaView>("schedule");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [lastClockAction, setLastClockAction] = useState("Not clocked in yet");

  const mockSchedule = [
    { id: 1, day: "Monday", shift: "9:00 AM - 2:00 PM", location: "Main Cafe" },
    { id: 2, day: "Wednesday", shift: "11:00 AM - 5:00 PM", location: "Main Cafe" },
    { id: 3, day: "Friday", shift: "8:00 AM - 1:00 PM", location: "Main Cafe" },
  ];

  const mockTraining = [
    { id: 1, title: "Milk Steaming Basics", status: "Complete" },
    { id: 2, title: "POS Order Flow", status: "In Progress" },
    { id: 3, title: "Customer Service Refresher", status: "Not Started" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleClockToggle = () => {
    const now = new Date().toLocaleString();

    if (isClockedIn) {
      setIsClockedIn(false);
      setLastClockAction(`Clocked out at ${now}`);
    } else {
      setIsClockedIn(true);
      setLastClockAction(`Clocked in at ${now}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-coffee-300">
        <p className="text-xl font-semibold text-coffee-900">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-coffee-300 p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <UserInfoSection
          displayName={user?.displayName ?? null}
          role={user?.role ?? null}
          tenantId={null}
          onLogout={handleLogout}
        />

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex w-full min-h-[650px] bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <aside className="w-[240px] shrink-0 bg-coffee-900 text-white p-4 flex flex-col gap-3">
            <h2 className="text-xl font-bold border-b border-coffee-700 pb-3">
              Employee Portal
            </h2>

            <button
              onClick={() => setActiveView("schedule")}
              className={`w-full text-left px-4 py-3 rounded-md font-semibold transition ${
                activeView === "schedule"
                  ? "bg-white text-coffee-900"
                  : "bg-coffee-800 hover:bg-coffee-700 text-white"
              }`}
            >
              Schedule
            </button>

            <button
              onClick={() => setActiveView("training")}
              className={`w-full text-left px-4 py-3 rounded-md font-semibold transition ${
                activeView === "training"
                  ? "bg-white text-coffee-900"
                  : "bg-coffee-800 hover:bg-coffee-700 text-white"
              }`}
            >
              Training
            </button>

            <button
              onClick={() => navigate("/pos")}
              className="mt-auto w-full text-left px-4 py-3 rounded-md font-semibold bg-coffee-700 hover:bg-coffee-600 transition"
            >
              Open POS
            </button>
          </aside>

          <section className="flex-1 p-6 overflow-y-auto bg-white">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
              <div className="bg-coffee-50 border border-coffee-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-coffee-900 mb-4">
                  Time Clock
                </h2>

                <p className="text-coffee-700 mb-3">
                  Status:{" "}
                  <span className="font-semibold">
                    {isClockedIn ? "Clocked In" : "Clocked Out"}
                  </span>
                </p>

                <button
                  onClick={handleClockToggle}
                  className={`w-full px-4 py-3 rounded-md font-semibold text-white transition ${
                    isClockedIn
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isClockedIn ? "Clock Out" : "Clock In"}
                </button>

                <p className="text-sm text-coffee-600 mt-3">{lastClockAction}</p>
              </div>

              <div className="bg-coffee-50 border border-coffee-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-coffee-900 mb-4">
                  Quick Info
                </h2>
                <div className="space-y-3 text-coffee-800">
                  <p>
                    Logged in as:{" "}
                    <span className="font-semibold">{user?.displayName}</span>
                  </p>
                  <p>
                    Role: <span className="font-semibold">{user?.role}</span>
                  </p>
                  <p>
                    Next step:{" "}
                    <span className="font-semibold">
                      {activeView === "schedule"
                        ? "Review your upcoming shifts"
                        : "Complete training items"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {activeView === "schedule" ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold text-coffee-900">Schedule</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockSchedule.map((shift) => (
                    <div
                      key={shift.id}
                      className="border border-coffee-200 rounded-lg p-4 bg-coffee-50"
                    >
                      <p className="font-semibold text-coffee-900">{shift.day}</p>
                      <p className="text-coffee-700">{shift.shift}</p>
                      <p className="text-sm text-coffee-600">{shift.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeView === "training" ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold text-coffee-900">Training</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockTraining.map((item) => (
                    <div
                      key={item.id}
                      className="border border-coffee-200 rounded-lg p-4 bg-coffee-50"
                    >
                      <p className="font-semibold text-coffee-900">{item.title}</p>
                      <p className="text-sm text-coffee-600">
                        Status: {item.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;