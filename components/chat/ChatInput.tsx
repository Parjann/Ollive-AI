import { SendHorizontal, Square } from "lucide-react"
import React from "react"

type Props = {
    input: string
    setInput: (value: string) => void
    onSend: () => void
    onCancel: () => void
    isStreaming: boolean

    // Provider Selector states
    provider: string
    model: string
    setProvider: (provider: string) => void
    setModel: (model: string) => void
}

export default function ChatInput({
    input,
    setInput,
    onSend,
    onCancel,
    isStreaming,
    provider,
    model,
    setProvider,
    setModel,
}: Props) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onSend()
        }
    }

    function handleProviderChange(value: string) {
        setProvider(value)

        // Set default model
        if (value === "groq") {
            setModel("llama-3.3-70b-versatile")
        }

        if (value === "gemini") {
            setModel("gemini-2.5-flash")
        }
    }

    return (
        <div className="max-w-3xl w-full mx-auto pb-6 px-4">
            <div className="flex flex-col gap-2 border border-zinc-800/60 bg-zinc-900/30 rounded-2xl p-2.5 focus-within:border-violet-500/40 focus-within:ring-1 focus-within:ring-violet-500/20 backdrop-blur-md transition-all duration-300">
                {/* Text Area Input */}
                <textarea
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask something..."
                    className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none min-h-[48px] py-1 px-3 leading-relaxed"
                />

                {/* Bottom Row Controls */}
                <div className="flex items-center justify-between border-t border-zinc-800/40 pt-2 px-2">
                    {/* Left: Model & Provider Selects */}
                    <div className="flex items-center gap-2">
                        {/* Provider Select */}
                        <select
                            value={provider}
                            onChange={(e) => handleProviderChange(e.target.value)}
                            className="bg-zinc-800/40 hover:bg-zinc-800/80 border border-zinc-800/50 text-[11px] font-semibold text-zinc-300 rounded-xl px-3 py-1.5 cursor-pointer focus:outline-none transition-all duration-200"
                        >
                            <option value="groq">Groq</option>
                            <option value="gemini">Gemini</option>
                        </select>

                        {/* Model Select */}
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="bg-zinc-800/40 hover:bg-zinc-800/80 border border-zinc-800/50 text-[11px] font-semibold text-zinc-300 rounded-xl px-3 py-1.5 cursor-pointer focus:outline-none transition-all duration-200"
                        >
                            {provider === "groq" && (
                                <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
                            )}

                            {provider === "gemini" && (
                                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            )}
                        </select>
                    </div>

                    {/* Right: Sent/Stop Action Button */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {isStreaming ? (
                            <button
                                onClick={onCancel}
                                title="Stop generation"
                                className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
                            >
                                <Square className="h-3.5 w-3.5 fill-current" />
                            </button>
                        ) : (
                            <button
                                onClick={onSend}
                                disabled={!input.trim()}
                                title="Send message"
                                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-40 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 transition-all duration-200 shadow-md shadow-violet-500/10 hover:shadow-violet-500/25 active:scale-95"
                            >
                                <SendHorizontal className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <p className="text-[10px] text-zinc-500 text-center mt-2 tracking-wide font-medium">
                Ollive AI monitors prompts, model status, and latency metrics dynamically.
            </p>
        </div>
    )
}