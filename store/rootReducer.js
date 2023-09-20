import { combineReducers, configureStore } from "@reduxjs/toolkit";
import inventory from "./inventorySlice";
import stats from "./statsSlice";

const rootReducer = combineReducers({
  inventory,
  stats
});

export const store = configureStore({
  reducer: rootReducer
});
