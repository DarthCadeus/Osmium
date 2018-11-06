let appInterface = {
    registry: [],
    update: [],
    register: function(x){
        this.registry.push(x);
        const result = x.renderSmall();
        $(".desktop").append(result);
        $(`div[appname='${x.name}']`).click(function(){
            x.popOpen();
        });
    }
}
