"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, ArrowLeft } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

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
}: ChatbotProps) {
	const router = useRouter();
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

	const handleBackToAgents = () => {
		router.push("/agents");
	};

	const handleStreamingResponse = async (userInput: string) => {
		const botMessageId = (Date.now() + 1).toString();
		const initialBotMessage: Message = {
			id: botMessageId,
			text: "",
			sender: "bot",
			timestamp: new Date(),
			isStreaming: true,
		};

		setMessages((prev) => [...prev, initialBotMessage]);
		try {
			abortControllerRef.current = new AbortController();

			const response = await fetch(
				"http://45.63.114.116/jobs/create-job-posting/stream",
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
								const jsonStr = line.slice(6);
								const data: StreamResponse =
									JSON.parse(jsonStr);

								if (data.type === "text_delta") {
									accumulatedText += data.content;

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
									setMessages((prev) =>
										prev.map((msg) =>
											msg.id === botMessageId
												? { ...msg, isStreaming: false }
												: msg
										)
									);
									setIsLoading(false);
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

			// setIsLoading(false); // Removed - only set to false when streaming is complete
		} catch (error) {
			// Remove any streaming messages and add error message
			setMessages((prev) => {
				const filteredMessages = prev.filter(msg => !msg.isStreaming);
				return [...filteredMessages, {
					id: (Date.now() + 2).toString(),
					text: "Sorry, I encountered an error. Please try again.",
					sender: "bot",
					timestamp: new Date(),
				}];
			});
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
			<style jsx>{`
				@keyframes typing {
					0%, 100% { opacity: 1; }
					50% { opacity: 0; }
				}
				.typing-dot {
					animation: typing 1.4s infinite ease-in-out;
				}
				.typing-dot:nth-child(1) { animation-delay: 0s; }
				.typing-dot:nth-child(2) { animation-delay: 0.2s; }
				.typing-dot:nth-child(3) { animation-delay: 0.4s; }
				.typing-dot:nth-child(4) { animation-delay: 0.6s; }
			`}</style>
			<div className="p-6 flex flex-col h-full">
				{/* Header */}
				<div className="flex items-center justify-between mb-4 pb-4 border-b border-[#3887F6]/20 dark:border-[#3887F6]/30">
					<div className="flex items-center gap-3">
						<Button
							onClick={handleBackToAgents}
							variant="ghost"
							size="sm"
							className="p-2 hover:bg-[#3887F6]/10 text-[#5A6A7A] dark:text-[#94A3B8] hover:text-[#3887F6]"
						>
							<ArrowLeft className="w-4 h-4" />
						</Button>
						<div>
							<h3 className="font-semibold text-lg text-[#5A6A7A] dark:text-[#94A3B8] flex items-center gap-2">
								{agentName}
							</h3>
							<p className="text-sm text-[#5A6A7A]/70 dark:text-[#94A3B8]/70">
								{agentDescription}
							</p>
						</div>
					</div>
				</div>

				{/* Messages with Custom Scrollbar */}
				<div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${message.sender === "user"
								? "justify-end"
								: "justify-start"
								}`}
						>
							<div
								className={`max-w-[70%] rounded-lg p-3 backdrop-blur-sm ${message.sender === "user"
									? "bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] text-white border border-[#3887F6]/30"
									: "bg-[#F4F8FB] dark:bg-[#1E293B] text-[#5A6A7A] dark:text-[#E2E8F0] border border-[#3887F6]/20 dark:border-[#3887F6]/30"
									}`}
							>
								<div className="flex items-start gap-2">
									{message.sender === "bot" && (
										<div className="w-8 h-8 bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] rounded-full flex items-center justify-center flex-shrink-0">
											<Image
												src="/assets/Logo.png"
												alt="Company Logo"
												width={48}
												height={48}
												className="object-contain w-10 h-10"
												priority
											/>
										</div>
									)}
									{message.sender === "user" && (
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
											<User className="w-4 h-4 text-white" />
										</div>
									)}
									{message.sender === "bot" ? (
										<div className="text-sm leading-relaxed">
											{(() => {
												try {
													const arr = JSON.parse(message.text);
													if (Array.isArray(arr) && arr.every(q => typeof q === 'string')) {
														return <ReactMarkdown>{arr.map(q => `- ${q}`).join('\n')}</ReactMarkdown>;
													}
												} catch (e) { }
												return <ReactMarkdown
													components={{
														strong: ({ node, ...props }) => <strong className="font-bold text-black dark:text-white" {...props} />,
														em: ({ node, ...props }) => <em className="italic" {...props} />,
														code: ({ node, ...props }) => <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
														pre: ({ node, ...props }) => <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto my-2" {...props} />,
														ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2" {...props} />,
														ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-2" {...props} />,
														li: ({ node, ...props }) => <li className="ml-4" {...props} />,
														p: ({ node, ...props }) => <p className="mb-2" {...props} />,
														h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 text-black dark:text-white" {...props} />,
														h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 text-black dark:text-white" {...props} />,
														h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2 text-black dark:text-white" {...props} />,
														blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[#3887F6] pl-4 italic my-2" {...props} />,
													}}
												>
													{message.text}
												</ReactMarkdown>;
											})()}
											{message.isStreaming && (
												<span className="inline-block w-0.5 h-5 bg-[#3887F6] ml-1 animate-pulse" style={{ animationDuration: '1s' }}></span>
											)}
										</div>
									) : (
										<p className="text-sm leading-relaxed">
											{message.text}
										</p>
									)}
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
					{isLoading && !messages.some(msg => msg.isStreaming) && (
						<div className="flex justify-start">
							<div className="bg-[#F4F8FB] dark:bg-[#1E293B] rounded-lg p-3 border border-[#3887F6]/20 dark:border-[#3887F6]/30 backdrop-blur-sm">
								<div className="flex items-center gap-2">
									<div className="w-8 h-8 bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] rounded-full flex items-center justify-center">
										<Image
											src="/assets/Logo.png"
											alt="Company Logo"
											width={48}
											height={48}
											className="object-contain w-10 h-10"
											priority
										/>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-[#3887F6] rounded-full typing-dot"></div>
										<div className="w-2 h-2 bg-[#3887F6] rounded-full typing-dot"></div>
										<div className="w-2 h-2 bg-[#3887F6] rounded-full typing-dot"></div>
										<div className="w-2 h-2 bg-[#3887F6] rounded-full typing-dot"></div>
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
