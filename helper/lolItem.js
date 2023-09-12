import axios from "axios";
import { round } from "lodash";

export const validateInventory = (state, newItem) => {
  //  Need to validate only one Mythic + Mythic component
  //  Need to validate one Unique
  //  Need to validate any special interactions (ex. no navori + shojin)
  return [...state, newItem];
};
