const listeners = {}

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
        }
    }
})
