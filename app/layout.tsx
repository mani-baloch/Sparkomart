import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { CartNotification } from "@/components/ui/CartNotification";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SparkoMart | Everything You Need, All in One Place",
  description:
    "From health & beauty to tools & automotive – SparkoMart brings you quality products across every category at unbeatable prices with fast USA shipping.",
  keywords: [
    "SparkoMart",
    "electronics",
    "clothing & fashion",
    "home & kitchen",
    "sports & outdoors",
    "online marketplace",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} antialiased`}>
      <body className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
        <CartProvider>
          <WishlistProvider>
            {children}
            <CartDrawer />
            <CartNotification />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
