/*

This is the navBar

*/

"use client";

//  imports
//    npm packages
import React from "react";
import {
  Image,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@nextui-org/react";

//  This is the component
export default function HextechNavbar() {
  //  states
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  //  default values
  const menuItems = [
    { url: "champions", name: "Champions" },
    { url: "testing/champSelect", name: "test-ChampSelect" },
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="bg-hextech-black bg-opacity-95 text-grey-1 border-gold-4 z-50"
      isBordered
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="text-grey-1">
          <Link href="/" className="text-grey-1">
            <Image
              width={32}
              alt="Hextech logo"
              src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/hextech-images/chest.png"
            />
            <p className="font-bold text-inherit">Hextech</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/champions" className="text-grey-1">
            Champions
          </Link>
        </NavbarItem>
        {/* Potential Testing */}
        {/* 
        <NavbarItem>
          <Link
            color="foreground"
            href="/testing/champSelect"
            className="text-grey-1"
          >
            testing-ChampSelect
          </Link>
        </NavbarItem> 
        */}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              className="w-full"
              href={item.url}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
