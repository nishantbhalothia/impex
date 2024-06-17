'use client'
import Address from "@/Components/Address";
import { useRouter } from "next/navigation";



export default function Home() {
    const router = useRouter();
    return (
        <div>
            <p style={{cursor:'pointer'}} onClick={()=> router.push('/users/addresses/addnew') }>
                Add new address
            </p>
            <Address />
        </div>
    );
    }