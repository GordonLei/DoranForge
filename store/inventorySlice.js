import { createSlice } from "@reduxjs/toolkit";
import { reduxValidateInventory } from "../helper/lolItem";

const initialState = [];

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setInventory: (_, action) => [...action.payload],
    addItem: (state, action) => {
      console.log(action);
      return reduxValidateInventory(state, action.payload);
    },
    removeItem: (state, action) => {
      //  need some logic to remove questions
      const id = action.payload;
      let found = false;
      return state.filter((currentItem) => {
        if (!found && currentItem.id === id) {
          found = true;
        } else {
          return currentItem;
        }
      });
    }
  }
});

export const { setInventory, addItem, removeItem } = inventorySlice.actions;
export const inventorySelector = (state) => state.inventory;
export default inventorySlice.reducer;
