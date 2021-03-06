const canvas = document.querySelector('.canvas')

export const EventHub = Object.create(null, {
    init: {
        value: () => {
            const eventHub = document.createElement("div")
            eventHub.className = "broker"
            eventHub.textContent = "Hub"

            canvas.appendChild(eventHub)
        }
    }
})
