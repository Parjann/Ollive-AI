"use client"

import { useEffect, useState } from "react"

import ConversationSidebar from "@/components/sidebar/ConversationSidebar"
import ChatWindow from "@/components/chat/ChatWindow"
import ChatInput from "@/components/chat/ChatInput"
import Header from "@/components/Header"

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
  const [provider, setProvider] = useState("groq")
  const [model, setModel] = useState("llama-3.3-70b-versatile")

  const [isStreaming, setIsStreaming] = useState(false)

  const [controller, setController] = useState<AbortController | null>(null)

  async function fetchConversations() {
    try {
      const res = await fetch("/api/conversations")

      const data = await res.json()

      setConversations(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function loadConversation(id: string) {
    try {
      const res = await fetch(`/api/conversations/${id}`)

      const data = await res.json()

      setConversationId(id)

      setMessages(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function sendMessage() {
    if (!input.trim()) return

    try {
      setIsStreaming(true)

      const userMessage = {
        role: "user",
        content: input,
      }

      setMessages((prev) => [...prev, userMessage])

      const currentInput = input

      setInput("")

      const abortController = new AbortController()

      setController(abortController)

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          conversationId,
          provider,
          model,
        }),
        signal: abortController.signal,
      })

      // Get conversation ID from response headers
      const newConversationId =
        res.headers.get("x-conversation-id")

      if (!conversationId && newConversationId) {
        setConversationId(newConversationId)

        fetchConversations()
      }

      const reader = res.body?.getReader()

      if (!reader) return

      let assistantMessage = ""

      // Add empty assistant message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ])

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = new TextDecoder().decode(value)

        assistantMessage += chunk

        setMessages((prev) => {
          const updated = [...prev]

          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantMessage,
          }

          return updated
        })
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error(error)
      }
    } finally {
      setIsStreaming(false)
    }
  }

  function handleCancel() {
    controller?.abort()

    setIsStreaming(false)
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Sidebar Navigation */}
      <ConversationSidebar
        conversations={conversations}
        activeId={conversationId}
        onSelect={loadConversation}
        onNewChat={() => {
          setConversationId("")
          setMessages([])
        }}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#09090b]">
        {/* Persistent Sticky Header */}
        <Header />

        {/* Chat Stream Window */}
        <ChatWindow messages={messages} isStreaming={isStreaming} />

        {/* Input Box Bar */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          onCancel={handleCancel}
          isStreaming={isStreaming}
          provider={provider}
          model={model}
          setProvider={setProvider}
          setModel={setModel}
        />
      </div>
    </main>
  )
}