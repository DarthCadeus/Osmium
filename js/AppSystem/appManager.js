let appInterface = {
    registry: [],
    update: [],
    id_counter: 0,
    register: function(x){
        x.id = ++this.id_counter;
        this.registry.push(x);
        const result = x.renderSmall();
        $(".desktop").append(result);
        $(`div[appname='${x.name}']`).click(function(){
            x.popOpen();
        });
    },
    find: function (id) {
        for (var app of registry) {
            if (app.id == id) {
                return app;
            }
        }
    }
}
