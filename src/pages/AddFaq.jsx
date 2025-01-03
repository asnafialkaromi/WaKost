import { BreadcrumbItem, Breadcrumbs, Button, Link } from "@nextui-org/react";
import React from "react";
import Sidebar from "../components/SideBar";

function AddFaq() {
  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64 mt-16">
        {/* Breadcrumbs */}
        <p className="text-2xl font-bold">Frequenly Ask Question</p>
        <div className="flex justify-between items-center my-4">
          <Breadcrumbs>
            <BreadcrumbItem>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>FAQ</BreadcrumbItem>
          </Breadcrumbs>
          <Button color="primary" onClick={() => navigate("/properties/add")}>
            Tambah FAQ
          </Button>
        </div>

        {/* Content goes here */}
      </div>
    </>
  );
}

export default AddFaq;
