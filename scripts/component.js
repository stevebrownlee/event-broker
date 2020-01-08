import { drag } from "./drag.js"

let count = 1
const canvas = document.querySelector('.canvas')

export const makeComponent = () => {
    const card = document.createElement("section")

    card.textContent = "Component"
    card.classList = `component component--high`
    card.draggable = true
    card.id = `component--1`

    canvas.appendChild(card)
    count++

    drag(card)
}

const add = document.querySelector("#addComponent")
add.addEventListener("click", makeComponent)