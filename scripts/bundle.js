'use strict';

const colors = ["red", "crimson", "blueviolet", "dodgerblue", "goldenrod", "firebrick", "fuchsia", "darkcyan", "deeppink", "indianred", "orangered", "olive", "teal", "seagreen"];

const useColors = () => colors.slice();

const connections = new WeakMap();
let broker = null;

const connectComponents = (publisher, subscriber, eventName) => {
    let color = useColors().random();

    if (connections.has(publisher)) {
        color = connections.get(publisher).color;
    }

    const { incoming, outgoing } = drawAnimatedSVGs(publisher, subscriber, eventName, color);

    addPublisherConnection({
        publisher,
        line: outgoing.get("line"),
        mouseover: outgoing.get("mouseover"),
        mouseout: outgoing.get("mouseout"),
        color, eventName
    });

    addSubscriberConnection({
        subscriber, publisher,
        line: incoming.get("line"),
        mouseout: incoming.get("mouseout"),
        mouseover: incoming.get("mouseover"),
        color, eventName
    });
};
const reconnectComponents = component => {
    if (connections.has(component) && connections.get(component).isSubscriber) {
        const lines = [...connections.get(component).lines.values()];

        for (const line of lines) {
            const publisher = line.get("publisher");
            line.get("svg").position();
        }
    }

    for (const eventEl of component.querySelectorAll(".component__publish")) {
        if (connections.has(eventEl) && connections.get(eventEl).isPublisher) {
            const target = connections.get(eventEl);
            target.line.position();
        }
    }
};

const addPublisherConnection = (props) => {
    if (!connections.has(props.publisher)) {
        // TODO: Change value to map
        connections.set(props.publisher, {
            color: props.color,
            event: props.eventName,
            isSubscriber: false,
            isPublisher: true,
            line: props.line,
            mouseout: props.mouseout,
            mouseover: props.mouseover,
            publisher: null
        });
    }
};

const addSubscriberConnection = (props) => {
    if (!connections.has(props.subscriber)) {
        // TODO: Change value to map
        connections.set(props.subscriber, {
            isSubscriber: true,
            isPublisher: false,
            lines: new Set()
        });
    }

    const subLine = new Map();
    subLine.set("svg", props.line);
    subLine.set("color", props.color);
    subLine.set("event", props.eventName);
    subLine.set("publisher", props.publisher);
    subLine.set("mouseout", props.mouseout);
    subLine.set("mouseover", props.mouseover);

    const sub = connections.get(props.subscriber);
    sub.lines.add(subLine);
    sub.isSubscriber = true;
};

const drawAnimatedSVGs = (publisher, subscriber, eventName, color) => {
    publisher.style.backgroundImage = 'url(\'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cG9seWdvbiBwb2ludHM9IjI0LDAgMCw4IDgsMTEgMCwxOSA1LDI0IDEzLDE2IDE2LDI0IiBmaWxsPSJjb3JhbCIvPjwvc3ZnPg==\')';
    publisher.style.backgroundRepeat = 'no-repeat';
    publisher.style.backgroundPosition = "right 2px top 2px";
    publisher.style.backgroundSize = "0.75em 0.75em";

    broker = document.querySelector(".broker");

    const outgoing = new Map();
    outgoing.set("line", null);
    outgoing.set("mouseover", null);
    outgoing.set("mouseout", null);

    if (!connections.has(publisher)) {
        const outgoingProps = drawPublisherToBroker(publisher, eventName, color);
        outgoing.set("line", outgoingProps.outgoingLine);
        outgoing.set("mouseover", outgoingProps.outgoingMouseOver);
        outgoing.set("mouseout", outgoingProps.outgoingMouseOut);
    }

    const incomingProps = drawBrokerToSubscriber(subscriber, publisher, eventName, color);

    const incoming = new Map();
    incoming.set("line", incomingProps.incomingLine);
    incoming.set("mouseover", incomingProps.incomingMouseOver);
    incoming.set("mouseout", incomingProps.incomingMouseOut);

    return { incoming, outgoing }
};

