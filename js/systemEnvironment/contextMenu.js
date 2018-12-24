class ContextMenuItem {
    constructor (name, callbacks) {
        this.name = name;
        this.callbacks = callbacks;  // function or list of functions
    }
}

let contextMenuRegister = {
    contextMenu: $("<div class='context-menu'></div>"),
    contents: [],
    active: false,
    register(ctxMenuItem) {
        this.contents.push(ctxMenuItem)
    },
    render() {
        this.contextMenu = $("<div class='context-menu'></div>");
        for (let menuItem of this.contents) {
            this.contextMenu.append($(`<div class='context-menu-item'>${menuItem.name}</div>`).click(function(event) {
                if(menuItem.callbacks instanceof Array) {
                    for (let callback of menuItem.callbacks) {
                        callback();
                    }
                } else {
                    menuItem.callbacks();
                }
            }));
        }
        return this.contextMenu;
    }
}

$(".desktop").contextmenu(function(e){
    e.preventDefault();
    let ctxMenu = contextMenuRegister.render();
    contextMenuRegister.active = true;  // render may not mean activating
    $("body").append(ctxMenu);
});

$("body").click(function () {
    if (contextMenuRegister.active) {
        $(".context-menu").remove();
        contextMenuRegister.active = false;
    }
});
