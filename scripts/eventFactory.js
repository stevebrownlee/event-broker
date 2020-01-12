export const createEventContainer = () => {
    const addEvent = document.createElement("button")
    addEvent.classList = "btn fakeLink"
    addEvent.textContent = "Add Event"
    addEvent.addEventListener("click", e => {
        addEvent.parentNode.contentEditable = true
        addEvent.parentNode.focus()
        addEvent.parentNode.textContent = ""
    })

    return addEvent
}