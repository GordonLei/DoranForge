import { createSlice } from "@reduxjs/toolkit";
import { extractItemStatFromDictAsTuple } from "../helper/lolItem";
import { update } from "lodash";
const initialState = {
  health: 0,
  mana: 0,
  armor: 0,
  magicResistance: 0,
  healthRegen: 0,
  manaRegen: 0,
  attackDamage: 0,
  attackSpeed: 0,
  moveSpeed: 0,
  attackRange: 0,
  abilityPower: 0,
  crit: 0,
  level: 0
  //  items: [] //  want this to make sure the items are there?
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setStats: (_, action) => {
      console.log("STATS: ", action.payload);
      return { ...action.payload, /* items: [] ,*/ level: 1 };
    },

    addStats: (state, action) => {
      const item = action.payload;
      console.log("HERE IS THE ITEM", item);
      let updatedStats = state;
      const itemStats = extractItemStatFromDictAsTuple(item.stats);
      //
      console.log("THESE ARE THE ITEM STATS:", itemStats);
      Object.keys(itemStats).map((statName) => {
        if (itemStats[statName][1] === "flat") {
          console.log(`Old ${statName}: ${updatedStats[statName]}`);
          updatedStats[statName] += itemStats[statName][0];
          //  MIGHT NEED SOMETHING HERE TO ADD ITEM TO THE STATS STATE
          console.log(`New ${statName}: ${updatedStats[statName]}`);
        }
      });
      //
      return updatedStats;
    },

    removeStats: (state, action) => {
      const item = action.payload;
      console.log("HERE IS THE ITEM", item);
      let updatedStats = state;
      const itemStats = extractItemStatFromDictAsTuple(item.stats);
      //
      console.log("THESE ARE THE ITEM STATS:", itemStats);
      Object.keys(itemStats).map((statName) => {
        if (itemStats[statName][1] === "flat") {
          console.log(`Old ${statName}: ${updatedStats[statName]}`);
          updatedStats[statName] -= itemStats[statName][0];
          //  MIGHT NEED SOMETHING HERE TO ADD ITEM TO THE STATS STATE
          console.log(`New ${statName}: ${updatedStats[statName]}`);
        }
      });
      //
      return updatedStats;
    }
  }
});

export const { setStats, addStats, removeStats } = statsSlice.actions;
export const statsSelector = (state) => state.stats;
export default statsSlice.reducer;
