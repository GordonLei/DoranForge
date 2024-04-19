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
import {
  statsSelector,
  addStats,
  removeStats,
} from "@/lib/storeFeatures/stats/statsSlice";

//  helper functions
import {
  checkInInventory,
  validateInventory,
  parseItemData,
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
  const currentStats = useSelector(statsSelector);
  //  react  states
  const [currItemId, setcurrItemId] = useState(-1);
  const [currItem, setcurrItem] = useState({});
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
    setcurrItemId(itemId);
    setcurrItem(parseItemData("", currentStats, parsedItemData[itemId]));
    console.log(
      "PARSED DATA:",
      parseItemData("", currentStats, parsedItemData[itemId])
    );
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

          {currItemId < 0 || (
            <div className="flex flex-col">
              <div className="relative h-[64px] w-[64px]">
                {currItem.requiredAlly !== "Ornn" || (
                  <Image
                    src="https://raw.communitydragon.org/13.19/game/assets/items/itemmodifiers/bordertreatmentornn.png"
                    alt={`${currItem.name} ornn border`}
                    key={`${currItem.name} ornn border`}
                    className="z-50 absolute"
                    fill
                    sizes="64px"
                  />
                )}
                <Image
                  src={currItem.icon}
                  alt={`${currItem.name} png`}
                  key={`item_${currItem.name}`}
                  className="z-40"
                  fill
                  sizes="64px"
                />
              </div>
              <h3 className="text-gold-2">{currItem.name}</h3>
              <div className="flex flex-row">
                <div className="w-5 h-5 relative">
                  <Image
                    src="/images/gold.png"
                    alt="/images/gold.png"
                    layout="fill"
                    key={`${currItem.name}-shop-gold-icon`}
                  />
                </div>
                <div>{currItem.totalPrice} </div>
              </div>

              <div className="mb-4">{currItem.simpleDescription}</div>
              {/* Show the stats obtainable from buying the item */}
              <div className="mb-4">
                {currItem.statArray.map((eachStat, index) => {
                  //  do some parsing
                  let currStatName = eachStat.name;
                  if (currStatName === "criticalStrikeChance") {
                    currStatName = "crit";
                  }
                  return (
                    <div
                      key={`${index}-${currStatName}-shop-view`}
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
                      <span className="text-gold-1">{eachStat.value}</span>
                      <span> {eachStat.name}</span>
                    </div>
                  );
                })}
              </div>
              {/* Map through all the item passives */}
              <div className="mb-4">
                {console.log(currItem.passives, currItem.passives.length)}
                {currItem.passives.map((currentPassive, index) => (
                  <div key={`${currentPassive.name}-shop-view`}>
                    {console.log(
                      "WHAT IS THIS: ",
                      `${currentPassive.name}-${index}`
                    )}
                    {currentPassive.text}
                  </div>
                ))}
              </div>
              {/* Map through all the item actives */}
              <div className="mb-4">
                {currItem.active.map((currentActive) => (
                  <div key={`${currentActive.name}-shop-view`}>
                    {currentActive.text}
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
                      handlePurchase(e, currItem.id);
                    },
                  }}
                />
                {/* Button to sell the item  */}
                {/* Button to buy the item */}
                <GhostButtonGeneric
                  propStyles={{
                    text: "Sell",
                    onPressFunc: (e) => {
                      handleSell(e, currItem.id);
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
