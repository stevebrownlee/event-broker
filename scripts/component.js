import { drag } from "./drag.js"
import { createHeader } from "./componentHeaderFactory.js"
import { createDescription } from "./componentDescriptionFactory.js"
import { createPublishArea } from "./componentPublishFactory.js"
import { connectComponents } from "./connections.js"

let count = 1
const canvas = document.querySelector('.canvas')

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
                    e.preventDefault()
                    const details = JSON.parse(e.dataTransfer.getData("details"))

                    connectComponents(
                        document.getElementById(details.publisher),
                        e.target,
                        details.eventName
                    )
                }

                card.appendChild(createHeader(card))
                card.appendChild(createDescription(card))
                card.appendChild(createPublishArea(card))
                canvas.appendChild(card)
                count++

                drag(card)
            }

            const add = document.querySelector("#addComponent")
            add.addEventListener("click", makeComponent)
        }
    }
})
