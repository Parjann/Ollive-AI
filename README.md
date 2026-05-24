# AI Observability Platform

A premium, cloud-native AI inference observability platform built with Next.js, PostgreSQL, Groq, Gemini, Docker, and Kubernetes.

### 🚀 [Live Demo Playground](https://ollive-ai-eight.vercel.app/)

The platform supports:
- Multi-turn AI conversations
- Streaming responses
- Multi-provider LLM support
- Inference telemetry logging
- Observability dashboards
- Event-driven architecture
- PII redaction
- Docker Compose deployment
- Kubernetes deployment

---

# Features

## Chatbot Application
- Multi-turn conversations
- Streaming AI responses
- Conversation persistence
- Cancel ongoing generations
- Resume conversations
- Conversation sidebar

## Multi-Provider LLM Support
Supported Providers:
- Groq
- Gemini

Supported Models:
- Llama 3.3 70B
- Gemini 2.5 Flash

## Observability Features
- Inference logging
- Latency tracking
- Error tracking
- Provider analytics
- Request metrics dashboard
- Throughput monitoring

## Security Features
- PII redaction for logs
- Secret-based environment configuration

## Infrastructure
- Docker Compose one-command setup
- Self-hosted Kubernetes deployment
- PostgreSQL persistence
- Event-driven telemetry pipeline

---

# Tech Stack

## Frontend
- Next.js 16
- React
- Tailwind CSS

## Backend
- Next.js Route Handlers
- Prisma ORM
- PostgreSQL

## AI Providers
- Groq API
- Google Gemini API

## Infrastructure
- Docker
- Docker Compose
- Kubernetes

---

# Architecture Overview

```text
Frontend (Next.js UI)
        ↓
Chat API Route
        ↓
Provider Router
   ├── Groq
   └── Gemini
        ↓
Streaming Response Pipeline
        ↓
Event Bus
        ↓
Inference Listeners
        ↓
Telemetry Logging
        ↓
PostgreSQL
```

---

# Ingestion Flow

```text
User Message
    ↓
LLM Request
    ↓
Streaming Response
    ↓
Inference Event Emitted
    ↓
Event Listener Processes Telemetry
    ↓
PII Redaction
    ↓
Inference Logs Stored in PostgreSQL
```

---

# Event-Driven Architecture

The platform uses an internal event bus to decouple inference execution from telemetry persistence.

Benefits:
- Improved scalability
- Reduced API coupling
- Better fault isolation
- Easier migration to Kafka/RabbitMQ in future

---

# Database Schema Design

## Conversation
Stores user chat sessions.

## Message
Stores user and assistant messages.

## InferenceLog
Stores:
- provider
- model
- latency
- status
- token usage
- errors
- timestamps
- redacted previews

---

# PII Redaction

The platform automatically redacts:
- emails
- phone numbers
- API keys/secrets

before storing telemetry logs.

---

# Local Development

## 1. Clone Repository

```bash
git clone <repo-url>
cd ai-observability-platform
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create `.env`

```env
DATABASE_URL=

GROQ_API_KEY=

GEMINI_API_KEY=
```

---

## 4. Run Prisma Migration

```bash
npx prisma migrate dev
```

---

## 5. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Docker Compose Setup

## Run Entire Stack

```bash
docker compose up --build
```

This starts:
- Next.js application
- PostgreSQL database

---

# Kubernetes Deployment

## 1. Build Docker Image

```bash
docker build -t ai-observability-app .
```

---

## 2. Create Kubernetes Secret

```bash
kubectl create secret generic app-secret \
  --from-literal=GROQ_API_KEY=YOUR_GROQ_KEY \
  --from-literal=GEMINI_API_KEY=YOUR_GEMINI_KEY \
  --from-literal=DATABASE_URL=postgresql://postgres:postgres@postgres:5432/ai_observability
```

---

## 3. Apply Kubernetes Manifests

```bash
kubectl apply -f k8s/
```

---

## 4. Verify Pods

```bash
kubectl get pods
```

---

# Vercel Cloud Deployment

The Next.js web application is designed to be fully compatible with Serverless hosting on **Vercel**.

## 1. Setup Hosted Database
Since Vercel runs serverlessly, you will need a hosted PostgreSQL instance (such as **Neon** or **Supabase**). 
1. Create a free PostgreSQL instance at [Neon](https://neon.tech/) or [Supabase](https://supabase.com/).
2. Copy your connection connection string (`postgresql://...`).

## 2. Deploy to Vercel
1. Click the **Deploy to Vercel** button at the top of the repository or import the repository inside your Vercel Dashboard.
2. In the **Environment Variables** configuration block, add:
   * `DATABASE_URL`: Your hosted PostgreSQL connection string.
   * `GROQ_API_KEY`: Your Groq API key.
   * `GEMINI_API_KEY`: Your Gemini API key.
3. Click **Deploy**. Vercel will automatically run migrations and launch your cloud-hosted playground!

---

# Dashboard

Open:

```text
http://localhost:3000/dashboard
```

Dashboard includes:
- latency metrics
- error metrics
- provider analytics
- request monitoring

---

# Scaling Considerations

Current architecture can scale by:
- Horizontal pod scaling
- External event queue integration
- Dedicated telemetry workers
- Read replicas for PostgreSQL

Future improvements:
- Kafka/RabbitMQ
- Redis caching
- Distributed tracing
- Prometheus + Grafana
- Rate limiting

---

# Failure Handling Assumptions

- Provider failures are logged asynchronously
- Event-driven logging prevents inference blocking
- Streaming interruptions are handled gracefully
- Errors are persisted for observability

---

# Tradeoffs Made

## Chosen Simplicity Over Complexity
- Internal EventEmitter instead of Kafka
- Local PostgreSQL instead of managed DB
- Lightweight observability implementation

## Benefits
- Easier local setup
- Faster development
- Simpler debugging

---

# Future Improvements

- Kafka-based event streaming
- Prometheus/Grafana integration
- RBAC authentication
- Distributed tracing
- Rate limiting
- Retry queues
- OpenTelemetry support
- Vector database integration

---

# Screenshots

## Chat Playground

![Chat UI](./screenshots/chat-ui.png)

---

## Observability Dashboard

![Dashboard](./screenshots/dashboard-ui.png)

---

# Demo

- Screenshots
- Hosted deployment

---

# Author

Parjan Hussain