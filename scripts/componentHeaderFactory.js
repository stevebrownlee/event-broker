export const createHeader = (card) => {
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

    return header
}