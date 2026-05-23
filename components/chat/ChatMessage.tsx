type Props = {
    role: string
    content: string
}

export default function ChatMessage({
    role,
    content,
}: Props) {
    return (
        <div
            className={`mb-4 ${role === "user"
                ? "text-right"
                : "text-left"
                }`}
        >
            <div className="inline-block border rounded-lg px-4 py-2">
                {content}
            </div>
        </div>
    )
}