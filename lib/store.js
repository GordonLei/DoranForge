import { configureStore } from "@reduxjs/toolkit";
import inventory from "./storeFeatures/inventory/inventorySlice";
import stats from "./storeFeatures/stats/statsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      inventory,
      stats,
    },
  });
};
