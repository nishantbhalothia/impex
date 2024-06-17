

import Navbar from "@/Components/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "User Cart",
  keywords: "Cart, User Cart",
  description: "User Cart",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
          {children}
      </body>
    </html>
  );
}