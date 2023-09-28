/*
Helper file to interact with lol item data
*/

import axios from "axios";
import { round } from "lodash";

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
export const generateInventoryComponentInfo = (state) => {
  return {};
};
