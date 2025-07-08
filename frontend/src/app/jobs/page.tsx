"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Job {
    id: number;
    title: string;
    description: string;
    companyId?: number;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [copiedJobId, setCopiedJobId] = useState<number | null>(null);
    const [companyId, setCompanyId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Get user from localStorage
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            // Not logged in, redirect to login
            router.replace("/register?tab=login");
            return;
        }
        try {
            const user = JSON.parse(userStr);
            if (!user.id) {
                router.replace("/register?tab=login");
                return;
            }
            setCompanyId(user.id.toString());
        } catch (e) {
            router.replace("/register?tab=login");
            return;
        }
        // Fetch jobs from backend
        fetch("http://45.63.114.116/jobs/")
            .then((res) => res.json())
            .then((data) => setJobs(data))
            .finally(() => setIsLoading(false));
    }, [router]);

    const handleCopyLink = (jobId: number) => {
        const link = `${window.location.origin}/jobs/${companyId}/${jobId}`;
        navigator.clipboard.writeText(link);
        setCopiedJobId(jobId);
        setTimeout(() => setCopiedJobId(null), 1500);
    };

    if (isLoading) {
        return <div className="text-center py-20 text-lg">Loading jobs...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] text-center">
                All Jobs
            </h1>
            <ul className="space-y-8">
                {jobs.map((job) => (
                    <li
                        key={job.id}
                        className="relative group rounded-2xl p-1 bg-gradient-to-r from-[#3887F6]/80 to-[#3AC7A7]/80 shadow-xl"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-[#0F172A] rounded-2xl p-6 transition-colors duration-300">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2 text-[#3887F6] dark:text-[#3AC7A7]">
                                    {job.title}
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 text-base mb-2">
                                    {job.description}
                                </p>
                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 select-all">
                                    Link: /jobs/{companyId}/{job.id}
                                </div>
                            </div>
                            <Button
                                onClick={() => handleCopyLink(job.id)}
                                className="mt-4 md:mt-0 md:ml-6 bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] text-white font-semibold px-6 py-2 rounded-lg shadow hover:from-[#2563eb] hover:to-[#1fa88b] transition-colors duration-200"
                            >
                                {copiedJobId === job.id ? "Copied!" : "Copy Link"}
                            </Button>
                        </div>
                        {/* Removed glow effect on hover */}
                    </li>
                ))}
            </ul>
        </div>
    );
} 