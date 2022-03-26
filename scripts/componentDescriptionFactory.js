export const createDescription = (card) => {
    const description = document.createElement("div")
    description.className = "component__description"
    description.textContent = "Responsibility"

    description.addEventListener("dblclick", function (e) {
        const name = e.target.textContent
        e.target.textContent = name === "Resposibility" ? "" : name
        description.contentEditable = true
    })
    description.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            if (e.target.textContent === "") {
                e.target.textContent = "Resposibility"
            }
            description.contentEditable = false
            e.target.blur()
            e.stopPropagation()
            e.preventDefault()
            e.returnValue = false
            return false
        }
    })

    return description
}