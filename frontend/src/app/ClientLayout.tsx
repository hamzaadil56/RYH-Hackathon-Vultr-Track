"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Hide Navbar for /register and /jobs/[company_id]/[job_id] (candidate register/login)
    const hideNavbar = pathname.startsWith("/register") || /^\/jobs\/\d+\/\d+/.test(pathname);
    return (
        <>
            {!hideNavbar && <Navbar />}
            {children}
        </>
    );
} 