import Navbar from "@/Components/Navbar";
import SearchBar from "@/Components/SearchBar";
import ServiceType from "@/Components/ServiceType";


export default function Manufacturers() {
    return (
        <div>
            <Navbar />
            <SearchBar />
            <ServiceType />
            <h1>Manufacturers</h1>
        </div>
    );
    }