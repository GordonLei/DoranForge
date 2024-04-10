"use client";

//  imports
//    npm packages
import { useRef } from "react";
import { Provider } from "react-redux";
//    library functions
import { makeStore } from "../lib/store";

//  Redux provider
export default function ReduxProvider({ children }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
