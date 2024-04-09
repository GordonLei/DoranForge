// app/layout.tsx
import localFont from "next/font/local";
import HextechNavbar from "@/components/ui/hextechNavbar";
import Providers from "./providers";

//

// These styles apply to every route in the application
import "./globals.css";

const beaufort = localFont({
  src: [
    {
      path: "../public/fonts/BeaufortForLoL-OTF/BeaufortforLOL-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/BeaufortForLoL-OTF/BeaufortforLOL-Bold.otf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../public/fonts/BeaufortForLoL-OTF/BeaufortforLOL-Heavy.otf",
      weight: "900",
      style: "heavy",
    },
  ],
  variable: "--font-beaufort",
});

const spiegel = localFont({
  src: [
    {
      path: "../public/fonts/Spiegel-OTF/Spiegel-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Spiegel-OTF/Spiegel-Bold.otf",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-spiegel",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spiegel.variable} ${beaufort.variable} bg-gradient-to-r from-grey-cool to-hextech-black`}
    >
      <body>
        <Providers>
          <HextechNavbar />
          <main className="text-grey-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
