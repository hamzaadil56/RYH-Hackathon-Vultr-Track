"use client";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Navbar = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [isCandidate, setIsCandidate] = useState(false);
    const [candidateJobUrl, setCandidateJobUrl] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsCandidate(!!localStorage.getItem("candidate"));
            const jobId = localStorage.getItem("job_id");
            const companyId = localStorage.getItem("company_id");
            if (jobId && companyId) {
                setCandidateJobUrl(`/jobs/${companyId}/${jobId}`);
            } else {
                setCandidateJobUrl(null);
            }
        }
        // Listen for storage changes (e.g., logout in another tab)
        const handleStorage = () => {
            setIsCandidate(!!localStorage.getItem("candidate"));
            const jobId = localStorage.getItem("job_id");
            const companyId = localStorage.getItem("company_id");
            if (jobId && companyId) {
                setCandidateJobUrl(`/jobs/${companyId}/${jobId}`);
            } else {
                setCandidateJobUrl(null);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleCandidateLogout = () => {
        localStorage.removeItem("candidate");
        setIsCandidate(false);
        // Keep job_id and company_id in localStorage for redirect
        router.push("/");
    };

    return (
        <header className=" flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-4 sm:py-6 z-10 relative gap-4 sm:gap-0">
            <div className="flex items-center">
                {/* Logo Image */}
                <Link href="/">
                    <Image
                        src="/assets/Logo.png"
                        alt="Company Logo"
                        width={48}
                        height={48}
                        className="object-contain w-12 h-12 cursor-pointer"
                        priority
                    />
                </Link>
            </div>
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end items-center">
                <ThemeToggle />
                {isAuthenticated ? (
                    <>
                        <Link href="/jobs">
                            <Button className="bg-[#3887F6] hover:bg-[#2563eb] text-white px-6 py-4 rounded-full font-semibold shadow transition w-full sm:w-auto cursor-pointer">Jobs</Button>
                        </Link>
                        <UserAvatar />
                    </>
                ) : isCandidate ? (
                    <>
                        <Link href="/screening">
                            <Button className="bg-[#3887F6] hover:bg-[#2563eb] text-white px-6 py-4 rounded-full font-semibold shadow transition w-full sm:w-auto cursor-pointer">Screening</Button>
                        </Link>
                        <Button onClick={handleCandidateLogout} className="bg-[#3887F6] hover:bg-[#2563eb] text-white px-6 py-4 rounded-full font-semibold shadow transition w-full sm:w-auto cursor-pointer">Logout</Button>
                    </>
                ) : (
                    <>
                        {candidateJobUrl ? (
                            <Link href={candidateJobUrl}>
                                <Button className="bg-[#3887F6] hover:bg-[#2563eb] text-white px-6 py-4 rounded-full font-semibold shadow transition w-full sm:w-auto cursor-pointer">View Job</Button>
                            </Link>
                        ) : null}
                        <Link href="/register">
                            <Button className="bg-[#3887F6] hover:bg-[#2563eb] text-white px-6 py-4 rounded-full font-semibold shadow transition w-full sm:w-auto cursor-pointer">Register Here</Button>
                        </Link>
                        <Link href="/register?tab=login">
                            <Button className="bg-[#3887F6] hover:bg-[#2563eb] text-white px-6 py-4 rounded-full font-semibold shadow transition w-full sm:w-auto cursor-pointer">Log In</Button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}; 