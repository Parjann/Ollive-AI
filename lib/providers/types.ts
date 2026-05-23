export type ChatMessage = {
    role: "user" | "assistant"
    content: string
}

export interface LLMProvider {
    streamChat(
        messages: ChatMessage[],
        model: string
    ): Promise<any>
}