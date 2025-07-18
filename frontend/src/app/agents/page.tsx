'use client'
import Link from "next/link";
import TechBackground from '@/components/TechBackground';
import {
    FileText,
    Users,
    MessageSquare,
    BarChart3,
    Mail,
    Bot,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const agents = [
    {
        id: 'job-creator',
        name: 'Job Creator Agent',
        description: 'Creates compelling job descriptions based on company requirements',
        icon: FileText,
        color: 'from-blue-500 to-cyan-500',
        href: '/agents/job-creator',
        emoji: '💼'
    },
    {
        id: 'resume-screener',
        name: 'Resume Screener Agent',
        description: 'Analyzes resumes and screens candidates based on job requirements',
        icon: Users,
        color: 'from-green-500 to-emerald-500',
        href: '/agents/resume-screener',
        emoji: '📄'
    },
    {
        id: 'interview',
        name: 'Interview Agent',
        description: 'Conducts automated interviews with candidates via text or audio',
        icon: MessageSquare,
        color: 'from-purple-500 to-pink-500',
        href: '/agents/interview',
        emoji: '🎤'
    },
    {
        id: 'score-analyzer',
        name: 'Score Analyzer Agent',
        description: 'Analyzes interview scores and ranks candidates',
        icon: BarChart3,
        color: 'from-orange-500 to-red-500',
        href: '/agents/score-analyzer',
        emoji: '📊'
    },
    {
        id: 'offer-generator',
        name: 'Offer Generator Agent',
        description: 'Generates and sends offer letters to top candidates',
        icon: Mail,
        color: 'from-indigo-500 to-blue-500',
        href: '/agents/offer-generator',
        emoji: '📝'
    }
];

export default function AgentsPage() {
    return (
        <ProtectedRoute>
            <TechBackground>
                {/* Main Content */}
                <main className="flex flex-1 flex-col items-center justify-center text-center z-10 relative px-4 py-8 sm:py-0">
                    <div className="max-w-6xl w-full">
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Sparkles className="w-8 h-8 text-[#3887F6]" />
                                <h1 className="text-4xl sm:text-5xl p-4 md:text-6xl font-extrabold bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] bg-clip-text text-transparent mb-4">
                                    Hired Mind AI Agent
                                </h1>
                                <Sparkles className="w-8 h-8 text-[#3887F6]" />
                            </div>
                            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-[#5A6A7A] dark:text-[#94A3B8] mb-8">
                                Our intelligent AI agents work together to streamline your entire hiring process, from job creation to candidate selection.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {agents.map((agent) => (
                                <Link key={agent.id} href={agent.href} className="block">
                                    <div className="agent-content p-6 hover:scale-105 transition-all duration-300 cursor-pointer group relative z-20">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 bg-gradient-to-r ${agent.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                <span className="text-2xl">{agent.emoji}</span>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-[#5A6A7A]/60 dark:text-[#94A3B8]/60 group-hover:text-[#3887F6] transition-colors duration-300" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#5A6A7A] dark:text-[#94A3B8] mb-2 group-hover:text-[#3887F6] transition-colors duration-300">
                                            {agent.name}
                                        </h3>
                                        <p className="text-[#5A6A7A]/70 dark:text-[#94A3B8]/70 text-sm leading-relaxed">
                                            {agent.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center">
                            <div className="agent-content p-8 max-w-4xl mx-auto">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <Bot className="w-8 h-8 text-[#3887F6]" />
                                    <h2 className="text-2xl font-bold text-[#5A6A7A] dark:text-[#94A3B8]">How It Works</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                            <span className="text-white font-bold">1</span>
                                        </div>
                                        <h3 className="font-semibold mb-2 text-[#5A6A7A] dark:text-[#94A3B8]">Create Job</h3>
                                        <p className="text-sm text-[#5A6A7A]/70 dark:text-[#94A3B8]/70">Use our Job Creator Agent to generate compelling job descriptions</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                            <span className="text-white font-bold">2</span>
                                        </div>
                                        <h3 className="font-semibold mb-2 text-[#5A6A7A] dark:text-[#94A3B8]">Screen & Interview</h3>
                                        <p className="text-sm text-[#5A6A7A]/70 dark:text-[#94A3B8]/70">AI agents screen resumes and conduct automated interviews</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                            <span className="text-white font-bold">3</span>
                                        </div>
                                        <h3 className="font-semibold mb-2 text-[#5A6A7A] dark:text-[#94A3B8]">Select & Offer</h3>
                                        <p className="text-sm text-[#5A6A7A]/70 dark:text-[#94A3B8]/70">Top candidates are selected and offer letters are generated</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </TechBackground>
        </ProtectedRoute>
    );
} 