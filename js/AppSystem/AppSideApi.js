class Request {
    constructor(config) {
        this.command = config.command;
        this.src = window.location.hostname;
        this.name = config.name;  // to be provided
        this.originator = "app";
    }
}

Request.prototype.post = function() {
    let target = window.opener;
    target.postMessage(this, "*");  // revise out later
}
