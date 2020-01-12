export const Utils = Object.create(null, {
    init: {
        value: () => {
            Object.defineProperty(Array.prototype, "random", {
                value: function () {
                    return this[Math.floor(Math.random() * this.length)]
                },
                enumerable: true
            })
        }
    }
})
