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

DefaultApp.prototype.popOpen = function () {
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

class TrustedAppObject extends DefaultApp {
    constructor(name, metadata, html, callback) {
        super(name, metadata, html, callback);
        this.developer = this.metadata.developer;
        this.source = this.metadata.source;  // as a fallback
        this.classes = $(this.el)[0].className;
    }
}

TrustedAppObject.prototype.revert = function () {
    this.popOpen = AppObject.prototype.popOpen;
    this.callback = function(){};
    this.html = "";
};

TrustedAppObject.prototype.onid = function () {
    $(this.el)[0].className = [];
    for(let i of this.classes) {
        $(this.el)[0].className.push(String(this.id)+"-"+i);
    }
};

class IntegratedAppObject extends DefaultApp {
    constructor(name, metadata, html, callback) {
        // it is absolutely vital
        // to have a classname for the container
        // and even more so
        // to make clear the namespace
        // this will not be provided by this API
        // because I am too lazy
        // the app database
        // will contain constructors for these objects
        // and some event stuff
        super(name, metadata, html, callback);
        this.developer = this.metadata.developer;
        this.source = this.metadata.source;  // as a fallback
        this.target = this.metadata.target;
        this.classes = $(this.el)[0].className;
    }
}

IntegratedAppObject.prototype.popOpen = function() {
    if(this.id == undefined) {
        return;
    }
    $(target).append(this.el);
}

IntegratedAppObject.prototype.withDraw = function () {
    $(this.el).remove();
}

IntegratedAppObject.prototype.revert = function () {
    this.popOpen = TrustedAppObject.prototype.popOpen;
    this.revert = TrustedAppObject.prototype.revert;
};

IntegratedAppObject.prototype.onid = TrustedAppObject.prototype.onid;
