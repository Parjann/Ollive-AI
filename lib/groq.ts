import Groq from "groq-sdk"

let groqInstance: Groq | null = null

export const groq = new Proxy({} as Groq, {
    get(target, prop, receiver) {
        if (!groqInstance) {
            groqInstance = new Groq({
                apiKey: process.env.GROQ_API_KEY,
            })
        }
        return Reflect.get(groqInstance, prop, receiver)
    }
})