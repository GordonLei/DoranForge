/*

This component is that shop pop up where users can purchase and sell items

*/

//  libraries
import Image from "next/image";
import { useState, useEffect } from "react";
import useSWRImmutable from "swr/immutable";
//  helper functions
import { getAllItemInfo } from "../helper/lolstaticdata";
import {
  generateInventoryComponentInfo,
  extractItemStatFromDict,
  checkInInventory
} from "../helper/lolItem";
import { objectMapArray } from "../helper/misc";
import { validateInventory } from "../helper/lolItem";
//  react-redux
import { ReactReduxContext } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItemById,
  inventorySelector
} from "../store/inventorySlice";
import { addStats, removeStats } from "../store/statsSlice";

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      res = JSON.parse(res);
      const data = objectMapArray(res, (key, value) => {
        return value;
      });
      console.log("The data is: ", data);
      return data;
    });

//  Shop component
export default function Shop({
  showShop,
  /* setInventory, */
  getItemDataMethod,
  setStat,
  currentItems
}) {
  /*
  Vars
  */

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
    console.log(itemArray);
    const dataDict = {};
    itemArray.map((currItem) => {
      dataDict[currItem.id] = currItem;
    });
    return dataDict;
  };
  //Set up SWR to run the fetcher function when calling "/api/staticdata"
  //There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const { itemData, error } = useSWRImmutable("/api/itemData", fetcher, {
    onSuccess: (data, key, config) => {
      console.log("Entered onSuccess");
      //  do something to parse the data
      let parsedData = parseData(data);
      console.log("DONE");
      setParsedItemData(parsedData);
      console.log(parsedData);
    }
  });
  //  handle pressing the item and setting the current selected item to that
  const handleClick = (itemId) => {
    console.log("CLICKED", itemId);
    setCurrItem(itemId);
  };
  //  handle buying the selected item
  const handlePurchase = (event, itemId) => {
    event.stopPropagation();
    console.log(itemId);
    console.log(parsedItemData);
    const item = parsedItemData[itemId];
    console.log("item, ", item);
    if (validateInventory(currentInventory, item)) {
      dispatch(addItem(item));
      dispatch(addStats(item));
    }

    /* setInventory(generateInventoryComponentInfo()); */
  };
  //  handle selling the selected item
  const handleSell = (event, itemId) => {
    event.stopPropagation();
    console.log(itemId);
    console.log(parsedItemData);
    const item = parsedItemData[itemId];
    console.log("item, ", item);
    if (checkInInventory(currentInventory, item)) {
      dispatch(removeItemById(itemId));
      dispatch(removeStats(item));
    }
  };
  //  from the item dict, get the item information based on a key/property of the item + item id
  const getItemInfo = (id, param) => {
    const item = parsedItemData[id.toString()];
    //  console.log(item);
    return item[param];
  };

  /*
  Return the component
  */

  //Handle the error state
  if (error && showShop) return <div>Failed to load</div>;
  //Handle the loading state
  if (!parsedItemData && showShop) return <div>Loading... {itemData} what</div>;
  //
  //Handle the ready state and display the result contained in the data object mapped to the structure of the json file
  if (showShop) {
    return (
      <div className="flex overscroll-auto fixed ">
        {/* This is the shop window */}
        {/* Left side panel that shows all the items */}
        <div className="grid grid-cols-9 gap-2 bg-slate-500">
          <div className="sticky h-screen  top-16 overflow-y-scroll overscroll-contain col-span-5 grid grid-cols-5 gap-2">
            {parsedItemData &&
              Object.values(parsedItemData).map((item) => {
                if (item.requiredAlly === "Ornn") {
                  return (
                    <div className="relative">
                      {/* NOTE:  need to change this link*/}
                      <img
                        src={`https://raw.communitydragon.org/13.19/game/assets/items/itemmodifiers/bordertreatmentornn.png`}
                        alt={`${item.name} ornn border`}
                        key={`${item.id} ornn border`}
                        onClick={(e) => handleClick(item.id)}
                        className="z-50 absolute"
                      />
                      <img
                        src={item.icon}
                        alt={`${item.name} png`}
                        key={`${item.id}`}
                        onClick={(e) => handleClick(item.id)}
                        className="z-40"
                      />
                    </div>
                  );
                }
                return (
                  <img
                    src={item.icon}
                    alt={`${item.name} png`}
                    key={`${item.id}`}
                    onClick={(e) => handleClick(item.id)}
                  />
                );
              })}
          </div>
          {/* Right side panel that shows selected item description */}
          <div className="sticky w-full col-span-4 pr-32">
            {/* If an item is selected, then display it*/}
            {console.log(`CHECK THIS: ${currItem}`)}
            {currItem < 0 || (
              <div className="relative">
                {getItemInfo(currItem, "requiredAlly") !== "Ornn" || (
                  <img
                    src={`https://raw.communitydragon.org/13.19/game/assets/items/itemmodifiers/bordertreatmentornn.png`}
                    alt={`${getItemInfo(currItem, "name")} ornn border`}
                    key={`${currItem} ornn border`}
                    className="z-50 absolute"
                  />
                )}
                <img
                  src={getItemInfo(currItem, "icon")}
                  alt={`${getItemInfo(currItem, "name")} png`}
                  key={`item_${currItem}`}
                  className="z-40"
                />
                <div>{getItemInfo(currItem, "name")}</div>
                <div>{getItemInfo(currItem, "simpleDescription")}</div>
                {/* Show the stats obtainable from buying the item */}
                {objectMapArray(
                  extractItemStatFromDict(getItemInfo(currItem, "stats")),
                  (statName, value) => {
                    return (
                      <div key={`${statName}`}>{`${value} ${statName}`}</div>
                    );
                  }
                )}
                {/* Map through all the item passives */}
                {getItemInfo(currItem, "passives").map((currentPassive, id) => {
                  /*
                  Need a part to show Mythic Passives stats
                  */
                  return (
                    <div key={`${currentPassive.name}-${id}`}>
                      {currentPassive.name}: {currentPassive.effects}
                    </div>
                  );
                })}
                {/* Map through all the item actives */}
                {getItemInfo(currItem, "active").map((currentActive, id) => {
                  return (
                    <div key={`${currentActive.name}-${id}`}>
                      {currentActive.name}: {currentActive.effects}
                    </div>
                  );
                })}
                {/* Button to buy the item */}
                <div
                  onClick={(e) => {
                    handlePurchase(e, getItemInfo(currItem, "id"));
                  }}
                >
                  Purchase
                </div>
                {/* Button to sell the item  */}
                <div
                  onClick={(e) => {
                    handleSell(e, getItemInfo(currItem, "id"));
                  }}
                >
                  Sell
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
