"use client"

import { useEffect, useRef } from "react"
import ChatMessage from "./ChatMessage"
import { Sparkles, Cpu, ShieldCheck, Zap } from "lucide-react"

type Message = {
    role: string
    content: string
}

type Props = {
    messages: Message[]
    isStreaming?: boolean
}

export default function ChatWindow({
    messages,
    isStreaming,
}: Props) {
    const bottomRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Auto scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isStreaming])

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto px-4 py-6 space-y-6 min-h-0 select-text"
        >
            {messages.length === 0 ? (
                /* Premium Dynamic Welcome Prompts Pane */
                <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center py-12 px-4">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/20 mb-6">
                        <Sparkles className="h-7 w-7" />
                        <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-zinc-950"></span>
                    </div>

                    <h2 className="text-2xl font-extrabold text-zinc-100 tracking-tight mb-2">
                        How can I help you build today?
                    </h2>
                    <p className="text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
                        Start a conversation with our LLM playground. All inference statistics, token metrics, and API latency are tracked in real-time.
                    </p>

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
                        <div className="border border-zinc-800/60 bg-zinc-900/20 rounded-2xl p-4 hover:border-violet-500/30 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <Cpu className="h-4 w-4 text-violet-400" />
                                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">
                                    Observability
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-400 leading-normal">
                                Visualizes token counts, errors, and end-to-end network latencies automatically.
                            </p>
                        </div>

                        <div className="border border-zinc-800/60 bg-zinc-900/20 rounded-2xl p-4 hover:border-violet-500/30 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-4 w-4 text-indigo-400" />
                                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">
                                    High Speed
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-400 leading-normal">
                                Leverages ultra-fast Llama models on Groq for sub-second responses.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* Conversational List */
                <div className="max-w-3xl mx-auto w-full">
                    {messages.map((msg, index) => (
                        <ChatMessage
                            key={index}
                            role={msg.role}
                            content={msg.content}
                        />
                    ))}

                    {/* Streaming / Typing indicators if active and last message is assistant loading */}
                    {isStreaming && messages[messages.length - 1]?.role === "user" && (
                        <ChatMessage role="assistant" content="" />
                    )}

                    <div ref={bottomRef} className="h-2" />
                </div>
            )}
        </div>
    )
}