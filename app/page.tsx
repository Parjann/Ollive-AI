"use client"

import { useEffect, useState } from "react"

import ConversationSidebar from "@/components/sidebar/ConversationSidebar"
import ChatWindow from "@/components/chat/ChatWindow"
import ChatInput from "@/components/chat/ChatInput"

type Message = {
  role: string
  content: string
}

type Conversation = {
  id: string
  title: string
}

export default function HomePage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])

  async function fetchConversations() {
    const res = await fetch("/api/conversations")
    const data = await res.json()

    setConversations(data)
  }

  async function loadConversation(id: string) {
    const res = await fetch(`/api/conversations/${id}`)
    const data = await res.json()

    setConversationId(id)
    setMessages(data)
  }

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
      fetchConversations()
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.message,
      },
    ])
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  return (
    <main className="flex">
      <ConversationSidebar
        conversations={conversations}
        onSelect={loadConversation}
      />

      <div className="flex-1 p-6 flex flex-col gap-4">
        <h1 className="text-4xl font-bold">
          AI Observability Platform
        </h1>

        <ChatWindow messages={messages} />

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={sendMessage}
        />
      </div>
    </main>
  )
}