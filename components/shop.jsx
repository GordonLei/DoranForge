import Image from "next/image";
import { useState, useEffect } from "react";
import { getAllItemInfo } from "../helper/lolstaticdata";
import { objectMapArray } from "../helper/misc";
import useSWRImmutable from "swr/immutable";

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
  getItemDataMethod,
  setStat,
  currentItems
}) {
  /*
  need something to update stats
  */
  const [currItem, setCurrItem] = useState(-1);
  const [unparsedItemData, setUnparsedItemData] = useState([]);
  let dictData;
  let dummyData;
  //  let itemData;
  //Set up SWR to run the fetcher function when calling "/api/staticdata"
  //There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const { itemData, error } = useSWRImmutable("/api/itemData", fetcher, {
    onSuccess: (data, key, config) => {
      console.log("Entered onSuccess");
      setUnparsedItemData(data);
      console.log(unparsedItemData);
    }
  });
  //  let itemData;
  //
  const handleClick = (id) => {
    console.log("CLICKED");
    setCurrItem(id);
  };
  //
  const getItem = (id, param) => {
    const item = itemData[id.toString()];
    console.log(item);
    return item;
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
  if (!unparsedItemData && showShop)
    return <div>Loading... {itemData} what</div>;
  //
  //Handle the ready state and display the result contained in the data object mapped to the structure of the json file
  if (showShop) {
    return (
      <div>
        {/* This is the shop window */}
        <div className="grid grid-cols-9 gap-2 bg-slate-500">
          {unparsedItemData &&
            unparsedItemData.map((item) => {
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
        {currItem < 0 || (
          <div>
            <img
              src={getItem(currItem, "icon")}
              alt={`${getItem(currItem, "name")} png`}
              key={`item_${currItem}`}
            />
            {getItem(currItem, "simpleDescription")}
          </div>
        )}
      </div>
    );
  }
}
