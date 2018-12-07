class TrustedAppObject extends AppObject {
    constructor(name, metadata, script_url) {
        super(name, metadata)
        this.script_url = script_url;
        this.el = "";
    }
}

TrustedAppObject.prototype.onid = function () {
    let self = this;
    let api = {
        getElement: function (a) {
            // now the namespace is enforced
            let res = $(self.el).find(a)[0];
            res.parentElement = undefined;
            return res;  // oh yes, just you try to get its parent
        },
        populate: function (el) {
            self.el = el;
        },
        debug: function (msg) {
            console.log("Below is app message");
            console.log(msg);
        }
    };
    let plugin = new jailed.Plugin(this.script_url, api);
}

TrustedAppObject.prototype.revert = function () {
    this.popOpen = AppObject.prototype.popOpen;
    this.callback = function(){};
    this.html = "";
};

TrustedAppObject.prototype.popOpen = function () {
    if(this.id == undefined) {
        return;
    }
    let windowObject = $("<div></div>");
    windowObject.append(this.el).dialog({
        title: this.name
    });
}

TrustedAppObject.prototype.refresh = function () {
    this.el = $(this.html);
}
