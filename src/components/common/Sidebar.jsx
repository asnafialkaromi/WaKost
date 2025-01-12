import { Button, useDisclosure } from "@nextui-org/react";
import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../../api/supabaseClient";
import ConfirmationModal from "./ConfirmationModal";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    isOpen: isLogoutOpen,
    onOpen: onLogoutOpen,
    onClose: onLogoutClose,
  } = useDisclosure();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async (e) => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
      setLoading(false);
    }
    setLoading(false);
    toast.success("Logout Berhasil", {
      onClose: () => navigate("/"),
    });
  };

  return (
    <>
      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 md:left-64 right-0 bg-white text-black p-4 shadow-md z-50">
        <div className="flex items-center gap-4 z-50">
          <Button
            onPress={toggleSidebar}
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
          <h1 className="text-xl font-bold">Selamat Datang</h1>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } mt-16 md:mt-0`}
      >
        <div className="p-4 flex flex-col">
          <h2 className="text-2xl text-center font-bold my-4">WaKost</h2>
          <Button
            as={Link}
            to="/dashboard"
            color="primary"
            variant="light"
            className="my-2 bg-gray-700 text-white"
            size="md"
          >
            Dashboard
          </Button>
          <Button
            as={Link}
            to="/properties"
            color="primary"
            variant="light"
            className="my-2 bg-gray-700 text-white"
            size="md"
          >
            Properties
          </Button>
          <Button
            as={Link}
            to="/facilities"
            color="primary"
            variant="light"
            className="my-2 bg-gray-700 text-white"
            size="md"
          >
            Fasilitas
          </Button>
          <Button
            as={Link}
            to="/faq-data"
            color="primary"
            variant="light"
            className="my-2 bg-gray-700 text-white"
            size="md"
          >
            FAQ
          </Button>
          <Button
            color="danger"
            variant="light"
            className="my-2 bg-gray-700 text-white"
            size="md"
            onPress={onLogoutOpen}
          >
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

      <Fragment>
        <ConfirmationModal
          isOpen={isLogoutOpen}
          loading={loading}
          onClose={onLogoutClose}
          onConfirm={handleLogout}
          message="Apakah Anda yakin ingin keluar?"
        />
      </Fragment>
    </>
  );
};

export default Sidebar;
