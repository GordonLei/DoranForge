import { createSlice } from "@reduxjs/toolkit";
import { extractItemStatFromDictAsTuple } from "../helper/lolItem";
import { update, round } from "lodash";
import { growthStatisticCalculation } from "../helper/lol";

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
    },
    updateLevel: (state, action) => {
      const newLevel = action.payload.newLevel;
      const perLevelStats = action.payload.perLevelStats;
      const currentLevel = state.level;
      const updatedStats = {
        ...state,
        level: newLevel,
        health: round(
          state.health +
            growthStatisticCalculation(
              perLevelStats.healthPerLevel,
              currentLevel,
              newLevel
            ),
          2
        ),

        mana: round(
          state.mana +
            growthStatisticCalculation(
              perLevelStats.manaPerLevel,
              currentLevel,
              newLevel
            ),
          2
        ),
        armor: round(
          state.armor +
            growthStatisticCalculation(
              perLevelStats.armorPerLevel,
              currentLevel,
              newLevel
            ),
          2
        ),
        magicResistance: round(
          state.magicResistance +
            growthStatisticCalculation(
              perLevelStats.magicResistancePerLevel,
              currentLevel,
              newLevel
            ),
          2
        ),
        healthRegen: round(
          state.healthRegen +
            growthStatisticCalculation(
              perLevelStats.healthRegenPerLevel,
              currentLevel,
              newLevel
            ),
          2
        ),
        manaRegen: round(
          state.manaRegen +
            growthStatisticCalculation(
              perLevelStats.manaRegenPerLevel,
              currentLevel,
              newLevel
            ),
          2
        ),
        attackDamage: round(
          state.attackDamage +
            growthStatisticCalculation(
              perLevelStats.attackDamagePerLevel,
              currentLevel,
              newLevel
            ),
          2
        ),
        attackSpeed: round(
          state.attackSpeed +
            growthStatisticCalculation(
              perLevelStats.attackSpeedPerLevel,
              newLevel
            ),
          2
        ),
        moveSpeed: round(
          state.moveSpeed +
            growthStatisticCalculation(
              perLevelStats.moveSpeedPerLevel,
              currentLevel,
              newLevel
            ),
          2
        ),
        attackRange: round(
          state.attackRange +
            growthStatisticCalculation(
              perLevelStats.attackRangePerLevel,
              currentLevel,
              newLevel
            ),
          2
        ),
        crit: round(state.crit, 2)
      };
      return updatedStats;
    }
  }
});

export const { setStats, addStats, removeStats, updateLevel } =
  statsSlice.actions;
export const statsSelector = (state) => state.stats;
export default statsSlice.reducer;
