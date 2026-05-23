import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const logs = await prisma.inferenceLog.findMany({
            orderBy: {
                createdAt: "asc",
            },
        })

        const totalRequests = logs.length

        const successCount = logs.filter(
            (log) => log.status === "success"
        ).length

        const errorCount = logs.filter(
            (log) => log.status === "error"
        ).length

        const averageLatency =
            logs.length > 0
                ? Math.round(
                    logs.reduce(
                        (acc, log) => acc + log.latencyMs,
                        0
                    ) / logs.length
                )
                : 0

        const providerUsage = logs.reduce(
            (acc: Record<string, number>, log) => {
                acc[log.provider] =
                    (acc[log.provider] || 0) + 1

                return acc
            },
            {}
        )

        const latencyChart = logs.map((log) => ({
            timestamp: log.createdAt,
            latency: log.latencyMs,
        }))

        return NextResponse.json({
            totalRequests,
            successCount,
            errorCount,
            averageLatency,
            providerUsage,
            latencyChart,
        })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            {
                error: "Failed to fetch metrics",
            },
            {
                status: 500,
            }
        )
    }
}