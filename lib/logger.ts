import { prisma } from "./prisma"

type LogPayload = {
    requestId: string
    provider: string
    model: string

    latencyMs: number

    promptTokens?: number
    completionTokens?: number
    totalTokens?: number

    status: string

    inputPreview?: string
    outputPreview?: string

    errorMessage?: string

    conversationId: string
}

export async function logInference(
    payload: LogPayload
) {
    try {
        await prisma.inferenceLog.create({
            data: payload,
        })
    } catch (error) {
        console.error("Logging failed:", error)
    }
}