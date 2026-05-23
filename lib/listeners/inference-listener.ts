import { eventBus } from "@/lib/events"

import { EVENTS } from "@/lib/event-types"

import { logInference } from "@/lib/logger"

eventBus.on(
    EVENTS.INFERENCE_COMPLETED,

    async (payload) => {
        console.log(
            "Inference completed event received"
        )

        await logInference(payload)
    }
)

eventBus.on(
    EVENTS.INFERENCE_FAILED,

    async (payload) => {
        console.log(
            "Inference failed event received"
        )

        await logInference(payload)
    }
)