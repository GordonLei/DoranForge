import Image from "next/image";
import { useState, useEffect } from "react";
import { ReactReduxContext } from "react-redux";
//
import {
  getAllItemInfo,
  extractItemStatFromDict
} from "../helper/lolstaticdata";
import { generateInventoryComponentInfo } from "../helper/lolItem";
//
import { objectMapArray } from "../helper/misc";
import useSWRImmutable from "swr/immutable";
import { useDispatch, useSelector } from "react-redux";
//
import {
  addItem,
  removeItem,
  inventorySelector
} from "../store/inventorySlice";
//
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

export default function Shop({
  showShop,
  /* setInventory, */
  getItemDataMethod,
  setStat,
  currentItems
}) {
  /*
  need something to update stats
  */
  const parseData = (itemArray) => {
    console.log(itemArray);
    const dataDict = {};
    itemArray.map((currItem) => {
      dataDict[currItem.id] = currItem;
    });
    return dataDict;
  };
  const dispatch = useDispatch();

  const [currItem, setCurrItem] = useState(-1);
  const [parsedItemData, setParsedItemData] = useState({});
  //

  //
  //  let itemData;
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
  //  let itemData;
  //
  const handleClick = (itemId) => {
    console.log("CLICKED", itemId);
    setCurrItem(itemId);
  };

  const handlePurchase = (event, itemId) => {
    event.stopPropagation();
    console.log(itemId);
    console.log(parsedItemData);
    const item = parsedItemData[itemId];
    console.log("item, ", item);
    dispatch(addItem(parsedItemData[itemId]));
    /* setInventory(generateInventoryComponentInfo()); */
  };

  const handleSell = (event, itemId) => {
    event.stopPropagation();
    dispatch(removeItem(itemId));
  };

  //
  const getItemInfo = (id, param) => {
    const item = parsedItemData[id.toString()];
    console.log(item);
    return item[param];
  };
  /*
  const getItemData = async () => {
    let returnData;
    const latestItemJsonURL =
      process.cwd() +
      `/data/lolstaticdata/${process.env.leaguePatch}/items.json`;
    fetch(latestItemJsonURL).then(() => {});

    if (existsSync(latestItemJsonURL)) {
      const data = readFileSync(latestItemJsonURL);
      returnData = JSON.parse(data);
    } else {
      returnData = await getAllItemInfo();
    }
    return returnData;
  };
  */
  /*
  const url = "localhost:3000";
  useEffect(() => {
    fetch(`/api/json/${process.env.leaguePatch}/items.json`)
      .then((res) => {
        itemData = res.json();
      })
      .catch(async (res) => {
        itemData = await getAllItemInfo();
      });
  }, []);
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
        <div className="grid grid-cols-9 gap-2 bg-slate-500">
          <div className="sticky h-screen  top-16 overflow-y-scroll overscroll-contain col-span-5 grid grid-cols-5 gap-2">
            {parsedItemData &&
              Object.values(parsedItemData).map((item) => {
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
          {/* This is the item description */}
          <div className="sticky w-full col-span-4 pr-32">
            {currItem < 0 || (
              <div>
                <img
                  src={getItemInfo(currItem, "icon")}
                  alt={`${getItemInfo(currItem, "name")} png`}
                  key={`item_${currItem}`}
                />
                <div>{getItemInfo(currItem, "name")}</div>
                <div>{getItemInfo(currItem, "simpleDescription")}</div>

                {
                  /*
                  Need to show the stats 
                  */

                  // console.log(getItemInfo(currItem, "stats"));
                  objectMapArray(
                    extractItemStatFromDict(getItemInfo(currItem, "stats")),
                    (statName, value) => {
                      return (
                        <div key={`${statName}`}>{`${value} ${statName}`}</div>
                      );
                    }
                  )
                }

                {getItemInfo(currItem, "passives").map((currentPassive, id) => {
                  /*
              Need a part to show Mythic Passives
              */
                  return (
                    <div key={`${currentPassive.name}-${id}`}>
                      {currentPassive.name}: {currentPassive.effects}
                    </div>
                  );
                })}
                {getItemInfo(currItem, "active").map((currentActive, id) => {
                  return (
                    <div key={`${currentActive.name}-${id}`}>
                      {currentActive.name}: {currentActive.effects}
                    </div>
                  );
                })}
                <div
                  onClick={(e) => {
                    handlePurchase(e, getItemInfo(currItem, "id"));
                  }}
                >
                  Purchase
                </div>
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
