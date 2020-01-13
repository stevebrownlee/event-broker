import { useColors } from "./colorProvider.js"

const connections = new WeakMap()
const broker = null

export const reconnectComponents = component => {
    if (connections.has(component)) {
        const target = connections.get(component)
        if (target.publish) {
            drawPublisherToBroker(target, target.event, target.color)
        } else {
            drawBrokerToSubscriber(target, target.event, target.color)
        }
    }
}

const drawPublisherToBroker = (publisher, eventName, color) => {
    const outgoing = new LeaderLine(
        publisher,
        broker,
        {
            dash: { animation: true },
            color: color,
            middleLabel: eventName,
            hide: true
        }
    )

    return outgoing
}

const drawBrokerToSubscriber = (subscriber, eventName, color) => {
    const incoming = new LeaderLine(
        broker,
        subscriber,
        {
            dash: { animation: true },
            color: color,
            middleLabel: eventName,
            hide: true
        }
    )

    return incoming
}

const drawConnection = (publisher, subscriber, eventName, color) => {
    publisher.style.backgroundImage = 'url(\'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cG9seWdvbiBwb2ludHM9IjI0LDAgMCw4IDgsMTEgMCwxOSA1LDI0IDEzLDE2IDE2LDI0IiBmaWxsPSJjb3JhbCIvPjwvc3ZnPg==\')'
    publisher.style.backgroundRepeat = 'no-repeat'
    publisher.style.backgroundPosition = "right 2px top 2px"
    publisher.style.backgroundSize = "0.75em 0.75em"

    let outgoing = null
    broker = document.querySelector(".broker")

    if (!connections.has(publisher.parentNode)) {
        outgoing = drawPublisherToBroker(publisher, eventName, color)
    }
    const incoming = drawBrokerToSubscriber(subscriber, eventName, color)

    publisher.addEventListener("mouseover", e => {
        outgoing && outgoing.show()
        incoming.show()
    })

    publisher.addEventListener("mouseout", e => {
        outgoing && outgoing.hide()
        incoming.hide()
    })
}

export const connectComponents = (publisher, subscriber, eventName) => {
    const publishingComponent = publisher.parentNode
    const color = useColors().random()

    if (!connections.has(publishingComponent)) {
        drawConnection(publisher, subscriber, eventName, color)
        connections.set(publishingComponent, { color: color, event: eventName, publish: true })
    }

    if (!connections.has(subscriber)) {
        connections.set(subscriber, { color: color, event: eventName, publish: false })
    }
}