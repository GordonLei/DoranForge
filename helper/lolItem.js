import axios from "axios";
import { round } from "lodash";

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
export const reduxValidateInventory = (state, newItem) => {
  //  Need to validate only one Mythic + Mythic component
  //  Need to validate one Unique
  //  Need to validate any special interactions (ex. no navori + shojin)
  console.log(state, validateInventory(state, newItem));
  if (validateInventory(state, newItem)) {
    return [...state, newItem];
  }
};

export const generateInventoryComponentInfo = (state) => {
  return {};
};
