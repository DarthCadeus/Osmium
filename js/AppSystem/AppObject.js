class AppObject {
    constructor (name, metadata) {
        this.name = name;
        this.metadata = metadata;
        this.id = undefined;  // unassigned
    }
}

AppObject.prototype.onid = function(){}

AppObject.prototype.popOpen = function () {
    if(this.id == undefined) {
        return;
    }
    let windowObject = $("<div></div>");
    let iframeObject = $(`<iframe class="app-container" id="app-${this.id}"></iframe>`).attr("src", this.metadata.source);
    windowObject.append(iframeObject).dialog({
        title: this.name
    });
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
        // does not need to worry about namespaces
        // apps registered with DefaultApp have to be default
        // therefore, their namespaces are manageable
        // no class prefix is needed!
        this.el = $(this.html);
    }
}

DefaultApp.prototype.popOpen = function (sceneMode) {
    if(this.id == undefined) {
        return;
    }
    let windowObject = $("<div></div>");
    windowObject.append(this.el).dialog({
        title: this.name
    });
    this.callback(this);
}

DefaultApp.prototype.refresh = function () {
    this.el = $(this.html);
}

class DefaultScenedApp extends AppObject {
    constructor(name, metadata) {
        super(name, metadata);
    }
}
