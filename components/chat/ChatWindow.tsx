import ChatMessage from "./ChatMessage"

type Message = {
    role: string
    content: string
}

type Props = {
    messages: Message[]
}

export default function ChatWindow({
    messages,
}: Props) {
    return (
        <div className="border rounded-lg p-4 h-[500px] overflow-y-auto">
            {messages.map((msg, index) => (
                <ChatMessage
                    key={index}
                    role={msg.role}
                    content={msg.content}
                />
            ))}
        </div>
    )
}