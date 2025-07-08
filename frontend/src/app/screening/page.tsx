"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import TechBackground from "@/components/TechBackground";

export default function ScreeningPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [resume, setResume] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [jobId, setJobId] = useState<string | null>(null);
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [chatStarted, setChatStarted] = useState(false);
    const [initialBotMessage, setInitialBotMessage] = useState<string | string[] | undefined>(undefined);

    // Access control
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem("user")) {
                router.replace("/agents");
                return;
            }
            if (!localStorage.getItem("candidate")) {
                router.replace("/");
                return;
            }
            setJobId(localStorage.getItem("job_id"));
            setCompanyId(localStorage.getItem("company_id"));
        }
    }, [router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
            setUploadSuccess(false);
            setError("");
        }
    };

    // Helper to format questions as Markdown list
    const formatQuestionsMarkdown = (data: any) => {
        if (data && data.questions && Array.isArray(data.questions)) {
            return data.questions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n');
        }
        return typeof data === 'string' ? data : JSON.stringify(data);
    };

    const handleUpload = async () => {
        if (!resume) {
            setError("Please select a PDF file to upload.");
            return;
        }
        setUploading(true);
        setError("");
        if (jobId) {
            try {
                const formData = new FormData();
                formData.append("resume", resume);
                const res = await fetch(`http://45.63.114.116/screening/initial?jobId=${jobId}`, {
                    method: "POST",
                    body: formData,
                });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.detail || data.message || "Screening failed");
                }
                const data = await res.json();
                console.log(data)
                if (data && data.questions && Array.isArray(data.questions)) {
                    // Format as Markdown list
                    const markdown = data.questions.map((q: string) => `- ${q}`).join('\n');
                    setInitialBotMessage(markdown);
                } else {
                    setInitialBotMessage(typeof data === 'string' ? data : JSON.stringify(data));
                }
                setUploadSuccess(true);
                setChatStarted(true);
            } catch (err: any) {
                setError(err.message || "Screening failed. Please try again.");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleScreeningChat = async (message: string): Promise<string> => {
        if (!jobId) return "Job ID not found.";
        try {
            const res = await fetch(`http://45.63.114.116/screening/initial/answers?jobId=${jobId}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ answer: message })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || data.message || "Failed to submit answer");
            }
            const data = await res.json();
            return typeof data === "string" ? data : JSON.stringify(data);
        } catch (err: any) {
            return err.message || "Failed to submit answer. Please try again.";
        }
    };

    return (
        <TechBackground>
            <main className="flex flex-1 flex-col items-center justify-center z-10 relative px-4 py-8 min-h-screen">
                <div className="w-full max-w-3xl">
                    <div className="flex items-center gap-3 mb-6 justify-center">
                        <Bot className="w-8 h-8 text-[#3887F6]" />
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] bg-clip-text text-transparent">Resume Screening</h2>
                    </div>
                    <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                        Upload your resume (PDF) and start chatting with our Resume Screener Agent.
                    </p>
                    <div className="mb-4 text-center">
                        {jobId && companyId && (
                            <div className="text-xs text-gray-500">Screening for Job ID: <span className="font-bold">{jobId}</span> at Company ID: <span className="font-bold">{companyId}</span></div>
                        )}
                    </div>
                    {!chatStarted ? (
                        <>
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-[#3887F6] dark:text-[#3AC7A7]">Upload Resume (PDF)</label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3887F6] dark:bg-[#334155] dark:text-white file:bg-[#3887F6] file:text-white file:rounded file:px-3 file:py-1 file:border-0 file:mr-2"
                                        disabled={uploading}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleUpload}
                                        className="bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] text-white font-semibold px-6 py-2 rounded-lg shadow hover:from-[#2563eb] hover:to-[#1fa88b] transition-colors duration-200"
                                        disabled={uploading || !resume}
                                    >
                                        {uploading ? "Uploading..." : uploadSuccess ? "Uploaded!" : "Upload"}
                                    </Button>
                                </div>
                                {resume && !uploading && !uploadSuccess && (
                                    <div className="text-xs text-gray-500 mt-1">Selected: {resume.name}</div>
                                )}
                                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                                {uploadSuccess && (
                                    <div className="text-green-600 dark:text-green-400 text-sm mt-2">Resume uploaded successfully!</div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="mt-8">
                            <Button
                                type="button"
                                onClick={() => setChatStarted(false)}
                                className="mb-4 bg-[#3887F6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-full font-semibold shadow transition"
                            >
                                Back to Upload
                            </Button>
                            <Chatbot
                                agentName="Resume Screener Agent"
                                agentDescription={`I will help you screen your resume for Job ID: ${jobId} at Company ID: ${companyId}.`}
                                onSendMessage={handleScreeningChat}
                                initialBotMessage={initialBotMessage}
                            />
                        </div>
                    )}
                </div>
            </main>
        </TechBackground>
    );
} 