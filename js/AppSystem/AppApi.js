window.addEventListener("message", receiveAppMessage);

function receiveAppMessage(event) {
    let message = event.message;
    if (message.originator != "app") {
        return;
    }
    if (AppOrigins.indexOf(event.origin) == -1) {
        return;
    }
    if (message.command.purpose == "file") {
        let target = window.open(message.src, message.name);
        // target.postMessage(fs.search(message.purpose.criteria), message.src);
        if (message.command.instruction == "insert") {
            let content = message.command.content;
            let result = confirm(`An app at domain ${message.src} with name ${message.name} is trying to create a new file!`);
            if (result) {
                target.postMessage(false, message.src);
            } else {
                
            }
        }
    }
}
