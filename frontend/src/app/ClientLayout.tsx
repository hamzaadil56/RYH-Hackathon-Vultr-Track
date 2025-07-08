"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Hide Navbar for /register and /jobs/[company_id]/[job_id] (candidate register/login)
    const hideNavbar = pathname.startsWith("/register") || /^\/jobs\/\d+\/\d+/.test(pathname);
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <>
                {!hideNavbar && <Navbar />}
                {children}
            </>
        </Suspense>
    );
} 