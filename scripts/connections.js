import { useColors } from "./colorProvider.js"

const connections = new WeakMap()
let broker = null

export const connectComponents = (publisher, subscriber, eventName) => {
    let color = useColors().random()

    if (connections.has(publisher)) {
        color = connections.get(publisher).color
    }

    const { incoming, outgoing } = drawAnimatedSVGs(publisher, subscriber, eventName, color)

    addPublisherConnection({
        publisher,
        line: outgoing.get("line"),
        mouseover: outgoing.get("mouseover"),
        mouseout: outgoing.get("mouseout"),
        color, eventName
    })

    addSubscriberConnection({
        subscriber, publisher,
        line: incoming.get("line"),
        mouseout: incoming.get("mouseout"),
        mouseover: incoming.get("mouseover"),
        color, eventName
    })
}
export const reconnectComponents = component => {
    if (connections.has(component) && connections.get(component).isSubscriber) {
        const lines = [...connections.get(component).lines.values()]

        for (const line of lines) {
            const publisher = line.get("publisher")
            line.get("svg").position()
        }
    }

    for (const eventEl of component.querySelectorAll(".component__publish")) {
        if (connections.has(eventEl) && connections.get(eventEl).isPublisher) {
            const target = connections.get(eventEl)
            target.line.position()
        }
    }
}

const addPublisherConnection = (props) => {
    if (!connections.has(props.publisher)) {
        // TODO: Change value to map
        connections.set(props.publisher, {
            color: props.color,
            event: props.eventName,
            isSubscriber: false,
            isPublisher: true,
            line: props.line,
            mouseout: props.mouseout,
            mouseover: props.mouseover,
            publisher: null
        })
    }
}

const addSubscriberConnection = (props) => {
    if (!connections.has(props.subscriber)) {
        // TODO: Change value to map
        connections.set(props.subscriber, {
            isSubscriber: true,
            isPublisher: false,
            lines: new Set()
        })
    }

    const subLine = new Map()
    subLine.set("svg", props.line)
    subLine.set("color", props.color)
    subLine.set("event", props.eventName)
    subLine.set("publisher", props.publisher)
    subLine.set("mouseout", props.mouseout)
    subLine.set("mouseover", props.mouseover)

    const sub = connections.get(props.subscriber)
    sub.lines.add(subLine)
    sub.isSubscriber = true
}

const drawAnimatedSVGs = (publisher, subscriber, eventName, color) => {
    publisher.style.backgroundImage = 'url(\'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cG9seWdvbiBwb2ludHM9IjI0LDAgMCw4IDgsMTEgMCwxOSA1LDI0IDEzLDE2IDE2LDI0IiBmaWxsPSJjb3JhbCIvPjwvc3ZnPg==\')'
    publisher.style.backgroundRepeat = 'no-repeat'
    publisher.style.backgroundPosition = "right 2px top 2px"
    publisher.style.backgroundSize = "0.75em 0.75em"

    broker = document.querySelector(".broker")

    const outgoing = new Map()
    outgoing.set("line", null)
    outgoing.set("mouseover", null)
    outgoing.set("mouseout", null)

    if (!connections.has(publisher)) {
        const outgoingProps = drawPublisherToBroker(publisher, eventName, color)
        outgoing.set("line", outgoingProps.outgoingLine)
        outgoing.set("mouseover", outgoingProps.outgoingMouseOver)
        outgoing.set("mouseout", outgoingProps.outgoingMouseOut)
    }

    const incomingProps = drawBrokerToSubscriber(subscriber, publisher, eventName, color)

    const incoming = new Map()
    incoming.set("line", incomingProps.incomingLine)
    incoming.set("mouseover", incomingProps.incomingMouseOver)
    incoming.set("mouseout", incomingProps.incomingMouseOut)

    return { incoming, outgoing }
}

const drawPublisherToBroker = (publisher, eventName, color) => {
    const outgoingLine = new LeaderLine(
        publisher,
        broker,
        {
            dash: { animation: true, gap: 10 },
            showEffectName: "draw",
            path: "fluid",
            color: color,
            startPlug: "disc",
            endPlug: "behind",
            middleLabel: eventName,
            hide: true
        }
    )

    const outgoingMouseOut = e => outgoingLine.hide()
    const outgoingMouseOver = e => outgoingLine.show()

    publisher.addEventListener("mouseover", outgoingMouseOver)
    publisher.addEventListener("mouseout", outgoingMouseOut)

    return { outgoingLine, outgoingMouseOver, outgoingMouseOut }
}

const drawBrokerToSubscriber = (subscriber, publisher, eventName, color) => {
    const incomingLine = new LeaderLine(
        broker,
        LeaderLine.areaAnchor(subscriber, {
            color: "red",
            dash: true,
            size: 3,
            radius: 5,
            fillColor: "rgba(215, 209, 43, 0.2)"
        }),
        {
            dash: { animation: true, gap: 10 },
            color: color,
            path: "fluid",
            middleLabel: eventName,
            hide: true
        }
    )

    const incomingMouseOut = e => incomingLine.hide()
    const incomingMouseOver = e => incomingLine.show()

    publisher.addEventListener("mouseover", incomingMouseOver)
    publisher.addEventListener("mouseout", incomingMouseOut)

    return { incomingLine, incomingMouseOver, incomingMouseOut }
}
