

import DynamicTitle from "@/Components/DynamicTitle";
import Navbar from "@/Components/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "User Addresses",
  keywords: "Addresses, User Addresses",
  description: "User Addresses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <Navbar />
          <DynamicTitle />
          {children}
      </body>
    </html>
  );
}