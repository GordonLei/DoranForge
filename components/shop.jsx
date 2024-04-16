/*

This component is that shop pop up where users can purchase and sell items

*/

"use client";

//  imports
//    npm packages
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWRImmutable from "swr/immutable";
//    lib folder functions
import {
  addItem,
  removeItemById,
  inventorySelector,
} from "@/lib/storeFeatures/inventory/inventorySlice";
import { addStats, removeStats } from "@/lib/storeFeatures/stats/statsSlice";
//  helper functions
import {
  extractItemStatFromDict,
  checkInInventory,
  validateInventory,
} from "../helper/lolItem";
import { objectMapArray } from "../helper/misc";
//  components
import GhostButtonGeneric from "./ui/ghostButtonGeneric";

// Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((temp) => {
      const res = JSON.parse(temp);
      const data = objectMapArray(res, (key, value) => value);
      return data;
    });

//  Shop component
export default function Shop({
  showShop,
  updatePressedPurchase,
  pressedPurchase,
}) {
  //  react-redux to use inventory slice
  const dispatch = useDispatch();
  const currentInventory = useSelector(inventorySelector);
  //  react  states
  const [currItem, setCurrItem] = useState(-1);
  const [parsedItemData, setParsedItemData] = useState({});
  /*
  Functions
  */

  //  from the array of items, add it into a dict where the key is the item ID
  const parseData = (itemArray) => {
    const dataDict = {};
    itemArray.map((currShopItem) => {
      dataDict[currShopItem.id] = currShopItem;
      return true;
    });
    return dataDict;
  };
  // Set up SWR to run the fetcher function when calling "/api/staticdata"
  // There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const { itemData, error } = useSWRImmutable("/api/itemData", fetcher, {
    onSuccess: (data) => {
      //  do something to parse the data
      const parsedData = parseData(data);
      setParsedItemData(parsedData);
    },
  });
  //  handle pressing the item and setting the current selected item to that
  const handleClick = (itemId) => {
    setCurrItem(itemId);
  };
  //  handle buying the selected item
  const handlePurchase = (event, itemId) => {
    //  event.stopPropagation();
    const item = parsedItemData[itemId];
    if (validateInventory(currentInventory, item)) {
      const clone = { ...item, PP_id: pressedPurchase };
      updatePressedPurchase();
      dispatch(addItem(clone));
      dispatch(addStats(clone));
    }

    /* setInventory(generateInventoryComponentInfo()); */
  };
  //  handle selling the selected item
  const handleSell = (event, itemId) => {
    //  event.stopPropagation();
    const item = parsedItemData[itemId];
    if (checkInInventory(currentInventory, item)) {
      dispatch(removeItemById(itemId));
      dispatch(removeStats(item));
    }
  };
  //  from the item dict, get the item information based on a key/property of the item + item id
  const getItemInfo = (id, param) => {
    const item = parsedItemData[id.toString()];
    return item[param];
  };

  /*
  Return the component
  */

  // Handle the error state
  if (error && showShop) return <div>Failed to load</div>;
  // Handle the loading state
  if (!parsedItemData && showShop) {
    return (
      <div>
        Loading...
        {itemData} what
      </div>
    );
  }
  //
  // Handle the ready state and display the result contained in the data object mapped to the structure of the json file
  if (showShop) {
    return (
      <div className="w-full flex flex-row overscroll-y-auto fixed left-0 bg-gradient-to-r from-blue-5 to-blue-7 z-30">
        {/* This is the shop window */}
        {/* Left side panel that shows all the items */}
        <div className="px-4 py-16 w-1/2 max-h-screen overflow-y-auto overflow-x-hidden ">
          <div className="sticky h-full grid grid-cols-5 place-items-center gap-2">
            {parsedItemData &&
              Object.values(parsedItemData).map((item) => {
                if (!item.shop.purchasable) {
                  return null;
                }
                if (item.requiredAlly === "Ornn") {
                  return (
                    <div
                      className="relative h-[64px] w-[64px]"
                      key={`${item.id} item`}
                    >
                      {/* NOTE:  need to change this link */}
                      <Image
                        src="https://raw.communitydragon.org/13.19/game/assets/items/itemmodifiers/bordertreatmentornn.png"
                        alt={`${item.name} ornn border`}
                        key={`${item.id} ornn border`}
                        onClick={() => handleClick(item.id)}
                        className="z-50 absolute"
                        fill
                        sizes="64px"
                      />
                      <Image
                        src={item.icon}
                        alt={`${item.name} png`}
                        key={`${item.id}`}
                        onClick={() => handleClick(item.id)}
                        className="z-40"
                        fill
                        sizes="64px"
                      />
                    </div>
                  );
                }
                return (
                  <div
                    className="relative h-[64px] w-[64px]"
                    key={`${item.id} item`}
                  >
                    <Image
                      src={item.icon}
                      alt={`${item.name} png`}
                      key={`${item.id}`}
                      fill
                      sizes="64px"
                      onClick={() => handleClick(item.id)}
                    />
                  </div>
                );
              })}
            {/* TEMPORARY WAY TO ADD A "FOOTER-ESQUE" thing to the shop */}
            <div className="mb-64" />
          </div>
        </div>
        {/* Right side panel that shows selected item description */}
        <div className="p-16 w-1/2 text-grey-1">
          {/* If an item is selected, then display it */}
          {currItem < 0 || (
            <div className="flex flex-col">
              <div className="relative h-[64px] w-[64px]">
                {getItemInfo(currItem, "requiredAlly") !== "Ornn" || (
                  <Image
                    src="https://raw.communitydragon.org/13.19/game/assets/items/itemmodifiers/bordertreatmentornn.png"
                    alt={`${getItemInfo(currItem, "name")} ornn border`}
                    key={`${currItem} ornn border`}
                    className="z-50 absolute"
                    fill
                    sizes="64px"
                  />
                )}
                <Image
                  src={getItemInfo(currItem, "icon")}
                  alt={`${getItemInfo(currItem, "name")} png`}
                  key={`item_${currItem}`}
                  className="z-40"
                  fill
                  sizes="64px"
                />
              </div>
              <h3 className="text-gold-2">{getItemInfo(currItem, "name")}</h3>
              <div className="mb-4">
                {getItemInfo(currItem, "simpleDescription")}
              </div>
              {/* Show the stats obtainable from buying the item */}
              <div className="mb-4">
                {objectMapArray(
                  extractItemStatFromDict(getItemInfo(currItem, "stats")),
                  (statName, value) => {
                    //  do some parsing
                    let currStatName = statName;
                    if (currStatName === "criticalStrikeChance") {
                      currStatName = "crit";
                    }
                    return (
                      <div
                        key={`${currStatName}`}
                        className="flex flex-row space-x-2"
                      >
                        <div className="w-5 h-5 relative">
                          <Image
                            src={`/images/${currStatName}.png`}
                            alt={`/images/${currStatName}.png`}
                            layout="fill"
                            key={`/images/${currStatName}.png`}
                          />
                        </div>
                        <div>
                          <span className="text-gold-1">{value}</span>{" "}
                          {statName}
                          {/* `${value} ${statName}` */}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
              {/* Map through all the item passives */}
              <div className="mb-4">
                {getItemInfo(currItem, "passives").map((currentPassive) => (
                  /*
                  Need a part to show Mythic Passives stats
                  */
                  <div key={`${currentPassive.name}`}>
                    <span className="text-gold-1">{currentPassive.name}</span>:{" "}
                    {currentPassive.effects}
                  </div>
                ))}
              </div>
              {/* Map through all the item actives */}
              <div className="mb-4">
                {getItemInfo(currItem, "active").map((currentActive) => (
                  <div key={`${currentActive.name}`}>
                    <span className="text-gold-4">{currentActive.name}</span>:{" "}
                    {currentActive.effects}
                  </div>
                ))}
              </div>
              {/* Button Div */}
              <div className="my-8 flex flex-col space-y-8">
                {/* Button to buy the item */}
                <GhostButtonGeneric
                  propStyles={{
                    text: "Purchase",
                    onPressFunc: (e) => {
                      handlePurchase(e, getItemInfo(currItem, "id"));
                    },
                  }}
                />
                {/* Button to sell the item  */}
                {/* Button to buy the item */}
                <GhostButtonGeneric
                  propStyles={{
                    text: "Sell",
                    onPressFunc: (e) => {
                      handleSell(e, getItemInfo(currItem, "id"));
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
