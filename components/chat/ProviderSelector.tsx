type Props = {
    provider: string
    model: string

    setProvider: (
        provider: string
    ) => void

    setModel: (
        model: string
    ) => void
}

export default function ProviderSelector({
    provider,
    model,
    setProvider,
    setModel,
}: Props) {
    function handleProviderChange(
        value: string
    ) {
        setProvider(value)

        // Set default model
        if (value === "groq") {
            setModel(
                "llama-3.3-70b-versatile"
            )
        }

        if (value === "gemini") {
            setModel("gemini-1.5-flash")
        }
    }

    return (
        <div className="flex gap-4">
            {/* Provider */}
            <select
                value={provider}
                onChange={(e) =>
                    handleProviderChange(
                        e.target.value
                    )
                }
                className="border rounded-lg p-3"
            >
                <option value="groq">
                    Groq
                </option>

                <option value="gemini">
                    Gemini
                </option>
            </select>

            {/* Models */}
            <select
                value={model}
                onChange={(e) =>
                    setModel(e.target.value)
                }
                className="border rounded-lg p-3"
            >
                {provider === "groq" && (
                    <>
                        <option value="llama-3.3-70b-versatile">
                            Llama 3.3 70B
                        </option>

                        <option value="deepseek-r1-distill-llama-70b">
                            DeepSeek R1
                        </option>

                        <option value="mixtral-8x7b-32768">
                            Mixtral 8x7B
                        </option>
                    </>
                )}

                {provider === "gemini" && (
                    <>
                        <option value="gemini-1.5-flash">
                            Gemini Flash
                        </option>

                        <option value="gemini-1.5-pro">
                            Gemini Pro
                        </option>
                    </>
                )}
            </select>
        </div>
    )
}