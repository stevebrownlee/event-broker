import { drag } from "./drag.js"
import { useColors } from "./colorProvider.js"
import { useEvents } from "./eventNameProvider.js"
import { createHeader } from "./componentHeaderFactory.js"
import { createDescription } from "./componentDescriptionFactory.js"
import { createPublishArea } from "./componentPublishFactory.js"

let count = 1
const canvas = document.querySelector('.canvas')
const colors = useColors()

export const ComponentFactory = Object.create(null, {
    init: {
        value: () => {
            const makeComponent = () => {

                const card = document.createElement("section")
                card.classList = `component component--high`
                card.draggable = true
                card.id = `component--${count}`
                card.addEventListener("dblclick", e => e.target.focus())

                card.ondragover = e => e.preventDefault()

                card.ondrop = e => {
                    console.log("Listener identified")
                    // Enabled dropping on targets
                    e.preventDefault()

                    // Determine what's being dropped
                    const data = e.dataTransfer.getData("eventName")

                    // Can only drop cards in column components
                    let dropTarget = null
                    if (e.target.className.includes("component")) {
                        dropTarget = e.target.parentElement
                    }

                    // Append card to target column as child
                    console.log(document.getElementById(data).textContent)

                    // Update task's `column` property
                }

                card.appendChild(createHeader(card))
                card.appendChild(createDescription(card))
                card.appendChild(createPublishArea(card))
                canvas.appendChild(card)
                count++

                drag(card)
            }

            const connectComponents = () => {
                const broker = document.querySelector(".broker")
                const components = [...document.querySelectorAll(".component")]

                components.forEach(c => {
                    const event = c.querySelector(".component__publish")

                    let randomListener = null
                    do {
                        randomListener = [...document.querySelectorAll(".component")].random()
                    } while (randomListener === c)

                    const randomColor = colors.random()
                    const randomEvent = useEvents().random()

                    event.style.backgroundImage = 'url(\'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cG9seWdvbiBwb2ludHM9IjI0LDAgMCw4IDgsMTEgMCwxOSA1LDI0IDEzLDE2IDE2LDI0IiBmaWxsPSJjb3JhbCIvPjwvc3ZnPg==\')'
                    event.style.backgroundRepeat = 'no-repeat'
                    event.style.backgroundPosition = "right 2px top 2px"
                    event.style.backgroundSize = "0.75em 0.75em"

                    const outgoing = new LeaderLine(
                        c,
                        broker,
                        {
                            dash: { animation: true },
                            color: randomColor,
                            middleLabel: randomEvent,
                            hide: true
                        }
                    )
                    const incoming = new LeaderLine(
                        broker,
                        randomListener,
                        {
                            dash: { animation: true },
                            color: randomColor,
                            middleLabel: randomEvent,
                            hide: true
                        }
                    )

                    event.addEventListener("mouseover", e => {
                        outgoing.show()
                        incoming.show()
                    })

                    event.addEventListener("mouseout", e => {
                        outgoing.hide()
                        incoming.hide()
                    })
                })
            }

            const add = document.querySelector("#addComponent")
            const connect = document.querySelector("#connectThem")

            add.addEventListener("click", makeComponent)
            connect.addEventListener("click", connectComponents)
        }
    }
})
