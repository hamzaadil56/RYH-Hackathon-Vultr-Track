"use client";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
    const { isAuthenticated } = useAuth();
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
                    <UserAvatar />
                ) : (
                    <>
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