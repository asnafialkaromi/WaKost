import React from "react";
import Sidebar from "../components/SideBar";
import NavBarAdmin from "../components/NavBarAdmin";

function Dashboard() {
  return (
    <>
      <Sidebar />

      {/* Main Content */}
      <div className="p-4 sm:ml-64 mt-16">
        <h1 className="text-2xl font-bold">Responsive Sidebar</h1>
        <p className="mt-2 text-gray-600">
          This is the main content area. Resize the screen to see the responsive
          behavior.
        </p>
      </div>
    </>
  );
}

export default Dashboard;
