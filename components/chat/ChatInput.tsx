type Props = {
    input: string
    setInput: (value: string) => void
    onSend: () => void
}

export default function ChatInput({
    input,
    setInput,
    onSend,
}: Props) {
    return (
        <div className="flex flex-col gap-4">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                className="border rounded-lg p-4"
            />

            <button
                onClick={onSend}
                className="bg-black text-white rounded-lg px-6 py-3"
            >
                Send
            </button>
        </div>
    )
}