import Image from "next/image";
import Shop from "./shop";
import Script from "next/script";
import { useRef, useState } from "react";

export default function Inventory({ inventory }) {
  const buttonOpenShop = useRef(null);
  const shop = useRef(null);
  //  might have to move this to the shop
  const [showShop, setShopVisibility] = useState(false);
  const handleClick = (event) => {
    //  show the shop
    setShopVisibility(!showShop);
    console.log(showShop);
  };

  return (
    <div>
      <div>{showShop && <Shop />}</div>

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
