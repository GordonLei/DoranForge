"use client";
/*
This component is the 
*/

//  libraries
import Image from "next/image";
import Shop from "./shop";

import { useState, useRef } from "react";
//  react-redux
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  inventorySelector,
} from "@/lib/storeFeatures/inventory/inventorySlice";

//  Inventory component
export default function Inventory({
  /* inventory, */
  setOverflowScroll,
  /* setInventory */
}) {
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

  //  handle setting the shop to be visible
  const handleClick = async (event) => {
    //  show the shop
    setShopVisibility(!showShop);
    setOverflowScroll(false);
    setHidden();
  };

  //  toggle the shop overlay on or off
  const setHidden = () => {
    console.log(document.body.style.overflow);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
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
          <div className="sticky top-16 h-20 content-center"></div>
        </div>
      </div>

      <div className="sticky top-16  h-20  content-center">
        {/* Inventory Section */}
        {currentInventory.map((item, index) => {
          /* Map all of the item icons */
          if (item.requiredAlly === "Ornn") {
            return (
              <div className="relative">
                {/* NOTE:  need to change this link*/}
                <img
                  src={`https://raw.communitydragon.org/13.19/game/assets/items/itemmodifiers/bordertreatmentornn.png`}
                  alt={`${item.name} ornn border`}
                  key={`${item.id} ornn border`}
                  className="z-50 absolute"
                />
                <img
                  src={item.icon}
                  alt={`${item.name} png`}
                  key={`${item.id}`}
                  className="z-40"
                />
              </div>
            );
          } else if (item.icon) {
            return (
              <img
                src={item.icon}
                alt={`${item.name} png`}
                key={`item_${index}`}
              />
            );
          } else {
            //  Will have to change this to related code
            return (
              <img
                src={item.icon}
                alt={`${item.name} png`}
                key={`item_${index}`}
              />
            );
          }
        })}
        {/* Button to open the shop menu */}
        <button idname="openShop">
          <Image
            src="/images/temp_openInventory.png"
            alt="me"
            width="64"
            height="64"
            onClick={handleClick}
            ref={buttonOpenShop}
          />
        </button>
      </div>
      {/* <Script src="/js/inventoryJS.js" strategy="lazyOnload" /> */}
    </div>
  );
}
