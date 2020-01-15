import { reconnectComponents } from "./connections.js"

const canvas = document.querySelector('.canvas')

export const undrag = el => {
    el.firstElementChild.onmousedown = null
}
export const drag = (el) => {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0

    if (el.firstElementChild && el.firstElementChild.classList.contains("component__header")) {
        el.firstElementChild.onmousedown = dragMouseDown
    }

    function dragMouseDown(e) {
        e = e || window.event
        e.preventDefault()

        pos3 = e.clientX
        pos4 = e.clientY

        document.onmouseup = closeDragElement
        document.onmousemove = elementDrag
    }

    function elementDrag(e) {
        e = e || window.event
        e.preventDefault()

        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY

        const currentLeft = el.offsetLeft + el.offsetWidth
        const currentTop = el.offsetTop + el.offsetHeight
        const parentWidth = el.parentNode.offsetWidth - 20
        const parentHeight = el.parentNode.offsetHeight - 20

        if (el.offsetTop >= 20 && currentTop <= parentHeight) {
            el.style.top = (el.offsetTop - pos2) + "px"
        } else {
            if (el.offsetTop <= 20) {
                el.style.top = "20px"
            } else {
                el.style.top = `${parentHeight - el.offsetHeight}px`
            }
        }

        if (el.offsetLeft >= 20 && currentLeft <= parentWidth) {
            el.style.left = (el.offsetLeft - pos1) + "px"
        } else {
            if (el.offsetLeft <= 20) {
                el.style.left = "20px"
            } else {
                el.style.left = `${parentWidth - el.offsetWidth}px`
            }
        }
    }

    function closeDragElement(e) {
        document.onmouseup = null
        document.onmousemove = null
        canvas.focus()
        canvas.blur()
        reconnectComponents(el)
    }
}
