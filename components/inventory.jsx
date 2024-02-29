"use client";

/*
This component is the button that opens up the 
*/

//  libraries
import Image from "next/image";

import { useState, useRef } from "react";
//  react-redux
import { useSelector } from "react-redux";
import { inventorySelector } from "@/lib/storeFeatures/inventory/inventorySlice";
import Shop from "./shop";

//  Inventory component
export default function Inventory() {
  /*
  Vars
  */

  //  use the inventory slice
  const currentInventory = useSelector(inventorySelector);
  //  not exactly  sure if this is necessary
  const buttonOpenShop = useRef(null);
  //  react states
  //  might have to move this to the shop
  const [showShop, setShopVisibility] = useState(false);

  /*
  Functions
  */

  //  toggle the shop overlay on or off
  const setHidden = () => {
    //  console.log(document.body.style.overflow);
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

  /*
  return the component
  */
  return (
    <div>
      {/* The Shop component */}
      <div className="absolute left-0 flex">
        <div className="flex">
          <Shop showShop={showShop} />
          <div className="sticky top-16 h-20 content-center" />
        </div>
      </div>

      <div className="sticky top-16  h-20  content-center">
        {/* Inventory Section. */}
        {/*   This displays the items in the inventory bar shown on the right */}
        {currentInventory.map((item) => {
          /* Map all of the item icons */
          if (item.requiredAlly === "Ornn") {
            return (
              <div
                className="relative h-[64px] w-[64px]"
                key={`${item.id} ornn border div  `}
              >
                {/* NOTE:  need to change this link so it auto updates to the current patch */}
                <Image
                  src="https://raw.communitydragon.org/13.19/game/assets/items/itemmodifiers/bordertreatmentornn.png"
                  alt={`${item.name} ornn border`}
                  key={`${item.id} ornn border`}
                  className="absolute z-50"
                  fill
                  sizes="64px"
                />
                <Image
                  src={item.icon}
                  alt={`${item.name} png`}
                  key={`${item.id}`}
                  className="z-40"
                  fill
                  sizes="64px"
                />
              </div>
            );
          }
          if (item.icon) {
            return (
              <div
                className="relative h-[64px] w-[64px]"
                key={`${item.name} div`}
              >
                <Image
                  src={item.icon}
                  alt={`${item.name} png`}
                  key={`${item.name} png`}
                />
              </div>
            );
          }
          //  Will have to change this to do relevant thing when the ICON DOES NOT EXIST
          return (
            <Image
              src={item.icon}
              alt={`${item.name} png`}
              key={`${item.name} png`}
            />
          );
        })}
        {/* Button to open the shop menu */}
        <button
          id="openShop"
          type="button"
          className="relative h-[64px] w-[64px]"
        >
          <Image
            src="/images/temp_openInventory.png"
            alt="me"
            fill
            sizes="64px"
            onClick={handleClick}
            ref={buttonOpenShop}
          />
        </button>
      </div>
      {/* <Script src="/js/inventoryJS.js" strategy="lazyOnload" /> */}
    </div>
  );
}
