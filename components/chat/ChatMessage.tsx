import { User, Sparkles } from "lucide-react"

type Props = {
    role: string
    content: string
}

export default function ChatMessage({
    role,
    content,
}: Props) {
    const isUser = role === "user"

    return (
        <div
            className={`flex items-start gap-3 w-full mb-6 ${
                isUser ? "justify-end" : "justify-start"
            }`}
        >
            {/* Assistant Avatar */}
            {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
                    <Sparkles className="h-4 w-4" />
                </div>
            )}

            {/* Bubble Container */}
            <div className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                {/* Bubble Text Block */}
                <div
                    className={`px-4 py-3 text-sm leading-relaxed border shadow-sm ${
                        isUser
                            ? "bg-gradient-to-br from-violet-600 to-indigo-600 border-violet-500/30 text-white rounded-2xl rounded-tr-sm"
                            : "bg-zinc-900/45 border-zinc-800/40 text-zinc-100 rounded-2xl rounded-tl-sm backdrop-blur-sm"
                    }`}
                >
                    {content ? (
                        <p className="whitespace-pre-wrap">{content}</p>
                    ) : (
                        /* Streaming Typing Dot animation placeholder if blank */
                        <div className="flex items-center gap-1 py-1 px-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 typing-dot"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 typing-dot"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 typing-dot"></span>
                        </div>
                    )}
                </div>
            </div>

            {/* User Avatar */}
            {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700/60 text-zinc-400">
                    <User className="h-4 w-4" />
                </div>
            )}
        </div>
    )
}