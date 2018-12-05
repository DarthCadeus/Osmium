const DIRECTORY = "directory";
const ROOT = ".";
const TRASH = "t."

function randint (min, max) {
    return Math.floor(Math.random() * (max+1 - min) + min);
}
function choice(list) {
    return list[randint(0, list.length-1)];
}
let random = {
    randint: randint,
    choice: choice
}

class LocalStorageManager {
    constructor(prioritizeCookies) {
        this.prioritizeCookies = prioritizeCookies;
    }
}

LocalStorageManager.prototype.set = function (key, value, exdays) {
    if(exdays) {
        this.setCookie(key, value, exdays);
    } else {
        window.localStorage.setItem(key, value);
    }
};

LocalStorageManager.prototype.get = function (key) {
    const ls = window.localStorage.getItem(key);
    if(ls) return ls;
    return this.getCookie(key);
};

LocalStorageManager.prototype.cancel = function (key) {
    window.localStorage.removeItem(key);
    this.deleteCookie(key);
};

LocalStorageManager.prototype.setCookie = function (key, value, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
};

LocalStorageManager.prototype.getCookie = function (key) {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

LocalStorageManager.prototype.renewCookie = function (key, renew) {
    const step = renew || 30;
    const value = this.getCookie(key);
    if(value == "") return false;
    this.setCookie(key, value, step);
    return true;
};

LocalStorageManager.prototype.deleteCookie = function (key) {
    const value = this.getCookie(key);
    if(value == "") return false;
    this.setCookie(key, value, -1);
};

function join (l1, l2) {
    for(let i = 0; i < l1.length; i++) {
        l2.push(l1[i]);
    }
    return l2;
}


class FileEntity {
	constructor(name, parent, bound) {
		this.name = name;
		this.parent = parent;
		parent.children.push(this);
		this.index = parent.children.length - 1;
		this.children = [];
		this.bound = bound;
	}
}

FileEntity.prototype.isdir = function() {
	return this.type == DIRECTORY;
};

FileEntity.prototype.forEachChild = function(f) {
	let collected_returns = [];
	for(let i = 0; i < this.children.length; i ++) {
		collected_returns.push(f(this.children[i]));
	}
	return collected_returns;
};

FileEntity.prototype.unBind = function() {
	this.parent.children.splice(this.index, 1);
	this.index = undefined;
	this.parent = undefined;
	return this;
};

FileEntity.prototype.bind = function(parent) {
	this.parent = parent;
	parent.children.push(this);
	this.index = parent.children.length - 1;
	return this;
};

FileEntity.prototype.getPath = function() {
	return this.parent.getPath() + "/" + this.name;
}


FileEntity.prototype.match = function(criteria) {
	if (!criteria) {
		return false;
	}
	let objectid_matched = true;  // defaults to true because of return mechanism
	let name_matched = true;
	let type_matched = true;
	if (criteria.selfObjectId) {
		if(this.bound.selfObjectId != criteria.selfObjectId) {
			objectid_matched = false;
		}
	}
	if (criteria.name) {
		if(this.name != criteria.name) {
			name_matched = false;
		}
	}
	if (criteria.type) {
		if(this.bound.type != criteria.type) {
			type_matched = false;
		}
	}
	return objectid_matched && name_matched && type_matched;
}

FileEntity.prototype.search = function (criteria) {
	let searchRes = [];
	this.forEachChild(function(c) {
		if (c.match(criteria)) {
			searchRes.push(c);
		}
		let curSearchRes = c.search(criteria);
		if (curSearchRes != []) {
			searchRes = join(curSearchRes, searchRes);
		}
	});
	return searchRes;
}





const available_icons = ["ai", "avi", "css", "dbf", "doc", "dwg", "exe", "fla", "html", "iso", "js", "json", "mp3", "mp4", "pdf", "png", "ppt", "rtf", "svg", "txt", "xls", "xml", "zip", "directory"];
const icon_redirect = {
	"docx": "doc",
	"pptx": "ppt",
	"xlsx": "xls",
	"md": "rtf",
	"xhtml": "html",
};

class BoundFileObject {
	constructor (config) {
		this.url = config.url;
		this.size = config.size;
		this.createdAt = config.createdAt;
		this.modifiedAt = config.modifiedAt;
		this.user = config.user;
		this.permissions = config.permit;
		this.type = config.type;
		this.objectId = config.objectId;
		this.selfObjectId = config.selfObjectId;
		if(available_icons.indexOf(this.type) != -1) {
			this.icon = "assets/logos/File icons/"+this.type+".png";
		} else if (icon_redirect[this.type]) {
			this.icon = "assets/logos/File icons/"+icon_redirect[this.type]+".png";
		} else {
			this.icon = "assets/logos/File icons/generic.png";
		}
		this.config = config;
		this.source = config.source;
	}
}

BoundFileObject.prototype.permit = function (user) {
	if(this.permissions.user.id == user.id) return true;
	return false;
};

class FileSystem {
	constructor() {
		this.originNode = {
			name: ROOT,
			type: DIRECTORY,
			children: [],
			forEachChild: FileEntity.prototype.forEachChild,
			getPath: () => {ROOT},
			search: FileEntity.prototype.search
		}  // bypass the parent restrictions
		this.trashNode = {
			name: TRASH,
			type: DIRECTORY,
			children: [],
			forEachChild: FileEntity.prototype.forEachChild,
			getPath: () => {TRASH},
			search: FileEntity.prototype.search
		}  // bypass the parent restrictions
	}
}

FileSystem.prototype.addFile = function(name, parent, bound) {
	return new FileEntity(name, parent, bound);
};

FileSystem.prototype.removeFile = function(name, parent) {
	let removed = false;
	parent.forEachChild(function(x) {
		if(x.name == name) {
			x.bind(this.trashNode);
			removed = true;
		}
	});
	return removed;
};

FileSystem.prototype.forEachChild = function(f) {
	this.originNode.forEachChild(f);
}

FileSystem.prototype.search = function(criteria) {
	return this.originNode.search(criteria);
}

let fs = new FileSystem();

function initFileSystem() {
    // fetch files from server

    // create a query to the database
    const query = new AV.Query("FileManager");

    // get all files from the query
    query.find().then(function(allFiles){


        let files = [];

        // for every file entry in the database
        allFiles.forEach(function(file) {

            files.push(file)

        });

        files.sort(function(a, b) {
            return a.get("updatedAt") - b.get("updatedAt");
        });

        for(let file of files) {
            // get the primitive object stored in the cloud
            const sourceObject = file.get("FileObject");

            // check if the user ids agree
            // cannot have cross-user access of files
            if(sourceObject.user.id == AV.User.current().id) {
                loadFile(sourceObject, file, query);
            }
        }


    }, (err) => {
        console.error(err);
    });
}


let CUR_DIR = fs.originNode;

$(function(){
    // create application
    let app = new DefaultApp("Path Finder", {
        icon: "assets/logos/apps/pathfinder.png"
    }, $([
        "<div class='pathfinder'>",
        "   <div class='top-toolbar'>",
        "       <button class='upload-button'>",
        "           upload files",
        "       </button>",
        "       <button class='new-folder'>",
        "           new folder",
        "       </button>",
        "       <button class='go-back'>",
        "           back",
        "       </button>",
        "   </div>",
        "   <hr>",
        "   <div class='files-area'>",
        "   </div>",
        "   <div class='display-area'",
        "   </div>",
        "</div>"


    ].join("\n")), function(a) {
        handleFileUpload(a);  // source: handle file upload.js
        $(".new-folder").click(handleNewFolder);  // source: handle new folder.js
        $(".go-back").click(handleBackButton);
    });

    // register the application
    appInterface.register(app);
});

$(initFileSystem);  // source: init file system.js


function handleFileUpload(a) {

    // render the file system
    render(fs, ".files-area");


    $(".pathfinder .upload-button").click(function(){


        // create the dialog
        popDialog([
            "<div class='uploadDialog'>",
            "   <input type='file' class='fileUpload'>",
            "   <button class='fileUploadConfirm'>upload</button>",
            "</div>"
        ].join("\n"), {title: "select file"});


        // attach the event listener
        $(".uploadDialog .fileUploadConfirm").click(function(){

            // get local file
            const localFile = $(".uploadDialog .fileUpload")[0].files[0];

            // get name of local file
            let name = $(".uploadDialog .fileUpload").val();
            // separate the name proper from path
            name = name.split("\\")[name.split("\\").length-1];

            // create a leancloud file object
            const file = new AV.File(name, localFile);

            // extend the leancloud file manager class
            const FileManager = AV.Object.extend("FileManager");
            // create a new instance of a file record
            const f = new FileManager();


            // save the local file to the server
            file.save().then(function(fobj){

                // create the file object to be stored in the cloud
                fileobject = {
                    name: name,
                    type: name.split(".")[name.split(".").length-1],
                    url: fobj.url(),
                    user: AV.User.current(),
                    objectId: fobj.get("objectId"),
                    size: fobj.attributes.metaData.size,
                    parent: "fs.originNode"
                };  // everything stored on the cloud is primitive


                // set it and save
                f.set("FileObject", fileobject);
                f.save().then(function(){console.log("success")}, function(err){console.error(err)});

            }, function(err) {
                console.error(err);
            });
        });
    });
}


function loadFile(sourceObject, file, query) {

    // create the bound file object
    let fileObject = new BoundFileObject({
        url: sourceObject.url,
        size: sourceObject.size,
        createdAt: file.get("createdAt"),
        modifiedAt: file.get("updatedAt"),
        user: sourceObject.user,
        permit: {
            user: sourceObject.user
        },
        type: sourceObject.type,
        objectId: sourceObject.objectId,  // object id of the file object
        selfObjectId: file.get("objectId"),
        source: sourceObject
    });

    // // TODO: expand this
    // if (sourceObject.type == "png" || sourceObject.type == "jpg") {
    //     let file = AV.File.createWithoutData('552e0a27e4b0643b709e891e');
    //     let thumbnailUrl = file.thumbnailURL(100, 200);
    //     fileObject.icon = thumbnailUrl;
    // }

    let parent;

    // see if to use the default
    if (sourceObject.parent == "fs.originNode" || !sourceObject.parent) {
        parent = fs.originNode;

        // create new file entity
        let fileEntity = new FileEntity(sourceObject.name, parent, fileObject);
    } else {

        // if selfObjectId is specified
        if (sourceObject.parent.selfObjectId) {

            // search for parent in the file system
            parent = fs.search({
                selfObjectId: sourceObject.parent.selfObjectId
            });

            // is parent found
            if(parent.length == 0) {

                // parent is not found
                console.error(`No parent found for node ${fileObject.selfObjectId}(${sourceObject.name})`);

            } else {

                // is only one parent found
                if(parent.length > 1) {

                    // multiple parents found
                    console.warn(`Found multiple parents for ${fileObject.selfObjectId}(${sourceObject.name})`);

                }

                // set the parent to the first, and hopefully only, parent object found
                parent = parent[0];


                // create new file entity
                let fileEntity = new FileEntity(sourceObject.name, parent, fileObject);


            }

        } else {

            // no object id is specified
            console.error(`No object id specified for parent of node ${fileObject.selfObjectId}(${sourceObject.name})`);

        }
    }
}


function handleBackButton() {
    if(!CUR_DIR.parent) {
        $(this).addClass("hidden");
        console.error("No parent directory to back")
        return false;
    } else {
        CUR_DIR = CUR_DIR.parent;
        render(CUR_DIR, $(".files-area"));
        return true;
    }
}

function onRenderHandleBackButton(button) {
    if(!button) {
        button = $(".go-back");
    }
    if(CUR_DIR.parent) {
        $(button).removeClass("hidden");
        return true;
    } else {
        $(button).addClass("hidden");
        return false;
    }
}

function handleNewFolder(){

    // extend the leancloud file manager class
    const FileManager = AV.Object.extend("FileManager");
    // create an instance of the file manager class
    const f = new FileManager();

    // prompt the user for the name of this folder
    const name = prompt("Foler name?", "untitled folder");  // TODO: revise this out

    // create the primitive file object, in this case, a directory
    let fileobject;
    fileobject = {
        name: name,
        type: "directory",
        user: AV.User.current(),
        parent: "fs.originNode",
        children: []
    };

    // set the primitive object
    f.set("FileObject", fileobject);

    // save the object to the cloud
    f.save().then(function(cloudf) {

        // get the entry in the database
        const sourceObject = cloudf.get("FileObject");

        // create the bound file object
        const bound = new BoundFileObject({
            createdAt: cloudf.get("createdAt"),
            modifiedAt: cloudf.get("modifiedAt"),
            user: sourceObject.user,
            permit: {
                user: sourceObject.user
            },
            type: "directory",
            selfObjectId: cloudf.get("objectId")
        });

        // create the file entity
        let folder = new FileEntity(name, fs.originNode, bound);

        // set its children to be the children derived from the cloud
        folder.children = sourceObject.children;

        // re-render the file system
        render(fs, ".files-area");
    }, function(err) {
        console.log(err);
    });
}




$(function() {
    let app = new DefaultApp("Notation", {
        icon: "assets/logos/apps/noted.png"
    }, $([
        "<div class='notation'>",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "</div>"
    ].join("\n")), function (a) {

    });

    appInterface.register(app);
})


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

DefaultApp.prototype.popOpen = function (sceneMode) {
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

class DefaultScenedApp extends AppObject {
    constructor(name, metadata) {
        super(name, metadata);
    }
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


AppObject.prototype.getElement = function (a) {
    // now the namespace is enforced
    let res = $(this.el).find(a)[0];
    res.parentElement = undefined;
    return res;  // oh yes, just you try to get its parent
};

function generate_api(id) {
    return {
        getElement: appInterface.find(id).getElement
    };
}


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



let renderRegister = {
	registered: [],
	register: function (f) {
		this.registered.push(f);
	}
}

renderRegister.register(onRenderHandleBackButton);

function render(node, target) {
	$(target).empty();
	node.forEachChild(function(x) {
		let element = $(x.renderSmall());
		$(element).draggable({
			containment: "parent"
		});
		if(x.bound.type == "directory") {
			$(element).droppable({
				drop: function(event, ui) {
					let targ = fs.search({selfObjectId: ui.draggable.attr("objectid")});
					if(targ.length == 0) {
						console.error("no entity with the object id found");
					} else {
						if(targ.length > 1)
						console.warn("multiple entities with a single id found");
						targ[0].unBind();
						targ[0].bind(x);
						render(node, target);

						let sourceObject = targ[0].bound.source;
						sourceObject.parent = {
							selfObjectId: x.bound.selfObjectId
						};

						console.log(sourceObject);
						let f = AV.Object.createWithoutData('FileManager', targ[0].bound.selfObjectId);
						f.set("FileObject", sourceObject);
						f.save().catch(function(err){
							console.error(err);
						});

					}
				}
			});
			$(element).click(function(){
				CUR_DIR = x;
				render(x, target);
			})
		}
		$(target).append(element);
		let collectedReturns = [];
		for(let func of renderRegister.registered) {
			collectedReturns.push(func());
		}
		return collectedReturns;
	})
}

$(function(){
	FileEntity.prototype.renderSmall = function () {
		const source = document.getElementById("file-entity-template-short").innerHTML;
		const template = Handlebars.compile(source);
		const context = {
			entity: this
		};
		let element = template(context);
		return element;
	}

	FileEntity.prototype.renderMeta = function () {
		const source = document.getElementById("file-entity-template-metadata").innerHTML;
		const template = Handlebars.compile(source);
		const context = {
			entity: this,
			path: this.getPath(),
			permission: this.bound.permit(SYSENV.curUser)
		};
		return template(context);
	}
});




// this js will include all the core support libraries
// first of all, include all the other dependencies
function include(src, type) {
    // return;  // hack: fix
    // had to work out all the jquery
    // or else it will not allow the scripts to be loaded this way
    // no jquery is used because jquery blocks this
    if (!type) {
        if(src.endsWith("css")) type = "css";
        else if(src.endsWith("js")) type = "js";
        else {
            throw("Type undefined and undeducible")
            return
        }
    }
    if (type == "css") {
        let link = document.createElement("link");
        let rel = document.createAttribute("rel");
        rel.value = "stylesheet";
        link.setAttributeNode(rel);
        let href = document.createAttribute("href");
        href.value = src;
        link.setAttributeNode(href);
        document.getElementsByTagName("head")[0].appendChild(link);
        return link;
    }else if (type == "js") {
        return;  // hack: fix
        let script = document.createElement("script");
        let source = document.createAttribute("src");
        source.value = src;
        script.setAttributeNode(source);
        document.getElementsByTagName("body")[0].appendChild(script);
        return script;
    }
}

// internal libraries
include("js/utils.js", "js");
include("js/SceneManager.js", "js");

function loadMainOS() {
    // include the rest of the dependencies

    // load styles
    include("css/main-ui.css", "css");
    include("css/app-system.css", "css");

    // authenticate
    // include("js/systemEnvironment/authService.js", "js");

    // load system services
    include("js/systemEnvironment/contextMenu.js", "js");
    include("js/systemEnvironment/menuBarDropdown.js", "js");

    // load file system
    include("js/fileSystem/fileObject.js", "js");
    include("js/fileSystem/fileSystem.js", "js");
    include("js/fileSystem/fileSystemRenderer.js", "js");

    // load app system
    include("js/appSystem/AppObject.js", "js");
    include("js/appSystem/appManager.js", "js");

    // load default apps

    // pathFinder
    include("js/appSupport/PathFinder/initFileSystem.js", "js");
    include("js/appSupport/PathFinder/loadFile.js", "js");
    include("js/appSupport/PathFinder/handleNewFolder.js", "js");
    include("js/appSupport/PathFinder/handleFileUpload.js", "js");
    include("js/appSupport/PathFinder/handleBackButton.js", "js");
    include("js/appSupport/PathFinder/PathFinderRegister.js", "js");

    // notation
    include("js/appSupport/Notation/NotationRegister.js", "js");

    // load js styling
    include("js/systemEnvironment/backgroundPictureService.js", "js")
    include("js/systemEnvironment/dynamicStyle.js", "js");
}

function loadBootOS() {
    include("css/auth-service.css", "css");
    include("js/systemEnvironment/cookieNotification.js", "js");
    const authService = include("js/systemEnvironment/authService.js", "js");
    // const authServiceStyling;
}

loadBootOS();


function projectCookies(){
    $(".cookie").tooltip({
        content: function() {
            const element = $(this);
            if(element.attr("ctitle")) {
                return element.attr("ctitle");
            } else {
                return "this uses cookies!"
            }
        }
    });
}

function alertCookies() {
    let frame = $(
        [
            "<p class='cookie-note'>",
            "   This website uses cookies! Each time you see a 'remember me' or 'remember me for x days' option, it uses cookies! Do <b>not</b> choose the options if you do not wish to accept!",
            "<button class='close'>X</button>",
            "</p>"
        ].join("\n"));
    $("body").append(frame);
    $(".cookie-note .close").click(function(){
        $(frame).remove();
    });
}

$(projectCookies);
$(alertCookies);


const DESKTOPS = 9;

$(".desktop").css({
    "background-image": `url(assets/default_backgrounds/${random.randint(1, DESKTOPS)}.jpg)`
});

function selectDesktop(locale) {
    const source = document.getElementById("background-entity-template").innerHTML;
	const template = Handlebars.compile(source);
    let context;
    let choice;
    for (let i = 1; i <= DESKTOPS; i++) {
    	context = {
    		image: {
                image: `assets/default_backgrounds/${i}.jpg`,
                label: `${i}`
            }
    	};
        $(locale).find(".background-image-space").append(template(context));
    }
}

function setDesktop(id) {
    $(".desktop").css({
        "background-image": `url(assets/default_backgrounds/${id}.jpg)`
    });
}


// remain empty
// this was originally conceived of as a method to attach context menus
// but since jquery offers a .contextmenu() solution, this shall remain empty


function center(element) {

}
function centerAll() {}


$(".desktop").contextmenu(function(e){
    e.preventDefault();
});


let registry = [];

registry.register = function (f) {
    this.push(f);
}

registry.register(selectDesktop);

$(".system-icon img").click(function () {
    $(this).toggleClass("active")
    $(".extended-system-space").toggleClass("hidden");
    $(".extended-system-space").children().each(function () {
        $(this).empty();
    });
    for(let registered of registry) {
        registered($(".extended-system-space"));
    }
});

// hacks to fix
registry.register(logOutButton);


const ls = new LocalStorageManager(false)


function lcInit() {
	if(ls.get("appKey") && ls.get("appId")) {
		leancloudInit(ls.get("appId"), ls.get("appKey"));
		logIn();
		return;
	}
	const options_redundant = {
		title: "link to a database!",
		beforeClose: function(event, ui) {
			return false;  // cancel the close event (for now)
		},
		open: function(event, ui) {
			$(".authServicePopUp")
		},
		modal: true
	}
	let frame = $([
		"<div class='authServicePopUp'>",
		"	<div class='description'>",
		"		<h3 title='we are so poor we cannot afford a professional unlimited database!'> We respect your privacy! </h3>",
		"		<p>In order for this sytem to function, we need to ask you to link this application to a database created with <a href='https://leancloud.cn'>leancloud</a>.",
		"		We do not supply a database because we respect your privacy. If you want to create your own, we are all for it! ",
		"		However, if you simply wish to try this out, it is okay to use our trial database. Simply click <button class='useDefault'>this button</button>!",
		"		If you so wish, be warned that there is a limit to requests set by the provider. </p>",
		"		<div>Id: <input class='appId' place='app id'><br/>Key: <input type='password' class='appKey' place='app key'><br/><input type='checkbox' class='rememberMe'>remember me<br/><input type='checkbox' class='rememberMeTen'>remember me for ten days<br/><button class='useCustom'>confirm</button></div>", // it doesn't really use cookies (local storage), but hey!
		"	</div>",
		"</div>"
	].join("\n"));


	$("body").append(frame);
	$(".authServicePopUp p .useDefault").click(function(){
		if($(".authServicePopUp div .rememberMe").val()) {
			ls.set("appId", "MDPFnMc2dUwuywGmueDNyOft-gzGzoHsz");
			ls.set("appKey", "LSrD2F64K8NEnQftI8vkxEfT");
		} else if ($(".authServicePopUp div .rememberMeTen").val()) {
			ls.set("appId", "MDPFnMc2dUwuywGmueDNyOft-gzGzoHsz", 10);
			ls.set("appKey", "LSrD2F64K8NEnQftI8vkxEfT", 10);
		}
		leancloudInit();
		frame.remove();
		logIn();
	});
	$(".authServicePopUp div .useCustom").click(function(){
		if($(".authServicePopUp p .rememberMe").val()) {
			ls.set("appId", $(".authServicePopUp div .appId").val());
			ls.set("appKey", $(".authServicePopUp div .appKey").val());
		} else if ($(".authServicePopUp div .rememberMeTen").val()) {
			ls.set("appId", $(".authServicePopUp div .appId").val(), 10);
			ls.set("appKey", $(".authServicePopUp div .appKey").val(), 10);
		}
		leancloudInit($(".authServicePopUp div .appId").val(), $(".authServicePopUp div .appKey").val());
		frame.remove();
		logIn();
	});
}

lcInit();

function logIn() {
	if(ls.get("username") || ls.get("password")) {
		AV.User.logIn(ls.get("username"), ls.get("password")).then(function () {
			frame.remove();
			$(".authmode").removeClass("authmode");
			loadMainOS();
		}, function (err) {
			console.error(err);
		});
	}
	let frame = $([
		"<div class='description'>",
		"	<h3> Please Login! </h3>",
		"	<p> Although you have chosen a database, you have not yet logged in. There might be multiple users, after all! </p>",
		"	<div> <input type='text' class='userName' placeholder='username' required> <br/><input type='text' class='email' placeholder='email' required> <br/><input type='password' class='passWord' placeholder='password' required> <br/><input type='checkbox' class='rememberMe'>remember me<br/><input type='checkbox' class='rememberMeTen'>remember me for ten days<br/><button class='logIn'>log in</button> <button class='register'>Register</button> </div>",
		"</div>"
	].join("\n"));
	$("body").append(frame);
	projectCookies();
	$(".description div .register").click(function(){
		let user = new AV.User();
		user.setUsername($(".description div .userName").val());
		user.setPassword($(".description div .passWord").val());
		user.setEmail($(".description div .email").val());
		user.signUp().then(function(){
			if($(".description div .rememberMe").val()) {
				ls.set("username", $(".description div .userName").val());
				ls.set("password", $(".description div .passWord").val());
			} else if($(".description div .rememberMeTen").val()) {
				ls.set("username", $(".description div .userName").val(), 10);
				ls.set("password", $(".description div .passWord").val(), 10);
			}
			frame.remove();
			loadMainOS();
		}, function(err){
			console.log(err);
		})
	});
	$(".description div .logIn").click(function(){
		AV.User.logIn($(".description div .userName").val(), $(".description div .passWord").val()).then(function(){
			if($(".description div .rememberMe").val()) {
				ls.set("username", $(".description div .userName").val());
				ls.set("password", $(".description div .passWord").val());
			} else if($(".description div .rememberMeTen").val()) {
				ls.set("username", $(".description div .userName").val(), 10);
				ls.set("password", $(".description div .passWord").val(), 10);
			}
			frame.remove();
			$(".authmode").removeClass("authmode");
			loadMainOS();
		}, function(err){
			console.log(err);
		})
	});
}
//
// let authService = {
// 	curUser: AV.User.current()
// }

function logOutButton(x) {
	console.log("Hi")
	x.find(".logout-space").append($("<button class='logout'>Log out</button>"));
	$(".logout").click(function(){
		AV.User.logOut();
		ls.cancel("username");
		ls.cancel("password");
		location.reload();
	})
}


// internal
// let SYSENV = {
// 	curUser: authService.curUser
// }




function popDialog(html, options) {
    $(html).dialog(options);
}

function leancloudInit(id, key) {
    const defaultId = "MDPFnMc2dUwuywGmueDNyOft-gzGzoHsz";
    const defaultKey = "LSrD2F64K8NEnQftI8vkxEfT";
    if(!id || !key) {
        AV.init({
            appId: defaultId,
            appKey: defaultKey
        });
    } else {
        AV.init({
            appId: id,
            appKey: key
        });
    }
}
