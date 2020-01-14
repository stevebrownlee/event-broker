import { useColors } from "./colorProvider.js"

const connections = new WeakMap()
let broker = null

const drawPublisherToBroker = (publisher, eventName, color) => {
    const outgoingLine = new LeaderLine(
        publisher,
        broker,
        {
            dash: { animation: true },
            color: color,
            middleLabel: eventName,
            hide: true
        }
    )

    const outgoingMouseOut = e => {
        outgoingLine.hide()
    }
    const outgoingMouseOver = e => {
        outgoingLine.show()
    }

    publisher.addEventListener("mouseover", outgoingMouseOver)
    publisher.addEventListener("mouseout", outgoingMouseOut)

    return { outgoingLine, outgoingMouseOver, outgoingMouseOut }
}

const drawBrokerToSubscriber = (subscriber, publisher, eventName, color) => {
    const incomingLine = new LeaderLine(
        broker,
        subscriber,
        {
            dash: { animation: true },
            color: color,
            middleLabel: eventName,
            hide: true
        }
    )

    const incomingMouseOut = e => {
        incomingLine.hide()
    }
    const incomingMouseOver = e => {
        incomingLine.show()
    }

    publisher.addEventListener("mouseover", incomingMouseOver)
    publisher.addEventListener("mouseout", incomingMouseOut)

    return { incomingLine, incomingMouseOver, incomingMouseOut }
}

const drawConnection = (publisher, subscriber, eventName, color) => {
    publisher.style.backgroundImage = 'url(\'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cG9seWdvbiBwb2ludHM9IjI0LDAgMCw4IDgsMTEgMCwxOSA1LDI0IDEzLDE2IDE2LDI0IiBmaWxsPSJjb3JhbCIvPjwvc3ZnPg==\')'
    publisher.style.backgroundRepeat = 'no-repeat'
    publisher.style.backgroundPosition = "right 2px top 2px"
    publisher.style.backgroundSize = "0.75em 0.75em"

    broker = document.querySelector(".broker")

    let outgoingLine = null
    let outgoingMouseOver = null
    let outgoingMouseOut = null

    if (!connections.has(publisher)) {
        const out = drawPublisherToBroker(publisher, eventName, color)
        outgoingLine = out.outgoingLine
        outgoingMouseOver = out.outgoingMouseOver
        outgoingMouseOut = out.outgoingMouseOut
    }
    const { incomingLine, incomingMouseOver, incomingMouseOut } = drawBrokerToSubscriber(subscriber, publisher, eventName, color)

    return {
        incomingLine,
        incomingMouseOver,
        incomingMouseOut,
        outgoingLine,
        outgoingMouseOver,
        outgoingMouseOut
    }
}

export const connectComponents = (publisher, subscriber, eventName) => {
    let color = useColors().random()

    if (connections.has(publisher)) {
        color = connections.get(publisher).color
    }

    if (subscriber.classList.contains("component__description")
        || subscriber.classList.contains("component__publish")) {
        subscriber = subscriber.parentNode
    }

    const {
        incomingLine,
        incomingMouseOver,
        incomingMouseOut,
        outgoingLine,
        outgoingMouseOver,
        outgoingMouseOut
    } = drawConnection(publisher, subscriber, eventName, color)

    if (!connections.has(publisher)) {
        // TODO: Change value to map
        connections.set(publisher, {
            color: color,
            event: eventName,
            isSubscriber: false,
            isPublisher: true,
            line: outgoingLine,
            mouseout: outgoingMouseOut,
            mouseover: outgoingMouseOver,
            publisher: null
        })
    }
    connections.get(publisher).isPublisher = true

    if (!connections.has(subscriber)) {
        // TODO: Change value to map
        connections.set(subscriber, {
            isSubscriber: true,
            isPublisher: false,
            lines: new Set()
        })
    }

    const sub = connections.get(subscriber)
    const subLine = new Map()
    subLine.set("svg", incomingLine)
    subLine.set("color", color)
    subLine.set("event", eventName)
    subLine.set("publisher", publisher)
    subLine.set("mouseout", incomingMouseOut)
    subLine.set("mouseover", incomingMouseOver)
    sub.lines.add(subLine)
    sub.isSubscriber = true
}

export const reconnectComponents = component => {
    if (connections.has(component) && connections.get(component).isSubscriber) {
        const lines = [...connections.get(component).lines.values()]

        for (const line of lines) {
            const publisher = line.get("publisher")
            line.get("svg").remove()
            publisher.removeEventListener("mouseout", line.get("mouseout"))
            publisher.removeEventListener("mouseover", line.get("mouseover"))

            const { incomingLine,
                incomingMouseOver,
                incomingMouseOut } = drawBrokerToSubscriber(
                                                component,
                                                publisher,
                                                line.get("event"),
                                                line.get("color"))

            line.set("svg", incomingLine)
            line.set("mouseover", incomingMouseOver)
            line.set("mouseout", incomingMouseOut)
        }
    }

    for (const eventEl of component.querySelectorAll(".component__publish")) {
        if (
            connections.has(eventEl)
            && connections.get(eventEl).isPublisher
        ) {
            const target = connections.get(eventEl)
            target.line.remove()

            eventEl.removeEventListener("mouseout", target.mouseout)
            eventEl.removeEventListener("mouseover", target.mouseover)

            const { outgoingLine,
                outgoingMouseOver,
                outgoingMouseOut } = drawPublisherToBroker(eventEl, target.event, target.color)
            target.line = outgoingLine

            target.mouseover = outgoingMouseOver
            eventEl.addEventListener("mouseover", outgoingMouseOver)

            target.mouseout = outgoingMouseOut
            eventEl.addEventListener("mouseout", outgoingMouseOut)
        }
    }
}