import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import UserInfoSection from "../../layouts/UserInfoSection.js";
import ClockInOutCard from "./ClockInOutCard.js";
import ScheduleCard from "./ScheduleCard.js";
import { BsFilePostFill } from "react-icons/bs";
import { MdOutlineSchedule, MdOutlineSchool } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";

type EmployeeView = "schedule" | "training";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [activeView, setActiveView] = useState<EmployeeView>("schedule");

  const mockTraining = [
    { id: 1, title: "POS Basics", status: "Complete" },
    { id: 2, title: "Drink Build Standards", status: "In Progress" },
    { id: 3, title: "Customer Service Flow", status: "Not Started" },
    { id: 4, title: "Opening Shift Checklist", status: "Complete" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-coffee-300">
        <p className="text-xl font-semibold text-coffee-900">
          Loading employee portal...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-coffee-300 p-8">
      <div className="max-w-7xl mx-auto text-xl flex flex-col gap-4">
        <UserInfoSection
          displayName={user?.displayName ?? null}
          role={user?.role ?? null}
          tenantId={null}
          onLogout={handleLogout}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <ClockInOutCard />
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-coffee-900 mb-4">
                Employee Quick Info
              </h2>

              <div className="space-y-3 text-coffee-800">
                <p>
                  Logged in as:{" "}
                  <span className="font-semibold">
                    {user?.displayName || "Employee User"}
                  </span>
                </p>

                <p>
                  Role:{" "}
                  <span className="font-semibold">
                    {user?.role || "employee"}
                  </span>
                </p>

                <p>
                  Current section:{" "}
                  <span className="font-semibold">
                    {activeView === "schedule" && "Schedule"}
                    {activeView === "training" && "Training"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-coffee-50 border border-coffee-200 rounded-lg p-4">
                <p className="text-sm text-coffee-600">Shift Status</p>
                <p className="text-2xl font-bold text-coffee-900">Active</p>
              </div>

              <div className="bg-coffee-50 border border-coffee-200 rounded-lg p-4">
                <p className="text-sm text-coffee-600">Training Items</p>
                <p className="text-2xl font-bold text-coffee-900">2</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
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
              <div className="flex flex-row items-center gap-2">
                <MdOutlineSchedule size={24} />
                <p>Schedule</p>
              </div>
            </button>

            <button
              onClick={() => setActiveView("training")}
              className={`w-full text-left px-4 py-3 rounded-md font-semibold transition ${
                activeView === "training"
                  ? "bg-white text-coffee-900"
                  : "bg-coffee-800 hover:bg-coffee-700 text-white"
              }`}
            >
              <div className="flex flex-row items-center gap-2">
                <MdOutlineSchool size={24} />
                <p>Training</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/pos")}
              className="mt-auto w-full text-left px-4 py-3 rounded-md font-semibold bg-coffee-700 hover:bg-coffee-600 transition"
            >
              <div className="flex flex-row items-center gap-2">
                <BsFilePostFill size={24} />
                <p>Open POS</p>
              </div>
            </button>
          </aside>

          <section className="flex-1 p-6 overflow-y-auto bg-white">
            {activeView === "schedule" ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold text-coffee-900">
                  Schedule
                </h2>
                <p className="text-coffee-700">
                  Review the current schedule.
                </p>
                <ScheduleCard />
              </div>
            ) : null}

            {activeView === "training" ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold text-coffee-900">
                  Training
                </h2>
                <p className="text-coffee-700">
                  Track training and onboarding progress.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockTraining.map((item) => (
                    <div
                      key={item.id}
                      className="border border-coffee-200 rounded-lg p-4 bg-coffee-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-coffee-900">
                            {item.title}
                          </p>
                          <p className="text-sm text-coffee-600 mt-1">
                            Status: {item.status}
                          </p>
                        </div>

                        <FaClipboardList className="text-coffee-700" size={20} />
                      </div>
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