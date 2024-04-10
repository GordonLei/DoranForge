/*
This is the base layout that all pages will use
*/

//  imports
//    components (this needs to be ahead in the front of the NPM packages for this file)
import HextechNavbar from "@/components/ui/hextechNavbar";
//    npm packages
import localFont from "next/font/local";
import Providers from "./providers";

// These styles apply to every route in the application
import "./globals.css";

//  fonts
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

//  component
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
