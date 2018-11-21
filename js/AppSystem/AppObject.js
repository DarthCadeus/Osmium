class AppObject {
    constructor (name, metadata) {
        this.name = name;
        this.metadata = metadata;
        this.id = undefined;  // unassigned
    }
}

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
    }
}

DefaultApp.prototype.popOpen = function () {
    if(this.id == undefined) {
        return;
    }
    let windowObject = $("<div></div>");
    windowObject.append(this.html).dialog({
        title: this.name
    });
    this.callback(this);
}

class TrustedAppObject extends DefaultApp {
    constructor(name, metadata, html, callback) {
        super(name, metadata, html, callback);
        this.developer = this.metadata.developer;
        this.source = this.metadata.source;  // as a fallback
    }
}

TrustedAppObject.prototype.revert = function () {
    this.popOpen = AppObject.prototype.popOpen;
    this.callback = function(){};
    this.html = "";
};

class IntegratedAppObject extends DefaultApp {
    constructor(name, metadata, html, callback) {
        super(name, metadata, html, callback);
        this.developer = this.metadata.developer;
        this.source = this.metadata.source;  // as a fallback
        this.target = this.metadata.target;
        this.el = $(this.html);
    }
}

IntegratedAppObject.prototype.popOpen = function() {
    if(this.id == undefined) {
        return;
    }
    $(target).append(this.e);
}

IntegratedAppObject.prototype.withDraw = function () {
    $(this.el).remove();
}

IntegratedAppObject.prototype.revert = function () {
    this.popOpen = TrustedAppObject.prototype.popOpen;
    this.revert = TrustedAppObject.prototype.revert;
};
