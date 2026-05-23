export function redactPII(
    text: string
) {
    if (!text) return text

    let redacted = text

    // Email redaction
    redacted = redacted.replace(
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        "[REDACTED_EMAIL]"
    )

    // Phone number redaction
    redacted = redacted.replace(
        /\b\d{10,15}\b/g,
        "[REDACTED_PHONE]"
    )

    // API key/token redaction
    redacted = redacted.replace(
        /\b(sk-|AIza)[A-Za-z0-9\-_]+\b/g,
        "[REDACTED_SECRET]"
    )

    return redacted
}