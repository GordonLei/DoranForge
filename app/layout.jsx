// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  console.log("RENDER THIS PLEASE");
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          Layout works
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
