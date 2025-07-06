"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideNavbar = pathname.startsWith("/register");
    return (
        <>
            {!hideNavbar && <Navbar />}
            {children}
        </>
    );
} 