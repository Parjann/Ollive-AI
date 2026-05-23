import { groq } from "@/lib/groq"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const { message, conversationId } = body

        let conversation

        // Create new conversation if none exists
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
            return NextResponse.json(
                { error: "Conversation not found" },
                { status: 404 }
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

        // Fetch conversation history
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversation.id,
            },
            orderBy: {
                createdAt: "asc",
            },
        })

        // Format for Groq
        const formattedMessages = messages.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
        }))

        // Call Groq
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: formattedMessages,
        })

        const assistantMessage =
            completion.choices[0]?.message?.content || ""

        // Save assistant response
        await prisma.message.create({
            data: {
                role: "assistant",
                content: assistantMessage,
                conversationId: conversation.id,
            },
        })

        return NextResponse.json({
            conversationId: conversation.id,
            message: assistantMessage,
        })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            {
                error: "Something went wrong",
            },
            {
                status: 500,
            }
        )
    }
}