import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import { getProvider } from "@/lib/providers"
import { redactPII } from "@/lib/pii"
import "@/lib/init-events"
import { eventBus } from "@/lib/events"
import { EVENTS } from "@/lib/event-types"

export async function POST(req: Request) {
    const requestId = uuidv4()

    let conversationId = "unknown"
    let provider = "groq"
    let model = "llama-3.3-70b-versatile"

    try {
        const body = await req.json()

        const {
            message,
            conversationId: incomingConversationId,
            provider: incomingProvider,
            model: incomingModel,
        } = body

        if (incomingProvider) {
            provider = incomingProvider
        }

        if (incomingModel) {
            model = incomingModel
        } else {
            model = provider === "gemini" ? "gemini-2.5-flash" : "llama-3.3-70b-versatile"
        }

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
            return new Response(
                "Conversation not found",
                {
                    status: 404,
                }
            )
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
        const previousMessages =
            await prisma.message.findMany({
                where: {
                    conversationId:
                        conversation.id,
                },
                orderBy: {
                    createdAt: "asc",
                },
            })

        // Format messages
        const formattedMessages =
            previousMessages.map((msg) => ({
                role: msg.role as
                    | "user"
                    | "assistant",
                content: msg.content,
            }))

        // Get provider dynamically
        const llmProvider =
            getProvider(provider)

        // Stream response
        const stream =
            await llmProvider.streamChat(
                formattedMessages,
                model
            )

        let fullResponse = ""

        const encoder = new TextEncoder()

        const readableStream =
            new ReadableStream({
                async start(controller) {
                    try {
                        for await (const chunk of stream as any) {
                            let content = ""

                            // Gemini streaming
                            if (provider === "gemini") {
                                try {
                                    content = chunk.text() || ""
                                } catch (e) {
                                    content = ""
                                }
                            }

                            // Groq streaming
                            else {
                                content =
                                    chunk.choices?.[0]
                                        ?.delta?.content || ""
                            }

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
                                conversationId:
                                    conversation.id,
                            },
                        })

                        // Calculate latency
                        const latencyMs =
                            Date.now() - startTime

                        // Emit successful inference event
                        eventBus.emit(
                            EVENTS.INFERENCE_COMPLETED,

                            {
                                requestId,

                                provider,

                                model,

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
                                    redactPII(
                                        message.slice(0, 100)
                                    ),

                                outputPreview:
                                    redactPII(
                                        fullResponse.slice(0, 100)
                                    ),

                                conversationId:
                                    conversation.id,
                            }
                        )

                        controller.close()
                    } catch (streamError) {
                        console.error(streamError)

                        controller.error(
                            streamError
                        )
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

        // Emit failed inference event
        if (conversationId && conversationId !== "unknown") {
            eventBus.emit(
                EVENTS.INFERENCE_FAILED,

                {
                    requestId,

                    provider,

                    model,

                    latencyMs: 0,

                    status: "error",

                    errorMessage:
                        redactPII(
                            error instanceof Error
                                ? error.message
                                : "Unknown error"
                        ),

                    conversationId,
                }
            )
        }

        return new Response(
            "Something went wrong",
            {
                status: 500,
            }
        )
    }
}