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
        this.target = target;
        this.active = -1;  // no scene is active
    }
}

SceneList.prototype.getScene = function (scene) {
    if(scene == undefined) {
        if(this.active == this.scenes.lenth) {
            return false;
        }
        this.active = this.active + 1;
        return this.scenes[this.active];  // the next one after this one
    }
    if(scene.id) {  // highest priority
        for(let s of this.scenes) {
            if(s.id == scene.id) {
                return s
            }
        }
        return false;
    }
    if(scene.name) {
        for(let s of this.scenes) {
            if(s.name == scene.name) {
                return s
            }
        }
        return false;
    }
};

SceneList.prototype.bindEvent = function (element, event, scene, options) {
    // element, a jquery selector
    // event, an event identifier (click) that works with .on()
    // scene, object, the scene to transfer to (optional)
    // if not provided, will simply be the next
    // otherwise, could be identified with name or id
    // uniqueness is not enforced, but repitition should be avoided
    let cls = this;
    $(element).on(event, function(){
        $(cls.target)
        .empty()
        .append(
            cls
            .getScene(scene)
            .render(options)
        );
    });  // TODO: modify it so it doesn't just throw the error out.
};

SceneList.prototype.start = function (options) {
    $(this.target)
    .empty()
    .append(
        this
        .getScene()
        .render(options)
    )
}
