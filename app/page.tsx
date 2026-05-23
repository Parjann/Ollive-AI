"use client"

import { useState } from "react"

type ChatMessage = {
  role: string
  content: string
}

export default function HomePage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState("")

  async function sendMessage() {
    if (!input.trim()) return

    const userMessage = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])

    const currentInput = input
    setInput("")

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: currentInput,
        conversationId,
      }),
    })

    const data = await res.json()

    if (!conversationId) {
      setConversationId(data.conversationId)
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.message,
      },
    ])
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">
        AI Observability Platform
      </h1>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        <div className="border rounded-lg p-4 h-[500px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${msg.role === "user"
                ? "text-right"
                : "text-left"
                }`}
            >
              <div className="inline-block border rounded-lg px-4 py-2">
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="border rounded-lg p-4"
        />

        <button
          onClick={sendMessage}
          className="bg-black text-white rounded-lg px-6 py-3"
        >
          Send
        </button>
      </div>
    </main>
  )
}