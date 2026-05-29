import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CARA — Premium Fitness & Lifestyle",
  description:
    "Shop the latest in fitness apparel, electronics, beauty, and home essentials. Free shipping on orders over $75.",
  keywords: ["fitness", "apparel", "activewear", "gym", "lifestyle", "shop"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