const drawPublisherToBroker = (publisher, eventName, color) => {
    const outgoingLine = new LeaderLine(
        publisher,
        broker,
        {
            dash: { animation: true, gap: 10 },
            showEffectName: "draw",
            path: "fluid",
            color: color,
            startPlug: "disc",
            endPlug: "behind",
            middleLabel: eventName,
            hide: true
        }
    );

    const outgoingMouseOut = e => outgoingLine.hide();
    const outgoingMouseOver = e => outgoingLine.show();

    publisher.addEventListener("mouseover", outgoingMouseOver);
    publisher.addEventListener("mouseout", outgoingMouseOut);

    return { outgoingLine, outgoingMouseOver, outgoingMouseOut }
};

const drawBrokerToSubscriber = (subscriber, publisher, eventName, color) => {
    const incomingLine = new LeaderLine(
        broker,
        LeaderLine.areaAnchor(subscriber, {
            color: "red",
            dash: true,
            size: 3,
            radius: 5,
            fillColor: "rgba(215, 209, 43, 0.2)"
        }),
        {
            dash: { animation: true, gap: 10 },
            color: color,
            path: "fluid",
            middleLabel: eventName,
            hide: true
        }
    );

    const incomingMouseOut = e => incomingLine.hide();
    const incomingMouseOver = e => incomingLine.show();

    publisher.addEventListener("mouseover", incomingMouseOver);
    publisher.addEventListener("mouseout", incomingMouseOut);

    return { incomingLine, incomingMouseOver, incomingMouseOut }
};

const canvas = document.querySelector('.canvas--ui');

const undrag = el => {
    el.firstElementChild.onmousedown = null;
};
const drag = (el) => {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (el.firstElementChild && el.firstElementChild.classList.contains("component__header")) {
        el.firstElementChild.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        const currentLeft = el.offsetLeft + el.offsetWidth;
        const currentTop = el.offsetTop + el.offsetHeight;
        const parentWidth = el.parentNode.offsetWidth - 20;
        const parentHeight = el.parentNode.offsetHeight - 20;

        if (el.offsetTop >= 20 && currentTop <= parentHeight) {
            el.style.top = (el.offsetTop - pos2) + "px";
        } else {
            if (el.offsetTop <= 20) {
                el.style.top = "20px";
            } else {
                el.style.top = `${parentHeight - el.offsetHeight}px`;
            }
        }

        if (el.offsetLeft >= 20 && currentLeft <= parentWidth) {
            el.style.left = (el.offsetLeft - pos1) + "px";
        } else {
            if (el.offsetLeft <= 20) {
                el.style.left = "20px";
            } else {
                el.style.left = `${parentWidth - el.offsetWidth}px`;
            }
        }
    }

    function closeDragElement(e) {
        document.onmouseup = null;
        document.onmousemove = null;
        canvas.focus();
        canvas.blur();
        reconnectComponents(el);
    }
};

const createHeader = (card) => {
    const header = document.createElement("header");
    header.className = "component__header";
    header.textContent = "Component";
    header.contentEditable = true;
    header.addEventListener("blur", function (e) {
        let name = e.target.textContent;
        if (name === "") {
            e.target.textContent = "Component";
        }
    });
    header.addEventListener("dblclick", function (e) {
        const name = e.target.textContent;
        e.target.textContent = name === "Component" ? "" : name;
    });
    header.addEventListener("keypress", function (e) {
        e.target.classList.add("edited");
        if (e.keyCode === 13) {
            if (e.target.textContent === "") {
                e.target.textContent = "Component";
            }
            e.target.blur();
            e.stopPropagation();
            e.preventDefault();
            e.returnValue = false;
            return false
        }
    });

    return header
};

const createDescription = (card) => {
    const description = document.createElement("div");
    description.className = "component__description";
    description.textContent = "Responsibility";

    description.addEventListener("dblclick", function (e) {
        const name = e.target.textContent;
        e.target.textContent = name === "Resposibility" ? "" : name;
        description.contentEditable = true;
    });
    description.addEventListener("keypress", function (e) {
        if (e.keyCode === 13) {
            if (e.target.textContent === "") {
                e.target.textContent = "Resposibility";
            }
            description.contentEditable = false;
            e.target.blur();
            e.stopPropagation();
            e.preventDefault();
            e.returnValue = false;
            return false
        }
    });

    return description
};

