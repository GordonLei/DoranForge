// app/layout.tsx
import { Providers } from "./providers";

// These styles apply to every route in the application
import "./globals.css";

export default function RootLayout({ children }) {
  console.log("RENDER THIS PLEASE");
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <div className="text-lime-500">Layout works</div>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
