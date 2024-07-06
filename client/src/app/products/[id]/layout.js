

import Navbar from "@/Components/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bhalothia.com",
  keywords: "Bhalothia Bhalothia.com Bhalothia.in",
  description: "Bhalothia.com is a platform for buying and selling products online. We provide a wide range of products at the best prices.",
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