'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Chatbot from '@/components/Chatbot'
import TechBackground from '@/components/TechBackground'
import {  Sparkles } from "lucide-react"
import Image from 'next/image'

interface AgentConfig {
    name: string;
    description: string;
    endpoint: string;
    color: string;
    icon: string;
}

const agentConfigs: Record<string, AgentConfig> = {
    'job-creator': {
        name: 'Job Creator Agent',
        description: 'I help you create compelling job descriptions based on your company requirements. Tell me about the position, skills needed, and company culture.',
        endpoint: '/api/agents/job-creator',
        color: 'from-blue-500 to-cyan-500',
        icon: '💼'
    },
    'resume-screener': {
        name: 'Resume Screener Agent',
        description: 'I analyze resumes and screen candidates based on job requirements. Upload resumes or paste candidate information for evaluation.',
        endpoint: '/api/agents/resume-screener',
        color: 'from-green-500 to-emerald-500',
        icon: '📄'
    },
    'interview': {
        name: 'Interview Agent',
        description: 'I conduct automated interviews with candidates. I can ask relevant questions and evaluate responses in real-time.',
        endpoint: '/api/agents/interview',
        color: 'from-purple-500 to-pink-500',
        icon: '🎤'
    },
    'score-analyzer': {
        name: 'Score Analyzer Agent',
        description: 'I analyze interview scores and rank candidates based on their performance. I help you identify the top candidates.',
        endpoint: '/api/agents/score-analyzer',
        color: 'from-orange-500 to-red-500',
        icon: '📊'
    },
    'offer-generator': {
        name: 'Offer Generator Agent',
        description: 'I generate professional offer letters for selected candidates with appropriate compensation and benefits.',
        endpoint: '/api/agents/offer-generator',
        color: 'from-indigo-500 to-blue-500',
        icon: '📝'
    }
}

export default function AgentPage() {
    const params = useParams()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    const agentId = params.agent as string
    const config = agentConfigs[agentId]

    useEffect(() => {
        if (!config) {
            router.push('/agents')
            return
        }
        setIsLoading(false)
    }, [config, router])

    const handleSendMessage = async (message: string): Promise<string> => {
        try {
            // For now, return a mock response
            // Replace this with actual API call to your backend
            const mockResponses: Record<string, string[]> = {
                'job-creator': [
                    "I'll help you create a job description. What's the position title and what are the key responsibilities?",
                    "Based on your requirements, here's a draft job description...",
                    "Would you like me to adjust any specific sections of the job description?"
                ],
                'resume-screener': [
                    "I'll analyze the resume for you. Please provide the candidate's information.",
                    "Based on my analysis, this candidate has a 85% match with your requirements.",
                    "The candidate shows strong technical skills but may need more experience in leadership."
                ],
                'interview': [
                    "I'm ready to conduct the interview. Let's start with some technical questions.",
                    "Great answer! Now let me ask about your experience with team collaboration.",
                    "Thank you for your responses. I'll evaluate your interview performance."
                ],
                'score-analyzer': [
                    "I'll analyze the interview scores for all candidates.",
                    "Based on the analysis, Candidate A scored highest with 92%.",
                    "Here's a detailed breakdown of each candidate's performance."
                ],
                'offer-generator': [
                    "I'll help you generate an offer letter. What's the candidate's name and position?",
                    "Here's a draft offer letter with competitive compensation.",
                    "Would you like me to adjust the benefits package or salary range?"
                ]
            }

            const responses = mockResponses[agentId] || ["I'm processing your request..."]
            const randomResponse = responses[Math.floor(Math.random() * responses.length)]

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            return randomResponse
        } catch (error) {
            console.error('Error sending message:', error)
            return "I'm sorry, I encountered an error. Please try again."
        }
    }

    if (isLoading) {
        return (
            <TechBackground>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Image
                                src="/assets/Logo.png"
                                alt="Company Logo"
                                width={48}
                                height={48}
                                className="object-contain w-12 h-12"
                                priority
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 animate-pulse text-[#3887F6]" />
                            <p className="text-lg text-[#5A6A7A] dark:text-[#94A3B8]">Loading AI Agent...</p>
                        </div>
                    </div>
                </div>
            </TechBackground>
        )
    }

    if (!config) {
        return null
    }

    return (
        <TechBackground>
            {/* Main Content */}
            <main className="flex flex-1 flex-col items-center justify-center z-10 relative px-4 py-8">
                <div className="w-full max-w-6xl">
                    <Chatbot
                        agentName={config.name}
                        agentDescription={config.description}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            </main>
        </TechBackground>
    )
} 