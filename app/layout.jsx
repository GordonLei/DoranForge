// app/layout.tsx
import localFont from "next/font/local";
import Providers from "./providers";

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
      className={`dark ${spiegel.variable} ${beaufort.variable} `}
    >
      <body>
        <Providers>
          <div className="text-lime-500">Layout works</div>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
