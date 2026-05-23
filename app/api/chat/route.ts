import { groq } from "@/lib/groq"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const { message, conversationId } = body

        let conversation

        if (!conversationId) {
            conversation = await prisma.conversation.create({
                data: {
                    title: message.slice(0, 40),
                },
            })
        } else {
            conversation = await prisma.conversation.findUnique({
                where: {
                    id: conversationId,
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
                for await (const chunk of stream) {
                    const content =
                        chunk.choices[0]?.delta?.content || ""

                    fullResponse += content

                    controller.enqueue(
                        encoder.encode(content)
                    )
                }

                // Save assistant message after stream completes
                await prisma.message.create({
                    data: {
                        role: "assistant",
                        content: fullResponse,
                        conversationId: conversation.id,
                    },
                })

                controller.close()
            },
        })

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        })
    } catch (error) {
        console.error(error)

        return new Response("Something went wrong", {
            status: 500,
        })
    }
}