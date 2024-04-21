// import dynamic from "next/dynamic";
import SellerRegistration from "../components/SellerRegistration";
// const SellerRegistration = dynamic(() => import("@/Components/SellerRegistration"), {
//   ssr: false,
// });


export default function Manufacturers() {
    return (
        <div>
            <SellerRegistration />
        </div>
    );
    }