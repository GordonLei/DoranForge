/*
Helper file to interact with lol item data
*/

import { findWord } from "./misc";

//  from a dictionary of statistics, form a dict with key-value pair of the stat as the key
//    and the amount gained + progression type as the value (the return value as being a string)
export const extractItemStatFromDict = (statDict) => {
  const extractedStatDict = {};
  for (const [stat, statValueDict] of Object.entries(statDict)) {
    for (const [progressionType, value] of Object.entries(statValueDict)) {
      if (value > 0) {
        extractedStatDict[stat] = `${value} ${progressionType} `;
      }
    }
  }
  return extractedStatDict;
};

//  same thing as extractItemStatFromDict but return the result as an array
export const extractItemStatFromDictAsTuple = (statDict) => {
  const extractedStatDict = {};
  for (const [stat, statValueDict] of Object.entries(statDict)) {
    for (const [progressionType, value] of Object.entries(statValueDict)) {
      if (value > 0) {
        extractedStatDict[stat] = [value, `${progressionType}`];
      }
    }
  }
  return extractedStatDict;
};

//  check if the item is currently  in the inventory
export const checkInInventory = (currentInventory, item) => {
  const itemID = item.id;
  console.log("ITEMID:", item, itemID);
  for (let i = 0; i < currentInventory.length; i++) {
    if (currentInventory[i].id === itemID) {
      return true;
    }
  }
  return false;
};

//  make sure the selected item can be purchased based onn restrictions
export const validateInventory = (currentInventory, newItem) => {
  if (currentInventory.length >= 6) {
    return false;
  }
  //  Need to validate only one Mythic + Mythic component
  //  Need to validate one Unique
  //  Need to validate any special interactions (ex. no navori + shojin)

  //
  //  if everything looks fine, then return true
  return true;
};

//  DO NOT NEED THIS FUNCTION. Made temporarily when validateInventory was not made
//  if validateInventory works, then return a new state containing the item
export const reduxValidateInventory = (state, newItem) => {
  //  Need to validate only one Mythic + Mythic component
  //  Need to validate one Unique
  //  Need to validate any special interactions (ex. no navori + shojin)
  console.log(state, validateInventory(state, newItem));
  if (validateInventory(state, newItem)) {
    return [...state, newItem];
  }
};

//  skeleton of a function that was going to be used but now not sure
export const generateInventoryComponentInfo = (state) => ({});

//  stylize the stats of an item
export const stylizeStats = (statName, statValue) => {
  switch (statName) {
    case "attackDamage":
      return <div>Yes</div>;
    default:
      return (
        <div>
          {statName} {statValue}
        </div>
      );
  }
};

//  MASTER function to return an array of item stats that is fully stylized
export const parseItemStats = (itemStats) => {
  const parsedItemStats = extractItemStatFromDict(itemStats);
  return Object.entries(parsedItemStats).map(([key, value]) =>
    stylizeStats(key, value)
  );
};

//  ===============================================================
//  Parse item descriptions to get number values

//  STEP 1: Prep anything you have to remove from the item effect
const prepStylize = () => {};

//  Step 2: replace any segments (ex. AD) with the stat value
const numerize = (text, currentStats) => {};

//  Optional Step: maybe not necessary. check if item has special conditions
const modifyAttribute = (itemName, attribute) => attribute;

//  Step 3: this will colorize the text and leave it in its final form
const colorizeAndFinalize = (propText, skillButtonName) => {};

//  MASTER FUNCTION to parse item passive / active descriptions
//    This will return an object with every information you need in an object to display information
export const parseItemData = (championName, currentStats, itemData) => {
  const masterRes = {};
  //  get the item stat information
  const parsedItemStats = extractItemStatFromDict(itemData.stats);
  const statArray = Object.entries(parsedItemStats).map(([key, value]) =>
    stylizeStats(key, value)
  );
  masterRes.statArray = statArray;
  //  this following section is related to parsing item passive and actives

  return masterRes;
};
