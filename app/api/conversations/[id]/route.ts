import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const messages = await prisma.message.findMany({
            where: {
                conversationId: id,
            },
            orderBy: {
                createdAt: "asc",
            },
        })

        return NextResponse.json(messages)
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        )
    }
}