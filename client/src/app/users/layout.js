

import { Inter } from "next/font/google";
import StoreProvider from "@/redux/storeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "User Registration",
  keywords: "User Registration, Sign Up, Sign In, User Dashboard",
  description: "India,s most trusted online shopping import export company",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <StoreProvider> */}
          {children}
        {/* </StoreProvider> */}
      </body>
    </html>
  );
}