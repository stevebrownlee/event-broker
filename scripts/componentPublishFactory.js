import { createEventContainer } from "./eventFactory.js"
import { drag, undrag } from "./drag.js"

let count = 1

export const createPublishArea = (card) => {
    const publish = document.createElement("div")
    publish.className = "component__publish"
    publish.id = `component__publish--${count++}`
    publish.draggable = false

    publish.addEventListener("blur", function (e) {
        let name = e.target.textContent
        if (name === "") {
            e.target.appendChild(createEventContainer())
        }
    })

    publish.addEventListener("keypress", function (e) {
        if (e.keyCode === 13) {
            if (publish.textContent === "") {
                publish.appendChild(createEventContainer())
                publish.draggable = false
                publish.ondragstart = null
                undrag(publish)
            } else {
                card.appendChild(createPublishArea(card))

                publish.draggable = true

                publish.ondragstart = e => {
                    const details = {
                        eventName: publish.textContent,
                        publisher: publish.id
                    }
                    e.dataTransfer.setData("details", JSON.stringify(details))
                }
                drag(publish)

            }
            publish.contentEditable = false
            publish.blur()
            e.stopPropagation()
            e.preventDefault()
            e.returnValue = false
            return false
        }
    })
    publish.appendChild(createEventContainer())

    return publish
}