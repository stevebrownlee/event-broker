export const Utils = Object.create(null, {
    init: {
        value: () => {
            if (!("random" in Array.prototype)) {
                Object.defineProperty(Array.prototype, "random", {
                    value: function () {
                        return this[Math.floor(Math.random() * this.length)]
                    },
                    enumerable: true
                })
            }

            document.addEventListener("touchstart", function (event) {
                event.preventDefault()
                var e = new Event("dragstart")
                element.dispatchEvent(e)
            }, false)

            document.addEventListener("touchmove", function (event) {
                event.preventDefault()
                var e = new Event("drag")
                element.dispatchEvent(e)
            }, false)
        }
    }
})