const createEventContainer = () => {
    const addEvent = document.createElement("button");
    addEvent.classList = "btn fakeLink";
    addEvent.textContent = "Add Event";
    addEvent.addEventListener("click", e => {
        addEvent.parentNode.contentEditable = true;
        addEvent.parentNode.focus();
        addEvent.parentNode.textContent = "";
    });

    return addEvent
};

let count = 1;

const createPublishArea = (card) => {
    const publish = document.createElement("div");
    publish.className = "component__publish";
    publish.id = `component__publish--${count++}`;
    publish.draggable = false;

    publish.addEventListener("blur", function (e) {
        let name = e.target.textContent;
        if (name === "") {
            e.target.appendChild(createEventContainer());
        }
    });

    publish.addEventListener("keypress", function (e) {
        if (e.keyCode === 13) {
            if (publish.textContent === "") {
                publish.appendChild(createEventContainer());
                publish.draggable = false;
                publish.ondragstart = null;
                undrag(publish);
            } else {
                card.appendChild(createPublishArea(card));

                publish.draggable = true;

                publish.ondragstart = e => {
                    const details = {
                        eventName: publish.textContent,
                        publisher: publish.id
                    };
                    e.dataTransfer.setData("details", JSON.stringify(details));
                };
                drag(publish);

            }
            publish.contentEditable = false;
            publish.blur();
            e.stopPropagation();
            e.preventDefault();
            e.returnValue = false;
            return false
        }
    });
    publish.appendChild(createEventContainer());

    return publish
};

let count$1 = 1;
const canvas$1 = document.querySelector('.canvas');

const ComponentFactory = Object.create(null, {
    init: {
        value: () => {
            const makeComponent = () => {
                const card = document.createElement("section");
                card.classList = `component component--high`;
                card.draggable = true;
                card.id = `component--${count$1}`;
                card.addEventListener("dblclick", e => e.target.focus());

                card.ondragover = e => e.preventDefault();

                card.ondrop = e => {
                    e.preventDefault();
                    const details = JSON.parse(e.dataTransfer.getData("details"));
                    const publisher = document.getElementById(details.publisher).parentNode;
                    let subscriber = null;

                    if (e.target !== publisher) {
                        if (e.target.classList.contains("component")) {
                            subscriber = e.target;
                        }

                        if (
                            e.target.classList.contains("component__description")
                            || e.target.classList.contains("component__header")
                            || e.target.classList.contains("component__publish")
                        ) {
                            // Can't drop on elements of same component
                            if (e.target.parentNode !== publisher) {
                                subscriber = e.target.parentNode;
                            }
                        }
                    }

                    if (subscriber !== null) {
                        connectComponents(
                            document.getElementById(details.publisher),
                            subscriber,
                            details.eventName
                        );
                    }
                };

                card.appendChild(createHeader());
                card.appendChild(createDescription());
                card.appendChild(createPublishArea(card));
                canvas$1.appendChild(card);
                count$1++;

                drag(card);
            };

            const add = document.querySelector("#addComponent");
            add.addEventListener("click", makeComponent);
        }
    }
});

const canvas$2 = document.querySelector('.canvas');

const EventHub = Object.create(null, {
    init: {
        value: () => {
            const eventHub = document.createElement("div");
            eventHub.className = "broker";
            eventHub.textContent = "Hub";

            canvas$2.appendChild(eventHub);
        }
    }
});

const Utils = Object.create(null, {
    init: {
        value: () => {
            if (!("random" in Array.prototype)) {
                Object.defineProperty(Array.prototype, "random", {
                    value: function () {
                        return this[Math.floor(Math.random() * this.length)]
                    },
                    enumerable: true
                });
            }

            document.addEventListener("touchstart", function (event) {
                event.preventDefault();
                var e = new Event("dragstart");
                element.dispatchEvent(e);
            }, false);

            document.addEventListener("touchmove", function (event) {
                event.preventDefault();
                var e = new Event("drag");
                element.dispatchEvent(e);
            }, false);
        }
    }
});

Utils.init();
ComponentFactory.init();
EventHub.init();
