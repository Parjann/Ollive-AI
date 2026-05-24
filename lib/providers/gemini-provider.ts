import { GoogleGenerativeAI } from "@google/generative-ai"

import {
    ChatMessage,
    LLMProvider,
} from "./types"

let genAIInstance: GoogleGenerativeAI | null = null

const genAI = new Proxy({} as GoogleGenerativeAI, {
    get(target, prop, receiver) {
        if (!genAIInstance) {
            genAIInstance = new GoogleGenerativeAI(
                process.env.GEMINI_API_KEY!
            )
        }
        return Reflect.get(genAIInstance, prop, receiver)
    }
})

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