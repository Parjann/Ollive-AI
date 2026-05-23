"use client"

type Conversation = {
    id: string
    title: string
}

type Props = {
    conversations: Conversation[]
    onSelect: (id: string) => void
}

export default function ConversationSidebar({
    conversations,
    onSelect,
}: Props) {
    return (
        <div className="w-80 border-r h-screen p-4">
            <h2 className="text-2xl font-bold mb-4">
                Conversations
            </h2>

            <div className="flex flex-col gap-2">
                {conversations.map((conversation) => (
                    <button
                        key={conversation.id}
                        onClick={() => onSelect(conversation.id)}
                        className="border rounded-lg p-3 text-left hover:bg-gray-100"
                    >
                        {conversation.title}
                    </button>
                ))}
            </div>
        </div>
    )
}