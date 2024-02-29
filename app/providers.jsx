// app/providers.tsx

"use client";

import { NextUIProvider } from "@nextui-org/react";
import ReduxProvider from "./ReduxProvider";

export default function Providers({ children }) {
  return (
    <ReduxProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </ReduxProvider>
  );
}
