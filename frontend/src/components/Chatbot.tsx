'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, Sparkles } from "lucide-react";
import Image from 'next/image';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatbotProps {
    agentName: string;
    agentDescription: string;
    onSendMessage: (message: string) => Promise<string>;
}

export default function Chatbot({ agentName, agentDescription, onSendMessage }: ChatbotProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hello! I'm your ${agentName}. ${agentDescription}`,
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const botResponse = await onSendMessage(inputMessage);
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I encountered an error. Please try again.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col backdrop-blur-sm bg-white/95 border border-[#3887F6]/20 rounded-2xl shadow-2xl">
            <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#3887F6]/20">
                    <div className="relative">
                        <Image
                            src="/assets/Logo.png"
                            alt="Company Logo"
                            width={48}
                            height={48}
                            className="object-contain w-10 h-10"
                            priority
                        />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#3AC7A7] rounded-full border border-white animate-pulse"></div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-[#5A6A7A] flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[#3887F6]" />
                            {agentName}
                        </h3>
                        <p className="text-sm text-[#5A6A7A]/70">{agentDescription}</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg p-3 backdrop-blur-sm ${message.sender === 'user'
                                        ? 'bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] text-white border border-[#3887F6]/30'
                                        : 'bg-[#F4F8FB] text-[#5A6A7A] border border-[#3887F6]/20'
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    {message.sender === 'bot' && (
                                        <div className="w-8 h-8 bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] rounded-full flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    {message.sender === 'user' && (
                                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <p className="text-sm leading-relaxed">{message.text}</p>
                                </div>
                                <div className="text-xs opacity-60 mt-1 text-right">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[#F4F8FB] rounded-lg p-3 border border-[#3887F6]/20 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] rounded-full flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-[#3887F6] rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-[#3887F6] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-[#3887F6] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 bg-white border-[#3887F6]/20 text-[#5A6A7A] placeholder:text-[#5A6A7A]/50 focus:border-[#3887F6] focus:ring-[#3887F6]/20"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        className="bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] hover:from-[#2563eb] hover:to-[#2F80ED] text-white border-0 shadow-lg"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
} 