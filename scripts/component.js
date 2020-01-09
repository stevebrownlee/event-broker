import { drag } from "./drag.js"

let count = 1
const canvas = document.querySelector('.canvas')

export const component = Object.create(null, {
    init: {
        value: () => {
            const makeComponent = () => {

                const card = document.createElement("section")
                card.classList = `component component--high`
                card.draggable = true
                card.id = `component--${count}`
                card.addEventListener("click", e => e.target.focus())


                const header = document.createElement("header")
                header.className = "component__header"
                header.textContent = "Component"
                header.contentEditable = true
                header.addEventListener("click", function (e) {
                    e.target.textContent = ""
                    e.target.classList.add("edited")
                })
                header.addEventListener("keypress", function (e) {
                    console.log(e.keyCode)
                    e.target.classList.add("edited")
                    if (e.keyCode === 13) {
                        e.stopPropagation()
                        e.preventDefault()
                        e.returnValue = false
                        return false
                    }
                })

                const description = document.createElement("div")
                description.className = "component__description"
                description.textContent = "Responsibility"
                description.contentEditable = true

                const publish = document.createElement("div")
                publish.className = "component__publish"
                publish.textContent = "Publishes"
                publish.contentEditable = true
                publish.onmousedown = (e) => {
                    console.log("Mouse down publish", card)
                    card.draggable = false
                }
                window.onmouseup = (e) => {
                    card.draggable = true
                }


                const subscribe = document.createElement("div")
                subscribe.className = "component__subscribe"
                subscribe.textContent = "Subscribes"
                subscribe.contentEditable = true

                card.appendChild(header)
                card.appendChild(description)
                card.appendChild(publish)
                card.appendChild(subscribe)

                canvas.appendChild(card)
                count++

                drag(card)
            }

            const connectComponents = () => {
                const elements = document.querySelectorAll(".component")
                const components = [...elements]

                components.reduce((c, n) => {
                    new LeaderLine( c, LeaderLine.areaAnchor(n),
                        {
                            dash: {
                                animation: true
                            },
                            middleLabel: 'eventName'
                        }
                    )
                    return n
                })
            }

            const add = document.querySelector("#addComponent")
            const connect = document.querySelector("#connectThem")

            add.addEventListener("click", makeComponent)
            connect.addEventListener("click", connectComponents)
        }
    }
})
