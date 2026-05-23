import { GoogleGenerativeAI } from "@google/generative-ai"

import {
    ChatMessage,
    LLMProvider,
} from "./types"

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
)

export class GeminiProvider
    implements LLMProvider {
    async streamChat(
        messages: ChatMessage[],
        model: string
    ) {
        const geminiModel =
            genAI.getGenerativeModel({
                model,
            })

        const prompt = messages
            .map(
                (msg) =>
                    `${msg.role}: ${msg.content}`
            )
            .join("\n")

        const result =
            await geminiModel.generateContentStream(
                prompt
            )

        return result.stream
    }
}