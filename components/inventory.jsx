/*
This component that shows the user's inventory and opens up the shop menu
*/

"use client";

//  libraries
//    npm packages
import Image from "next/image";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
//    lib folder functions
import { inventorySelector } from "@/lib/storeFeatures/inventory/inventorySlice";
//    components
import Shop from "./shop";
import HoverableItem from "./hoverableItem";

//  Inventory component
export default function Inventory() {
  /*
  Variables + states
  */

  //  use the inventory slice
  const currentInventory = useSelector(inventorySelector);
  //  not exactly  sure if this is necessary
  const buttonOpenShop = useRef(null);
  //  react states
  //  might have to move this to the shop
  const [showShop, setShopVisibility] = useState(false);
  //  this state is only here because I need unique ids for the items in the inventory but CANNOT use index when mapping
  const [pressedPurchase, setPressedPurchase] = useState(0);

  /*
  Functions
  */

  //  toggle the shop overlay on or off
  const setHidden = () => {
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  };

  //  handle setting the shop to be visible
  const handleClick = async () => {
    //  show the shop
    setShopVisibility(!showShop);
    setHidden();
  };

  //  handle incementing pressedPurchase
  const handlePressedPurchase = () => {
    setPressedPurchase(pressedPurchase + 1);
  };

  /*
  return the component
  */
  return (
    <div className="">
      {/* The Shop menu component */}
      <Shop
        showShop={showShop}
        updatePressedPurchase={handlePressedPurchase}
        pressedPurchase={pressedPurchase}
      />
      {/* The actual inventory component */}
      {/*  top-16  h-20  content-center */}
      <div className="sticky  top-[25vh] z-[35]">
        {/* Inventory Section. */}

        {/* Button to open the shop menu */}
        <button
          id="openShop"
          type="button"
          className="relative h-[64px] w-[64px] mr-4"
        >
          <Image
            src="/images/nav-icon-store.svg"
            alt="me"
            fill
            sizes="64px"
            onClick={handleClick}
            ref={buttonOpenShop}
          />
        </button>
        {/*   This displays the items in the inventory bar shown on the right */}
        {currentInventory.map((item) => (
          /* Map all of the item icons */
          <HoverableItem
            key={`${item.name}-${item.PP_id}-HI`}
            itemData={item}
            itemPPId={item.PP_id}
          />
        ))}
      </div>
    </div>
  );
}
