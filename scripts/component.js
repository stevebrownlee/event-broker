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
                    const publisher = document.getElementById(details.publisher).parentNode
                    let subscriber = null

                    if (e.target !== publisher) {
                        if (e.target.classList.contains("component")) {
                            subscriber = e.target
                        }

                        if (
                            e.target.classList.contains("component__description")
                            || e.target.classList.contains("component__header")
                            || e.target.classList.contains("component__publish")
                        ) {
                            // Can't drop on elements of same component
                            if (e.target.parentNode !== publisher) {
                                subscriber = e.target.parentNode
                            }
                        }
                    }

                    if (subscriber !== null) {
                        connectComponents(
                            document.getElementById(details.publisher),
                            subscriber,
                            details.eventName
                        )
                    }
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
