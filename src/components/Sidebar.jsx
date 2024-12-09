import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 md:left-64 right-0 bg-white text-black p-4 shadow-md">
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleSidebar}
            auto
            size="sm"
            className=" text-white bg-blue-500 rounded-md md:hidden min-w-4"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </Button>
          <h1 className="text-lg font-bold">My App</h1>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } mt-16 md:mt-0`}
      >
        <div className="p-4 flex flex-col">
          <h2 className="text-lg font-bold">Menu</h2>
          <Button
            as={Link}
            to="/dashboard"
            color="primary"
            className="my-2"
            size="sm"
          >
            Dashboard
          </Button>
          <Button
            as={Link}
            to="/properties"
            color="primary"
            className="my-2"
            size="sm"
          >
            Properties
          </Button>
          <Button as={Link} to="/" color="primary" className="my-2" size="sm">
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay for small screens */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed h-full w-full -z-20 bg-black bg-opacity-50 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
