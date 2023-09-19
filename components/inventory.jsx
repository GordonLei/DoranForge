import Image from "next/image";
import Shop from "./shop";
import { useState, useRef } from "react";
//
import { useDispatch, useSelector } from "react-redux";
import { addItem, inventorySelector } from "../store/inventorySlice";
import { current } from "@reduxjs/toolkit";
//

export default function Inventory({
  /* inventory, */
  setOverflowScroll,
  setHidden
  /* setInventory */
}) {
  const buttonOpenShop = useRef(null);
  //  might have to move this to the shop
  const [showShop, setShopVisibility] = useState(false);
  const handleClick = async (event) => {
    //  show the shop
    setShopVisibility(!showShop);
    setOverflowScroll(false);
    setHidden();
  };
  const currentInventory = useSelector(inventorySelector);

  return (
    <div>
      <div className="absolute left-0 flex">
        <div className="flex">
          <Shop showShop={showShop} />

          <div className="sticky top-16 h-20 content-center"></div>
        </div>
      </div>

      <div className="sticky top-16  h-20  content-center">
        {/* Item Section */}
        {currentInventory.map((item, index) => {
          if (item.icon) {
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
