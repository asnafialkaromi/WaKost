import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

function NavBarAdmin(props) {
  const { children } = props;

  return (
    <div className="bg-base-100 text-base-content sticky top-0 z-10 flex h-16 w-full justify-center">
      <label
        htmlFor="my-drawer-2"
        className="btn drawer-button p-2 min-h-full bg-transparent border-none lg:hidden"
      >
        <svg
          className="w-7 h-fit p-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </label>
      <div className="flex flex-row w-full p-2 items-center justify-between">
        <h1 className="text-4xl font-bold">{children}</h1>
      </div>
    </div>
  );
}

export default NavBarAdmin;
