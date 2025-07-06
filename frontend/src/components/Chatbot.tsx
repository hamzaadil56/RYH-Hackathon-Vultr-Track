"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, Sparkles } from "lucide-react";
import Image from "next/image";

interface Message {
	id: string;
	text: string;
	sender: "user" | "bot";
	timestamp: Date;
	isStreaming?: boolean;
}

interface ChatbotProps {
	agentName: string;
	agentDescription: string;
	onSendMessage?: (message: string) => Promise<string>;
}

interface StreamResponse {
	type: "text_delta" | "message_complete" | "complete";
	content: string;
	message?: string;
}

export default function Chatbot({
	agentName,
	agentDescription,
	onSendMessage,
}: ChatbotProps) {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			text: `Hello! I'm your ${agentName}. ${agentDescription}`,
			sender: "bot",
			timestamp: new Date(),
		},
	]);
	const [inputMessage, setInputMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	const handleStreamingResponse = async (userInput: string) => {
		const botMessageId = (Date.now() + 1).toString();

		// Add initial bot message for streaming
		const initialBotMessage: Message = {
			id: botMessageId,
			text: "",
			sender: "bot",
			timestamp: new Date(),
			isStreaming: true,
		};

		setMessages((prev) => [...prev, initialBotMessage]);

		console.log(localStorage.getItem("authToken"), "auth token");

		try {
			// Create abort controller for cancellation
			abortControllerRef.current = new AbortController();

			const response = await fetch(
				"http://localhost:8000/jobs/create-job-posting/stream",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"authToken"
						)}`,
					},
					body: JSON.stringify({ user_prompt: userInput }),
					signal: abortControllerRef.current.signal,
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			let accumulatedText = "";

			if (reader) {
				while (true) {
					const { done, value } = await reader.read();

					if (done) break;

					const chunk = decoder.decode(value, { stream: true });
					const lines = chunk.split("\n");

					for (const line of lines) {
						if (line.startsWith("data: ")) {
							try {
								const jsonStr = line.slice(6); // Remove 'data: ' prefix
								const data: StreamResponse =
									JSON.parse(jsonStr);

								if (data.type === "text_delta") {
									accumulatedText += data.content;

									// Update the streaming message
									setMessages((prev) =>
										prev.map((msg) =>
											msg.id === botMessageId
												? {
														...msg,
														text: accumulatedText,
												  }
												: msg
										)
									);
								} else if (data.type === "message_complete") {
									// Final message content
									setMessages((prev) =>
										prev.map((msg) =>
											msg.id === botMessageId
												? {
														...msg,
														text: data.content,
														isStreaming: false,
												  }
												: msg
										)
									);
								} else if (data.type === "complete") {
									// Stream is complete
									setMessages((prev) =>
										prev.map((msg) =>
											msg.id === botMessageId
												? { ...msg, isStreaming: false }
												: msg
										)
									);
									return;
								}
							} catch (parseError) {
								console.error(
									"Error parsing SSE data:",
									parseError
								);
							}
						}
					}
				}
			}

			setIsLoading(false);
		} catch (error) {
			setMessages((prev) => [
				...prev,
				{
					id: (Date.now() + 2).toString(),
					text: "Sorry, I encountered an error. Please try again.",
					sender: "bot",
					timestamp: new Date(),
				},
			]);
			setIsLoading(false);
		}
	};

	const handleSendMessage = async () => {
		if (!inputMessage.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			text: inputMessage,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputMessage("");
		setIsLoading(true);

		// Use streaming handler
		await handleStreamingResponse(userMessage.text);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col backdrop-blur-sm bg-white/95 dark:bg-[#0F172A]/95 border border-[#3887F6]/20 dark:border-[#3887F6]/30 rounded-2xl shadow-2xl">
			<div className="p-6 flex flex-col h-full">
				{/* Header */}
				<div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#3887F6]/20 dark:border-[#3887F6]/30">
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
						<h3 className="font-semibold text-lg text-[#5A6A7A] dark:text-[#94A3B8] flex items-center gap-2">
							{agentName}
						</h3>
						<p className="text-sm text-[#5A6A7A]/70 dark:text-[#94A3B8]/70">
							{agentDescription}
						</p>
					</div>
				</div>

				{/* Messages with Custom Scrollbar */}
				<div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${
								message.sender === "user"
									? "justify-end"
									: "justify-start"
							}`}
						>
							<div
								className={`max-w-[70%] rounded-lg p-3 backdrop-blur-sm ${
									message.sender === "user"
										? "bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] text-white border border-[#3887F6]/30"
										: "bg-[#F4F8FB] dark:bg-[#1E293B] text-[#5A6A7A] dark:text-[#E2E8F0] border border-[#3887F6]/20 dark:border-[#3887F6]/30"
								}`}
							>
								<div className="flex items-start gap-2">
									{message.sender === "bot" && (
										<div className="w-8 h-8 bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] rounded-full flex items-center justify-center flex-shrink-0">
											<Bot className="w-4 h-4 text-white" />
										</div>
									)}
									{message.sender === "user" && (
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
											<User className="w-4 h-4 text-white" />
										</div>
									)}
									<p className="text-sm leading-relaxed">
										{message.text}
									</p>
								</div>
								<div className="text-xs opacity-60 mt-1 text-right">
									{message.timestamp.toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
							</div>
						</div>
					))}
					{isLoading && (
						<div className="flex justify-start">
							<div className="bg-[#F4F8FB] dark:bg-[#1E293B] rounded-lg p-3 border border-[#3887F6]/20 dark:border-[#3887F6]/30 backdrop-blur-sm">
								<div className="flex items-center gap-2">
									<div className="w-8 h-8 bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] rounded-full flex items-center justify-center">
										<Bot className="w-4 h-4 text-white" />
									</div>
									<div className="flex space-x-1">
										<div className="w-2 h-2 bg-[#3887F6] rounded-full animate-bounce"></div>
										<div
											className="w-2 h-2 bg-[#3887F6] rounded-full animate-bounce"
											style={{ animationDelay: "0.1s" }}
										></div>
										<div
											className="w-2 h-2 bg-[#3887F6] rounded-full animate-bounce"
											style={{ animationDelay: "0.2s" }}
										></div>
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
						className="flex-1 bg-white dark:bg-[#1E293B] border-[#3887F6]/20 dark:border-[#3887F6]/30 text-[#5A6A7A] dark:text-[#E2E8F0] placeholder:text-[#5A6A7A]/50 dark:placeholder:text-[#94A3B8]/50 focus:border-[#3887F6] focus:ring-[#3887F6]/20 dark:focus:ring-[#3887F6]/20"
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
