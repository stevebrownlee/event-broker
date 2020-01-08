import { drag } from "./drag.js"


const canvas = document.querySelector('.canvas')
const card = document.createElement("section")

card.textContent = "Component"
card.classList = `component component--high`
card.draggable = true
card.id = `component--1`

canvas.appendChild(card)

drag(card)