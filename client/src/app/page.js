import BrowsingHistory from "@/Components/BrowsingHistory";
import Carousel from "@/Components/Carousel";
import Navbar from "@/Components/Navbar";
import NewArrivals from "@/Components/NewArrivals";
import PopularProducts from "@/Components/PopularProducts";
import ProductInspired from "@/Components/ProductInspired";
import Recommended from "@/Components/Recommended";
import SearchBar from "@/Components/SearchBar";
import ServiceType from "@/Components/ServiceType";

export default function Home() {
  return (
    <div>
      <Navbar />
      <SearchBar />
      <ServiceType />
      <Carousel />
      <BrowsingHistory />
      <PopularProducts />
      <NewArrivals />
      <Recommended />
      <ProductInspired />
    </div>
  );
}
