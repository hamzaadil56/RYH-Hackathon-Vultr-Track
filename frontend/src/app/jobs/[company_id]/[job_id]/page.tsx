"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Suspense } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function CandidateJobPage() {
    const router = useRouter();
    const params = useParams();
    const companyId = params.company_id as string;
    const jobId = params.job_id as string;

    const [tab, setTab] = useState("register");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);

    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

    useEffect(() => {
        // If company is logged in, redirect to company dashboard
        if (typeof window !== 'undefined') {
            if (localStorage.getItem("user")) {
                router.replace("/agents");
                return;
            }
            // If already logged in as candidate, redirect to screening
            if (localStorage.getItem("candidate")) {
                router.replace(`/screening?company=${companyId}&job=${jobId}`);
                return;
            }
        }
    }, [companyId, jobId, router]);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
        if (e.target.name === 'name' || e.target.name === 'email') {
            setError("");
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!loginForm.email) {
            setError("Email is required.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!loginForm.password) {
            setError("Password is required.");
            return;
        }
        setLoginLoading(true);
        try {
            const res = await fetch("http://45.63.114.116/auth/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loginForm.email,
                    password: loginForm.password,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || data.message || "Login failed");
            }
            const data = await res.json();
            localStorage.setItem("candidate", JSON.stringify(data));
            // Store job_id and company_id for screening
            localStorage.setItem("job_id", jobId);
            localStorage.setItem("company_id", companyId);
            setLoginLoading(false);
            router.replace(`/screening?company=${companyId}&job=${jobId}`);
        } catch (err: any) {
            setLoginLoading(false);
            setError(err.message || "Login failed. Please try again.");
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!registerForm.name) {
            setError("Name is required.");
            return;
        }
        if (!registerForm.email) {
            setError("Email is required.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!registerForm.password) {
            setError("Password is required.");
            return;
        }
        if (registerForm.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (registerForm.password !== registerForm.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            const [first_name, ...rest] = registerForm.name.split(" ");
            const last_name = rest.join(" ");
            const res = await fetch("http://45.63.114.116/auth/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: registerForm.email,
                    first_name,
                    last_name,
                    password: registerForm.password,
                    company_id: Number(companyId),
                    role: "user",
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || data.message || "Registration failed");
            }
            // const data = await res.json();
            setLoading(false);
            setSuccess("Registration successful! Please log in.");
            setTab("login");
        } catch (err: any) {
            setLoading(false);
            setError(err.message || "Registration failed. Please try again.");
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen flex items-center justify-center bg-[#F4F8FB] dark:bg-[#0F172A] relative overflow-hidden">
                <Card className="w-full max-w-md rounded-2xl shadow-2xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 p-0 relative z-10">
                    <CardContent className="p-8">
                        <h2 className="text-3xl p-2 font-bold bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] bg-clip-text text-transparent text-center mb-2 flex items-center justify-center gap-2">
                            {tab === "login" ? "Login" : "Register"}
                        </h2>
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                            {tab === "login"
                                ? "Please login with your email and password."
                                : "Please register with your details"}
                        </p>
                        {error && typeof error === 'string' && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
                                {success}
                            </div>
                        )}
                        <Tabs value={tab} className="w-full mb-6" onValueChange={setTab}>
                            <TabsList className="w-full flex bg-[#E6F0FA] dark:bg-[#334155] rounded-lg p-1 h-12">
                                <TabsTrigger value="login" className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3887F6] data-[state=active]:to-[#3AC7A7] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#3887F6] dark:data-[state=inactive]:text-[#94A3B8] px-6 py-3 text-base font-medium transition-all duration-200 cursor-pointer">Login</TabsTrigger>
                                <TabsTrigger value="register" className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3887F6] data-[state=active]:to-[#3AC7A7] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#3887F6] dark:data-[state=inactive]:text-[#94A3B8] px-6 py-3 text-base font-medium transition-all duration-200 cursor-pointer">Register</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login">
                                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                                    <div className="relative">
                                        <Input
                                            id="login-email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={loginForm.email}
                                            onChange={handleLoginChange}
                                            className=" bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="login-password"
                                            name="password"
                                            type={showLoginPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={loginForm.password}
                                            onChange={handleLoginChange}
                                            className=" bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowLoginPassword(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            {showLoginPassword ? <EyeOff size={18} className="text-gray-400 dark:text-gray-500" /> : <Eye size={18} className="text-gray-400 dark:text-gray-500" />}
                                        </button>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={loginLoading}
                                        className="w-full mt-2 bg-[#3887F6] hover:bg-[#2563eb] text-white text-lg font-semibold rounded-full py-4 px-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loginLoading ? "Logging in..." : "Login"}
                                    </Button>
                                </form>
                                <div className="mt-2 text-center">
                                    <Link href="/" className="text-[#3887F6] hover:text-[#3AC7A7] hover:underline transition-colors cursor-pointer">Go back</Link>
                                </div>
                            </TabsContent>
                            <TabsContent value="register">
                                <form className="space-y-6" onSubmit={handleRegisterSubmit}>
                                    <div className="relative">
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Enter your name"
                                            value={registerForm.name}
                                            onChange={handleRegisterChange}
                                            className=" bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={registerForm.email}
                                            onChange={handleRegisterChange}
                                            className=" bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showRegisterPassword ? "text" : "password"}
                                                placeholder="Password"
                                                value={registerForm.password}
                                                onChange={handleRegisterChange}
                                                className=" bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowRegisterPassword(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                            >
                                                {showRegisterPassword ? <EyeOff size={18} className="text-gray-400 dark:text-gray-500" /> : <Eye size={18} className="text-gray-400 dark:text-gray-500" />}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showRegisterConfirm ? "text" : "password"}
                                                placeholder="Re-enter Password"
                                                value={registerForm.confirmPassword}
                                                onChange={handleRegisterChange}
                                                className="bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowRegisterConfirm(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                            >
                                                {showRegisterConfirm ? <EyeOff size={18} className="text-gray-400 dark:text-gray-500" /> : <Eye size={18} className="text-gray-400 dark:text-gray-500" />}
                                            </button>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-2 bg-[#3887F6] hover:bg-[#2563eb] text-white text-lg font-semibold rounded-full py-4 px-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Registering..." : "Register"}
                                    </Button>
                                </form>
                                <div className="mt-2 text-center">
                                    <Link href="/" className="text-[#3887F6] hover:text-[#3AC7A7] hover:underline transition-colors cursor-pointer">Go back</Link>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </Suspense>
    );
} 