const canvas = document.querySelector('.canvas')

export const drag = (elmnt) => {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0

    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown
    }

    function dragMouseDown(e) {
        e = e || window.event
        e.preventDefault()
        // get the mouse cursor position at startup:
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag

    }

    function elementDrag(e) {
        e = e || window.event
        e.preventDefault()

        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY


        console.log(elmnt.offsetLeft + elmnt.offsetWidth, elmnt.parentNode.offsetWidth)
        const currentLeft = elmnt.offsetLeft + elmnt.offsetWidth
        const currentTop = elmnt.offsetTop + elmnt.offsetHeight
        const parentWidth = elmnt.parentNode.offsetWidth - 20
        const parentHeight = elmnt.parentNode.offsetHeight - 20


        if (elmnt.offsetTop >= 20 && currentTop <= parentHeight) {
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px"
        } else {
            if (elmnt.offsetTop <= 20) {
                elmnt.style.top = "20px"
            } else {
                elmnt.style.top = `${parentHeight - elmnt.offsetHeight}px`
            }
        }


        if (elmnt.offsetLeft >= 20 && currentLeft <= parentWidth) {
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px"
        } else {
            if (elmnt.offsetLeft <= 20) {
                elmnt.style.left = "20px"
            } else {
                elmnt.style.left = `${parentWidth - elmnt.offsetWidth}px`
            }
        }



    }

    function closeDragElement (e) {
        console.log("closeDragElement")
        document.onmouseup = null
        document.onmousemove = null
        canvas.focus()
        canvas.blur()
    }
}

