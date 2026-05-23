"use client"

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts"

import { useEffect, useState } from "react"
import Header from "@/components/Header"
import { Activity, CheckCircle2, AlertCircle, Clock, Server, BarChart3, Database } from "lucide-react"

type Metrics = {
    totalRequests: number
    successCount: number
    errorCount: number
    averageLatency: number

    providerUsage: Record<string, number>

    latencyChart: {
        timestamp: string
        latency: number
    }[]
}

export default function DashboardPage() {
    const [metrics, setMetrics] =
        useState<Metrics | null>(null)

    async function fetchMetrics() {
        const res = await fetch("/api/metrics")
        const data = await res.json()
        setMetrics(data)
    }

    useEffect(() => {
        fetchMetrics()
    }, [])

    if (!metrics) {
        return (
            <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 rounded-full border-2 border-t-violet-500 border-zinc-800 animate-spin" />
                        <span className="text-sm text-zinc-500 font-medium tracking-wide">
                            Loading observability stats...
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    // Format timestamps for visual axes
    const formattedChartData = metrics.latencyChart.map((d) => ({
        ...d,
        formattedTime: new Date(d.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }),
    }))

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans flex flex-col overflow-x-hidden">
            {/* Navigation Header */}
            <Header />

            {/* Main Content Body */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 space-y-8">
                {/* Dashboard Title Panel */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                        Observability Metrics
                    </h1>
                    <p className="text-sm text-zinc-400 font-medium">
                        Real-time analytics and transaction latency logging for connected LLMs.
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Total Requests */}
                    <div className="group border border-zinc-900 bg-zinc-950/40 rounded-2xl p-6 flex flex-col justify-between hover:border-violet-500/30 transition-all duration-300 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/10 transition-all duration-300" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Total Requests
                            </span>
                            <div className="h-8 w-8 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                                <Activity className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-zinc-100 tracking-tight leading-none mb-1">
                                {metrics.totalRequests}
                            </p>
                            <span className="text-[10px] text-zinc-500 font-semibold tracking-wide">
                                Sub-second pipeline metrics
                            </span>
                        </div>
                    </div>

                    {/* Card 2: Success Requests */}
                    <div className="group border border-zinc-900 bg-zinc-950/40 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-600/5 rounded-full blur-2xl group-hover:bg-emerald-600/10 transition-all duration-300" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Success Count
                            </span>
                            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-zinc-100 tracking-tight leading-none mb-1">
                                {metrics.successCount}
                            </p>
                            <span className="text-[10px] text-zinc-500 font-semibold tracking-wide">
                                Successful model generation
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Error Requests */}
                    <div className="group border border-zinc-900 bg-zinc-950/40 rounded-2xl p-6 flex flex-col justify-between hover:border-rose-500/30 transition-all duration-300 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-rose-600/5 rounded-full blur-2xl group-hover:bg-rose-600/10 transition-all duration-300" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Errors Logged
                            </span>
                            <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                                <AlertCircle className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-zinc-100 tracking-tight leading-none mb-1">
                                {metrics.errorCount}
                            </p>
                            <span className="text-[10px] text-zinc-500 font-semibold tracking-wide">
                                Exceptions caught
                            </span>
                        </div>
                    </div>

                    {/* Card 4: Avg Latency */}
                    <div className="group border border-zinc-900 bg-zinc-950/40 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-amber-600/5 rounded-full blur-2xl group-hover:bg-amber-600/10 transition-all duration-300" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Avg Latency
                            </span>
                            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                                <Clock className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-zinc-100 tracking-tight leading-none mb-1">
                                {metrics.averageLatency}<span className="text-xl font-bold">ms</span>
                            </p>
                            <span className="text-[10px] text-zinc-500 font-semibold tracking-wide">
                                Round-trip transaction rate
                            </span>
                        </div>
                    </div>
                </div>

                {/* Latency Over Time Chart Area */}
                <div className="border border-zinc-900 bg-zinc-950/40 rounded-2xl p-6 hover:border-zinc-800/60 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className="h-5 w-5 text-violet-500" />
                        <h2 className="text-base font-extrabold text-zinc-100 tracking-tight uppercase">
                            Latency Over Time
                        </h2>
                    </div>

                    <div className="h-[320px] w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="latencyGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.15)" vertical={false} />
                                <XAxis
                                    dataKey="formattedTime"
                                    stroke="#52525b"
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#52525b"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${val}ms`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: "#18181b",
                                        border: "1px solid rgba(63, 63, 70, 0.4)",
                                        borderRadius: "16px",
                                        color: "#f4f4f5",
                                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                                    }}
                                    labelStyle={{ fontWeight: "bold", color: "#a1a1aa", fontSize: "11px" }}
                                    itemStyle={{ color: "#a78bfa", fontWeight: "600" }}
                                    formatter={(value: any) => [`${value} ms`, "Latency"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="latency"
                                    stroke="#8b5cf6"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#latencyGlow)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Panel: Provider Usage & Allocation */}
                <div className="border border-zinc-900 bg-zinc-950/40 rounded-2xl p-6 hover:border-zinc-800/60 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <Database className="h-5 w-5 text-violet-500" />
                        <h2 className="text-base font-extrabold text-zinc-100 tracking-tight uppercase">
                            Provider Usage
                        </h2>
                    </div>

                    {Object.entries(metrics.providerUsage).length === 0 ? (
                        <p className="text-xs text-zinc-500 py-4 text-center">No logs generated yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(metrics.providerUsage).map(([provider, count]) => {
                                const percentage = Math.round(
                                    (count / metrics.totalRequests) * 100
                                )

                                return (
                                    <div
                                        key={provider}
                                        className="border border-zinc-900 bg-zinc-950 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-800 transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Server className="h-4 w-4 text-violet-400" />
                                                <span className="text-xs font-extrabold text-zinc-200 uppercase tracking-wide">
                                                    {provider}
                                                </span>
                                            </div>
                                            <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-semibold px-2 py-0.5 rounded-full uppercase">
                                                {count} {count === 1 ? "call" : "calls"}
                                            </span>
                                        </div>

                                        {/* Usage Percentage Slider / Progress Bar */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-baseline text-xs text-zinc-400">
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                                                    Allocation
                                                </span>
                                                <span className="font-extrabold text-zinc-200">
                                                    {percentage}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/40">
                                                <div
                                                    className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}