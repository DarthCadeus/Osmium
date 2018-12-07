
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
