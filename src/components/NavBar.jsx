import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Switch,
} from "@nextui-org/react";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = ["Home", "Kost", "About", "FAQ", "Log Out"];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      variant="sticky"
      maxWidth="xl"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit text-primary">WaKost</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link color="primary" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/kost">
            Kost
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            FAQ
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="#"
            variant="shadow"
            radius="lg"
            className="font-semibold"
          >
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>
          <Link color="primary" href="#">
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" href="#">
            Kost
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" href="#">
            About
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" href="#">
            FAQ
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

export default NavBar;
