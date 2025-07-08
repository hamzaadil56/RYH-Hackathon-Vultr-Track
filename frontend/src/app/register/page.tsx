'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login, register, loading } = useAuth();
    const { toast } = useToast();
    const [tab, setTab] = useState("signup");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form states
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });

    const [signupForm, setSignupForm] = useState({
        name: "",
        email: "",
        description: "",
        industry: "",
        size: "",
        website: "",
        password: "",
        confirmPassword: ""
    });

    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'login') {
            setTab('login');
        }
    }, [searchParams]);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSignupForm({
            ...signupForm,
            [e.target.name]: e.target.value
        });
        // Clear error if user changes name or email
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

        try {
            await login(loginForm.email, loginForm.password);
            toast({
                title: "Login Successful!",
                description: "Welcome back! You are now logged in.",
                variant: "success",
            });
            setTimeout(() => {
                router.push('/agents');
            }, 1000);
        } catch (error: any) {
            // If error is an object, show a generic message
            setError(typeof error?.message === 'string' ? error.message : 'Login failed. Please try again.');
        }
    };

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!signupForm.name) {
            setError("Name is required.");
            return;
        }
        if (!signupForm.email) {
            setError("Email is required.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!signupForm.password) {
            setError("Password is required.");
            return;
        }
        if (signupForm.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (signupForm.password !== signupForm.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!signupForm.description) {
            setError("Description is required.");
            return;
        }
        if (!signupForm.industry) {
            setError("Industry is required.");
            return;
        }
        if (!signupForm.size) {
            setError("Company size is required.");
            return;
        }
        if (!signupForm.website) {
            setError("Website is required.");
            return;
        }

        try {
            const { confirmPassword, ...registerData } = signupForm;
            const result = await register(registerData);
            setSuccess(result.message);
            setTimeout(() => {
                setTab('login');
                setSuccess("");
            }, 2000);
        } catch (error: any) {
            // Show backend error message if available
            const backendMsg = error?.response?.data?.detail || error?.message || 'Registration failed. Please try again.';
            setError(backendMsg);
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen flex items-center justify-center bg-[#F4F8FB] dark:bg-[#0F172A] relative overflow-hidden">
                {/* SVG Background */}

                <Card className="w-full max-w-md rounded-2xl shadow-2xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 p-0 relative z-10">
                    <CardContent className="p-8">
                        {/* Theme Toggle */}
                        <div className="flex justify-end mb-4">
                            <ThemeToggle />
                        </div>

                        <h2 className="text-3xl p-2 font-bold bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] bg-clip-text text-transparent text-center mb-2 flex items-center justify-center gap-2">
                            {tab === "login" ? "Login" : "Signup"}
                        </h2>
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                            {tab === "login"
                                ? "Please login with your email and password."
                                : "Please sign up with your details"}
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
                                <TabsTrigger value="signup" className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3887F6] data-[state=active]:to-[#3AC7A7] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#3887F6] dark:data-[state=inactive]:text-[#94A3B8] px-6 py-3 text-base font-medium transition-all duration-200 cursor-pointer">Sign up</TabsTrigger>
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
                                        disabled={loading}
                                        className="w-full mt-2 bg-[#3887F6] hover:bg-[#2563eb] text-white text-lg font-semibold rounded-full py-4 px-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Logging in..." : "Login"}
                                    </Button>
                                </form>
                                <div className="mt-2 text-center">
                                    <Link href="/" className="text-[#3887F6] hover:text-[#3AC7A7] hover:underline transition-colors cursor-pointer">Go back</Link>
                                </div>
                            </TabsContent>
                            <TabsContent value="signup">
                                <form className="space-y-6" onSubmit={handleSignupSubmit}>
                                    {/* Row 1: Name and Email */}
                                    <div className="relative">
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Enter your name"
                                            value={signupForm.name}
                                            onChange={handleSignupChange}
                                            className=" bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={signupForm.email}
                                            onChange={handleSignupChange}
                                            className=" bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                    </div>
                                    {/* Row 3: Industry and Size */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Input
                                                id="industry"
                                                name="industry"
                                                type="text"
                                                placeholder="Industry"
                                                value={signupForm.industry}
                                                onChange={handleSignupChange}
                                                className=" bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="size"
                                                name="size"
                                                type="text"
                                                placeholder="Company size"
                                                value={signupForm.size}
                                                onChange={handleSignupChange}
                                                className=" bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            />
                                        </div>
                                    </div>
                                    {/* Row 2: Password and Confirm Password */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showRegisterPassword ? "text" : "password"}
                                                placeholder="Password"
                                                value={signupForm.password}
                                                onChange={handleSignupChange}
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
                                                value={signupForm.confirmPassword}
                                                onChange={handleSignupChange}
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



                                    {/* Row 4: Website */}
                                    <div className="relative">
                                        <Input
                                            id="website"
                                            name="website"
                                            type="url"
                                            placeholder="Enter website URL"
                                            value={signupForm.website}
                                            onChange={handleSignupChange}
                                            className=" bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                    </div>

                                    {/* Row 5: Description (Textarea) */}
                                    <div className="relative">
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Enter company description"
                                            value={signupForm.description}
                                            onChange={handleSignupChange}
                                            rows={4}
                                            className="bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-2 bg-[#3887F6] hover:bg-[#2563eb] text-white text-lg font-semibold rounded-full py-4 px-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Creating account..." : "Signup"}
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