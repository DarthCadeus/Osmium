// this js will include all the core support libraries
// first of all, include all the other dependencies
function include(src, type) {
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
        let script = document.createElement("script");
        let source = document.createAttribute("src");
        source.value = src;
        script.setAttributeNode(source);
        document.getElementsByTagName("body")[0].appendChild(script);
        return script;
    }
}

// authenticates if the function is present
function checkFunction(f) {
    try {
        eval(f)
    } catch (err) {
        if (err instanceof ReferenceError || err instanceof TypeError) {
            return false
        }
    }
    return true
}

function checkClass(c) {
    try {
        new eval(c)
    } catch (err) {
        if (err instanceof ReferenceError || err instanceof TypeError) {
            return false
        }
    }
    return true
}

function check(o, t) {
    if(!t) {
        if(o.charAt().toUpperCase() == o.charAt()) {
            t = "class"
        } else {
            t = "function"
        }
    }
    if(t == "class") {
        return checkClass(o)
    } else {
        return checkFunction(o)
    }
}

function demand(f, t) {
    let result;
    const id = setInterval(function() {
        result = check(f, t);
        if(result) {
            clearInterval(id);
            return;
        }else{
            console.log("retrying...")
        }
    }, 50)
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
    include("js/systemEnvironment/aboutPage.js", "js");
    include("js/systemEnvironment/menuBarDropdown.js", "js");

    // load file system
    include("js/fileSystem/fileObject.js", "js");
    include("js/fileSystem/fileSystem.js", "js");
    include("js/fileSystem/fileSystemRenderer.js", "js");

    // load app system
    include("js/appSystem/AppObject.js", "js");
    include("js/appSystem/TrustedAppObject.js", "js");
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
    // include("js/appSupport/Notation/NotationRegister.js", "js");

    // QuizMaster
    include("js/appSupport/QuizMaster/QuizMasterRegister.js", "js");

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
