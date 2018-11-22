class Scene {
    constructor(source, options, name, id) {
        this.name = name; // optional
        this.src = source;
        this.template = Handlebars.compile(this.src);
        this.options = options;  // technically optional
        this.id = id;  // id is optional
    }
}

Scene.prototype.render = function (options) {
    let context = options || this.options;
    let element = this.template(context);
    return element;
};

Scene.prototype.updateSource = function (source) {
    this.src = source;
    this.template = Handlebars.compile(this.src);
};

class SceneList {
    constructor (scenes, target) {
        this.scenes = scenes;  // list of scenes
    }
}
