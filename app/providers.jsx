/*
This has all the providers (ex. React Redux)
*/

"use client";

//  imports
//    npm packages
import { NextUIProvider } from "@nextui-org/react";
//    Personal Redux folder
import ReduxProvider from "./ReduxProvider";

//  Provider component
export default function Providers({ children }) {
  return (
    <ReduxProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </ReduxProvider>
  );
}
