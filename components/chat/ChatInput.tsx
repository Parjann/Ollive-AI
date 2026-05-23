type Props = {
    input: string
    setInput: (value: string) => void
    onSend: () => void
    onCancel: () => void
    isStreaming: boolean
}

export default function ChatInput({
    input,
    setInput,
    onSend,
    onCancel,
    isStreaming,
}: Props) {
    return (
        <div className="flex flex-col gap-4">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                className="border rounded-lg p-4"
            />

            <div className="flex gap-4">
                <button
                    onClick={onSend}
                    disabled={isStreaming}
                    className="bg-black text-white rounded-lg px-6 py-3 disabled:opacity-50"
                >
                    Send
                </button>

                {isStreaming && (
                    <button
                        onClick={onCancel}
                        className="bg-red-500 text-white rounded-lg px-6 py-3"
                    >
                        Stop
                    </button>
                )}
            </div>
        </div>
    )
}