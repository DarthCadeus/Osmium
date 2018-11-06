class AppObject {
    constructor (name, metadata) {
        this.name = name;
        this.metadata = metadata;
    }
}

AppObject.prototype.popOpen = function () {
    let windowObject = $("<div></div>");
    let iframeObject = $("<iframe class='app-container'></iframe>").attr("src", this.metadata.source);
    windowObject.append(iframeObject).dialog({
        title: this.name
    });
    iframeObject[0].contentWindow.document.body.innerHTML = "Hi!"
}

AppObject.prototype.renderSmall = function () {
    const self = this;
    const source = document.getElementById("app-object-template-short").innerHTML;
	const template = Handlebars.compile(source);
	const context = {
		app: this
	};
    let result = template(context);
	return result;
}

class DefaultApp extends AppObject {
    constructor(name, metadata, html, callback) {
        super(name, metadata);
        this.html = html;
        this.callback = callback;
    }
}

DefaultApp.prototype.popOpen = function () {
    let windowObject = $("<div></div>");
    windowObject.append(this.html).dialog({
        title: this.name
    });
    this.callback(this);
}
