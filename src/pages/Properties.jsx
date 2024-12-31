import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import { BreadcrumbItem, Breadcrumbs, Button, Link } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import PropertiesTable from "../components/PropertiesTable";

function Properties() {
  const navigate = useNavigate();

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64 mt-16">
        {/* Breadcrumbs */}
        <p className="text-2xl font-bold">Properties</p>
        <div className="flex justify-between items-center my-4">
          <Breadcrumbs>
            <BreadcrumbItem>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Properties</BreadcrumbItem>
          </Breadcrumbs>
          <Button color="primary" onClick={() => navigate("/properties/add")}>
            Tambah Kost
          </Button>
        </div>
        <PropertiesTable />
      </div>
    </>
  );
}

export default Properties;
