import Image from "next/image";
import Shop from "./shop";
import { useState, useRef } from "react";

export default function Inventory({ inventory, getItemDataMethod }) {
  const buttonOpenShop = useRef(null);
  //  might have to move this to the shop
  const [showShop, setShopVisibility] = useState(false);
  const handleClick = async (event) => {
    //  show the shop
    setShopVisibility(!showShop);
  };

  return (
    <div>
      <div className="absolute left-0 ">
        <div className="flex">
          <Shop showShop={showShop} />

          <div className="h-1/2 sticky top-1/4  content-center"></div>
        </div>
      </div>

      <div className="h-1/2 sticky top-1/4  content-center">
        {/* Item Section */}
        {inventory.map((item, index) => {
          if (item.link) {
            return (
              <img
                src={item.link}
                alt={`${item.name} png`}
                key={`item_${index}`}
              />
            );
          } else {
            //  Will have to change this to related code
            return (
              <img
                src={item.link}
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
