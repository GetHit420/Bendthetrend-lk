import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { Announcement, Footer, Header, MobileBar } from "@/components/Chrome";

const display = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--ff-display",
  display: "swap",
});
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--ff-sans", display: "swap" });

export const metadata: Metadata = {
  applicationName: "Bend the Trend",
  title: { default: "Bend the Trend — Custom bridal gowns, sarees & occasion wear", template: "%s — Bend the Trend" },
  description:
    "Bend the Trend designs custom-made bridal gowns, sarees, engagement, party and kids wear in Sri Lanka. Call or message to book a fitting.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1B0D15",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} style={{ backgroundColor: "#1B0D15" }} suppressHydrationWarning>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla, Grammarly) add attributes here before React loads */}
      <body id="top" className="font-sans pb-24 lg:pb-0" suppressHydrationWarning>
        <SmoothScroll>
          <Announcement />
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileBar />
        </SmoothScroll>
      </body>
    </html>
  );
}
