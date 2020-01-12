import { drag } from "./drag.js"
import { useColors } from "./colorProvider.js"

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


                const header = document.createElement("header")
                header.className = "component__header"
                header.textContent = "Component"
                header.contentEditable = true
                header.addEventListener("blur", function (e) {
                    let name = e.target.textContent
                    if (name === "") {
                        e.target.textContent = "Component"
                    }
                })
                header.addEventListener("dblclick", function (e) {
                    const name = e.target.textContent
                    e.target.textContent = name === "Component" ? "" : name
                })
                header.addEventListener("keypress", function (e) {
                    e.target.classList.add("edited")
                    if (e.keyCode === 13) {
                        if (e.target.textContent === "") {
                            e.target.textContent = "Component"
                        }
                        e.target.blur()
                        e.stopPropagation()
                        e.preventDefault()
                        e.returnValue = false
                        return false
                    }
                })

                const description = document.createElement("div")
                description.className = "component__description"
                description.textContent = "Responsibility"

                description.addEventListener("dblclick", function (e) {
                    const name = e.target.textContent
                    e.target.textContent = name === "Resposibility" ? "" : name
                    description.contentEditable = true
                })
                description.addEventListener("keypress", function (e) {
                    e.target.classList.add("edited")
                    if (e.keyCode === 13) {
                        if (e.target.textContent === "") {
                            e.target.textContent = "Resposibility"
                        }
                        description.contentEditable = true
                        e.target.blur()
                        e.stopPropagation()
                        e.preventDefault()
                        e.returnValue = false
                        return false
                    }
                })

                const publish = document.createElement("div")
                publish.className = "component__publish"
                publish.innerHTML = "<button class='btn fakeLink'>Add Event</button>"
                publish.contentEditable = true
                publish.onmousedown = (e) => {
                    card.draggable = false
                }
                window.onmouseup = (e) => {
                    card.draggable = true
                }


                card.appendChild(header)
                card.appendChild(description)
                card.appendChild(publish)
                canvas.appendChild(card)
                count++

                drag(card)
            }

            const connectComponents = () => {
                const broker = document.querySelector(".broker")
                const components = [...document.querySelectorAll(".component")]

                components.forEach(c => {
                    new LeaderLine(c, broker,
                        {
                            dash: {
                                animation: true
                            },
                            color: colors.random(),
                            middleLabel: 'eventName'
                        }
                    )
                })
            }

            const add = document.querySelector("#addComponent")
            const connect = document.querySelector("#connectThem")

            add.addEventListener("click", makeComponent)
            connect.addEventListener("click", connectComponents)
        }
    }
})
