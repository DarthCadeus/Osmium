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
        populate (el) {
            self.el = $(el);  // hopefully self.el is unreadable by the plugin
            self.el = unbind(self.el[0]);
        },
        debug (msg) {
            console.log("Below is app message");
            console.log(msg);
        },
        addEventListener (sel, event, code) {
            if(!code) {
                code = event;
                event = "click";
            }
            let el;
            if (self.el.is(sel)) {
                el = self.el;
            } else {
                el = self.el.find(sel);
            }
            console.log(el)
            let sub_api = {
                getHtml() {
                    return this.el[0].outerHTML;
                },
                debug (msg) {
                    console.log("Below is app message");
                    console.log(msg);
                }
            }
            $(el).on(event, function () {
                let plugin = new jailed.DynamicPlugin(code + "\napplication.disconnect();", api);
            });
        }
    };
    let plugin = new jailed.Plugin(this.script_url, api);
    this.plugin = plugin;
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
