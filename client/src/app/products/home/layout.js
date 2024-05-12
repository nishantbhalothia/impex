import Navbar from "@/Components/Navbar";
import SearchBar from "@/Components/SearchBar";
import ServiceType from "@/Components/ServiceType";
import ProductsHome from "@/Components/Products/ProductsHome";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Products Home- Bhalothia.com",
  keywords:
    "Bhalothia, Bhalothia.com, Bhalothia.in, Bhalothia.co.in, Bhalothia.co, Bhalothia.in, Bhalothia.org, Bhalothia.net, Bhalothia.info, Bhalothia.xyz, Bhalothia.shop, Bhalothia.store, Bhalothia.online, Bhalothia.website, Bhalothia.tech, Bhalothia.app, Bhalothia.blog, Bhalothia.business, Bhalothia.site, Bhalothia.page, Bhalothia.space, Bhalothia.live, Bhalothia.life, Bhalothia.world, Bhalothia.global, Bhalothia.international, Bhalothia.national, Bhalothia.local, Bhalothia.india, Bhalothia.usa, Bhalothia.uk, Bhalothia.canada, Bhalothia.australia, Bhalothia.newzealand, Bhalothia.southafrica, Bhalothia.srilanka, Bhalothia.nepal, Bhalothia.bhutan, Bhalothia.bangladesh, Bhalothia.pakistan, Bhalothia.china, Bhalothia.japan, Bhalothia.korea, Bhalothia.singapore, Bhalothia.malaysia, Bhalothia.indonesia, Bhalothia.thailand, Bhalothia.vietnam, Bhalothia.philippines, Bhalothia.taiwan, Bhalothia.hongkong, Bhalothia.macao, Bhalothia.tibet, Bhalothia.mongolia, Bhalothia.russia, Bhalothia.kazakhstan, Bhalothia.uzbekistan, Bhalothia.turkmenistan, Bhalothia.afghanistan, Bhalothia.iran, Bhalothia.iraq, Bhalothia.syria, Bhalothia.jordan,",
  description: "World's most trusted online shopping import export company",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <SearchBar />
        <ProductsHome />
        {children}
    </body>
    </html>
  );
}
