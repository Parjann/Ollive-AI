# Architecture Notes

## Inference Flow

```text
Frontend
   ↓
Chat Route
   ↓
Provider Router
   ├── Groq
   └── Gemini
   ↓
Streaming Response
   ↓
Event Emission
   ↓
Inference Listener
   ↓
PII Redaction
   ↓
PostgreSQL Persistence
```

---

## Logging Strategy

Inference telemetry is emitted asynchronously using an internal event bus.

Captured metadata:
- provider
- model
- latency
- request status
- token estimates
- timestamps
- redacted previews

---

## Event-Based Architecture

The application uses a lightweight event-driven architecture using Node.js EventEmitter.

Benefits:
- decoupled telemetry pipeline
- reduced API latency impact
- easier scalability
- future Kafka/RabbitMQ migration support

---

## Scaling Considerations

Potential scaling strategies:
- Kubernetes horizontal pod autoscaling
- PostgreSQL read replicas
- Redis caching
- Dedicated logging workers
- Queue-based ingestion systems

---

## Failure Handling

- Provider failures are captured as telemetry events
- Logging failures do not block inference execution
- Streaming interruptions are handled gracefully
- PII is redacted before persistence