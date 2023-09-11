import { combineReducers, configureStore } from "@reduxjs/toolkit";
import inventory from "./inventorySlice";

const rootReducer = combineReducers({
  inventory
});

export const store = configureStore({
  reducer: rootReducer
});
