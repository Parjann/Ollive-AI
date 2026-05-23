import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                updatedAt: "desc",
            },
        })

        return NextResponse.json(conversations)
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: "Failed to fetch conversations" },
            { status: 500 }
        )
    }
}