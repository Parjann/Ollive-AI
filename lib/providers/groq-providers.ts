import { groq } from "@/lib/groq"

import {
    ChatMessage,
    LLMProvider,
} from "./types"

export class GroqProvider
    implements LLMProvider {
    async streamChat(
        messages: ChatMessage[],
        model: string
    ) {
        return groq.chat.completions.create({
            model,
            messages,
            stream: true,
        })
    }
}