"use client"

import { useState } from "react"

export default function HomePage() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")

  async function sendMessage() {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: input,
          },
        ],
      }),
    })

    const data = await res.json()

    setResponse(data.message)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-4xl font-bold">
        AI Observability Platform
      </h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-4 w-full max-w-xl rounded-lg"
        placeholder="Ask something..."
      />

      <button
        onClick={sendMessage}
        className="bg-black text-white px-6 py-2 rounded-lg"
      >
        Send
      </button>

      {response && (
        <div className="max-w-xl border rounded-lg p-4 w-full">
          {response}
        </div>
      )}
    </main>
  )
}