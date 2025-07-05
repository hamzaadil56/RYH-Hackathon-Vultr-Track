'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const [tab, setTab] = useState("signup");

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'login') {
            setTab('login');
        }
    }, [searchParams]);
    return (
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
                    <Tabs value={tab} className="w-full mb-6" onValueChange={setTab}>
                        <TabsList className="w-full flex bg-[#E6F0FA] dark:bg-[#334155] rounded-lg p-1 h-12">

                            <TabsTrigger value="login" className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3887F6] data-[state=active]:to-[#3AC7A7] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#3887F6] dark:data-[state=inactive]:text-[#94A3B8] px-6 py-3 text-base font-medium transition-all duration-200 cursor-pointer">Login</TabsTrigger>
                            <TabsTrigger value="signup" className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3887F6] data-[state=active]:to-[#3AC7A7] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#3887F6] dark:data-[state=inactive]:text-[#94A3B8] px-6 py-3 text-base font-medium transition-all duration-200 cursor-pointer">Sign up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <form className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                                    <Label htmlFor="login-email" className="sr-only">Email Address</Label>
                                    <Input id="login-email" type="email" placeholder="Enter your email address" className="pl-10 bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500" />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                                    <Label htmlFor="login-password" className="sr-only">Password</Label>
                                    <Input id="login-password" type="password" placeholder="Enter your password" className="pl-10 bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500" />
                                </div>
                                <Button type="submit" className="w-full mt-2 bg-[#3887F6] hover:bg-[#2563eb] text-white text-lg font-semibold rounded-full py-4 px-6 cursor-pointer">Login</Button>
                            </form>
                            <div className="mt-2 text-center">
                                <Link href="/" className="text-[#3887F6] hover:text-[#3AC7A7] hover:underline transition-colors cursor-pointer">Go back</Link>
                            </div>
                        </TabsContent>
                        <TabsContent value="signup">
                            <form className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                                    <Label htmlFor="email" className="sr-only">Email Address</Label>
                                    <Input id="email" type="email" placeholder="Enter valid email address" className="pl-10 bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500" />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                                    <Label htmlFor="password" className="sr-only">Enter Password</Label>
                                    <Input id="password" type="password" placeholder="Enter your password" className="pl-10 bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500" />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                                    <Label htmlFor="repassword" className="sr-only">Re-enter Password</Label>
                                    <Input id="repassword" type="password" placeholder="Re-enter your password" className="pl-10 bg-[#F4F8FB] dark:bg-[#334155] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3887F6] placeholder:text-gray-400 dark:placeholder:text-gray-500" />
                                </div>

                                <Button type="submit" className="w-full mt-2 bg-[#3887F6] hover:bg-[#2563eb] text-white text-lg font-semibold rounded-full py-4 px-6 cursor-pointer">Signup</Button>
                            </form>

                            <div className="mt-2 text-center">
                                <Link href="/" className="text-[#3887F6] hover:text-[#3AC7A7] hover:underline transition-colors cursor-pointer">Go back</Link>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
} 