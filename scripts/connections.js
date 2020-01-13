import { useColors } from "./colorProvider.js"

const connections = new WeakMap()
const eventHub = document.querySelector(".container")
let broker = null

export const reconnectComponents = component => {
    if (
        !connections.has(component) ||
        (connections.has(component) && connections.get(component).isPublisher)) {

        const allPublishedEvents = component.querySelectorAll(".component__publish")

        for (const eventEl of allPublishedEvents) {
            if (connections.has(eventEl)) {
                const target = connections.get(eventEl)
                target.line.remove()

                eventEl.removeEventListener("mouseout", target.mouseout)
                eventEl.removeEventListener("mouseover", target.mouseover)

                const { outgoingLine,
                    outgoingMouseOver,
                    outgoingMouseOut } = drawPublisherToBroker(eventEl, target.event, target.color)
                target.line = outgoingLine

                eventEl.addEventListener("mouseover", outgoingMouseOver)
                eventEl.addEventListener("mouseout", outgoingMouseOut)
            }
        }
    }

    if (connections.has(component) && connections.get(component).isSubscriber) {
        const target = connections.get(component)
        target.line.remove()

        component.removeEventListener("mouseout", target.mouseout)
        component.removeEventListener("mouseover", target.mouseover)

        const { incomingLine,
            incomingMouseOver,
            incomingMouseOut } = drawBrokerToSubscriber(component, target.publisher, target.event, target.color)
        target.line = incomingLine

        component.addEventListener("mouseover", incomingMouseOver)
        component.addEventListener("mouseout", incomingMouseOut)
    }
}

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
        try {
            console.log("outgoingMouseOut")
            outgoingLine.hide()
        } catch (error) { }
    }
    const outgoingMouseOver = e => {
        try {
            console.log("outgoingMouseOver")
            outgoingLine.show()
        } catch (error) { }
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
        try {
            console.log("incomingMouseOut")
            incomingLine.hide()
        } catch (error) { }
    }
    const incomingMouseOver = e => {
        try {
            console.log("incomingMouseOver")
            incomingLine.show()
        } catch (error) { }
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

    if (!connections.has(publisher.parentNode)) {
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
    const color = useColors().random()
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
            color: color,
            event: eventName,
            isSubscriber: true,
            isPublisher: false,
            line: incomingLine,
            mouseout: incomingMouseOut,
            mouseover: incomingMouseOver,
            publisher: publisher
        })
    }
    connections.get(subscriber).isSubscriber = true
}