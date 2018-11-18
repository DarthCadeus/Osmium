class Request {
    constructor(config) {
        this.purpose = config.purpose;
        this.details = config.details;
        this.src = window.location.hostname;
        this.name = config.name;  // to be provided
        this.originator = "app";
    }
}

Request.prototype.post = function() {
    let target = window.opener;
    target.postMessage(this, "*");  // revise out later
}

window.addEventListener("message", receiveAppMessage);

function receiveAppMessage(event) {
    let message = event.message;
    if (message.originator != "app") {
        return;
    }
    if (AppOrigins.indexOf(event.origin) == -1) {
        return;
    }
    if (message.purpose == "file") {
        let target = window.open(message.src, message.name);
        target.postMessage(fs.search(message.purpose.criteria), message.src);
    }
}
