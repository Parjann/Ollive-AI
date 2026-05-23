"use client"

import { Plus, MessageSquare, Compass, Sparkles } from "lucide-react"

type Conversation = {
    id: string
    title: string
}

type Props = {
    conversations: Conversation[]
    activeId?: string
    onSelect: (id: string) => void
    onNewChat: () => void
}

export default function ConversationSidebar({
    conversations,
    activeId,
    onSelect,
    onNewChat,
}: Props) {
    return (
        <aside className="w-80 border-r border-zinc-900 bg-zinc-950 flex flex-col h-screen shrink-0">
            {/* Sidebar Title / Logo Header */}
            <div className="p-5 border-b border-zinc-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-violet-500" />
                    <span className="text-sm font-bold text-zinc-200 tracking-wide uppercase">
                        History
                    </span>
                </div>
                <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium px-2 py-0.5 rounded-full">
                    {conversations.length} sessions
                </span>
            </div>

            {/* Actions: New Chat Button */}
            <div className="p-4">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-600 hover:to-indigo-600 text-white py-3 px-4 text-xs font-bold tracking-wide transition-all duration-200 shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-98"
                >
                    <Plus className="h-4 w-4" />
                    New Chat
                </button>
            </div>

            {/* Scrollable Conversation List */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 select-none">
                {conversations.length === 0 ? (
                    <div className="text-center py-8 px-4 text-zinc-600 text-xs">
                        No previous chats found.
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        const isActive = conversation.id === activeId
                        return (
                            <button
                                key={conversation.id}
                                onClick={() => onSelect(conversation.id)}
                                className={`w-full group flex items-start gap-3 rounded-xl p-3 text-left text-xs font-medium transition-all duration-200 border ${
                                    isActive
                                        ? "bg-gradient-to-r from-violet-950/20 to-indigo-950/20 border-violet-500/30 text-white font-semibold shadow-sm"
                                        : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                                }`}
                            >
                                <MessageSquare className={`h-4 w-4 shrink-0 mt-0.5 transition-colors duration-200 ${
                                    isActive ? "text-violet-400" : "text-zinc-600 group-hover:text-zinc-400"
                                }`} />
                                <span className="line-clamp-2 leading-relaxed break-all">
                                    {conversation.title || "Untitled chat"}
                                </span>
                            </button>
                        )
                    })
                )}
            </div>
        </aside>
    )
}