import { GroqProvider } from "./groq-providers"
import { GeminiProvider } from "./gemini-provider"

export function getProvider(
    provider: string
) {
    switch (provider) {
        case "gemini":
            return new GeminiProvider()

        case "groq":
        default:
            return new GroqProvider()
    }
}