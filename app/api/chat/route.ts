import { groq } from "@/lib/groq"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import { logInference } from "@/lib/logger"

export async function POST(req: Request) {
    const requestId = uuidv4()

    let conversationId = "unknown"

    try {
        const body = await req.json()

        const { message, conversationId: incomingConversationId } = body

        conversationId = incomingConversationId

        const startTime = Date.now()

        let conversation

        // Create new conversation
        if (!incomingConversationId) {
            conversation = await prisma.conversation.create({
                data: {
                    title: message.slice(0, 40),
                },
            })

            conversationId = conversation.id
        } else {
            conversation = await prisma.conversation.findUnique({
                where: {
                    id: incomingConversationId,
                },
            })
        }

        if (!conversation) {
            return new Response("Conversation not found", {
                status: 404,
            })
        }

        // Save user message
        await prisma.message.create({
            data: {
                role: "user",
                content: message,
                conversationId: conversation.id,
            },
        })

        // Fetch previous messages
        const previousMessages = await prisma.message.findMany({
            where: {
                conversationId: conversation.id,
            },
            orderBy: {
                createdAt: "asc",
            },
        })

        // Format messages for Groq
        const formattedMessages = previousMessages.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
        }))

        // Streaming completion
        const stream = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: formattedMessages,
            stream: true,
        })

        let fullResponse = ""

        const encoder = new TextEncoder()

        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content =
                            chunk.choices[0]?.delta?.content || ""

                        fullResponse += content

                        controller.enqueue(
                            encoder.encode(content)
                        )
                    }

                    // Save assistant message
                    await prisma.message.create({
                        data: {
                            role: "assistant",
                            content: fullResponse,
                            conversationId: conversation.id,
                        },
                    })

                    // Calculate latency
                    const latencyMs = Date.now() - startTime

                    // Log successful inference
                    await logInference({
                        requestId,

                        provider: "groq",

                        model: "llama-3.3-70b-versatile",

                        latencyMs,

                        promptTokens:
                            previousMessages.length,

                        completionTokens:
                            fullResponse.length,

                        totalTokens:
                            previousMessages.length +
                            fullResponse.length,

                        status: "success",

                        inputPreview:
                            message.slice(0, 100),

                        outputPreview:
                            fullResponse.slice(0, 100),

                        conversationId: conversation.id,
                    })

                    controller.close()
                } catch (streamError) {
                    console.error(streamError)

                    controller.error(streamError)
                }
            },
        })

        return new Response(readableStream, {
            headers: {
                "Content-Type":
                    "text/plain; charset=utf-8",

                "x-conversation-id":
                    conversation.id,
            },
        })
    } catch (error) {
        console.error(error)

        // Log failed inference
        await logInference({
            requestId,

            provider: "groq",

            model: "llama-3.3-70b-versatile",

            latencyMs: 0,

            status: "error",

            errorMessage:
                error instanceof Error
                    ? error.message
                    : "Unknown error",

            conversationId,
        })

        return new Response("Something went wrong", {
            status: 500,
        })
    }
}