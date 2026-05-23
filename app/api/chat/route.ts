import { groq } from "@/lib/groq"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const messages = body.messages

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
        })

        return NextResponse.json({
            message: completion.choices[0]?.message?.content,
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