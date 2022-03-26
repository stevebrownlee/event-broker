import { ComponentFactory } from "./component.js"
import { EventHub } from "./eventhub.js"
import { Utils } from "./util.js"
import "../node_modules/codemirror/lib/codemirror.js"


const myCodeMirror = CodeMirror(document.querySelector(".canvas--editor"), {
    value: `Component TeamForm {
    responsibility: "Present form for user to create a new team",
    events: [
        {
            name: "teamStateChanged"
            listeners: []
        }
    ]
}
    `,
    mode:  "javascript",
    lineNumbers: false,
    lineWrapping: false
  });

Utils.init()
ComponentFactory.init()
EventHub.init()
