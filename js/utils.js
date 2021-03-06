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

function unbind(el) {
    // code from StackOverflow (Ben D)
    let new_element = $(el.cloneNode(true));

    // rest is original
    const listOfBannedAttributes = [
        "onabort",
        "onafterprint",
        "onbeforeprint",
        "onbeforeunload",
        "onblur",
        "oncanplay",
        "oncanplaythrough",
        "onchange",
        "onclick",
        "oncontextmenu",
        "oncopy",
        "oncuechange",
        "oncut",
        "ondblclick",
        "ondrag",
        "ondragend",
        "ondragenter",
        "ondragleave",
        "ondragover",
        "ondragstart",
        "ondrop",
        "ondurationchange",
        "onemptied",
        "onended",
        "onerror",
        "onfocus",
        "onhashchange",
        "oninput",
        "oninvalid",
        "onkeydown",
        "onkeypress",
        "onkeyup",
        "onload",
        "onloadeddata",
        "onloadedmetadata",
        "onloadstart",
        "onmousedown",
        "onmousemove",
        "onmouseout",
        "onmouseover",
        "onmouseup",
        "onmousewheel",
        "onoffline",
        "ononline",
        "onpagehide",
        "onpageshow",
        "onpaste",
        "onpause",
        "onplay",
        "onplaying",
        "onpopstate",
        "onprogress",
        "onratechange",
        "onreset",
        "onresize",
        "onscroll",
        "onsearch",
        "onseeked",
        "onseeking",
        "onselect",
        "onstalled",
        "onstorage",
        "onsubmit",
        "onsuspend",
        "ontimeupdate",
        "ontoggle",
        "onunload",
        "onvolumechange",
        "onwaiting",
        "onwheel"
    ];  // fall back. Correct way is to just have if starts with on
    // remove atttr
    const listOfBannedTags = [
        "script"
    ];
    for (let x of listOfBannedAttributes) {
        new_element.removeAttr(x);
        new_element.find("["+x+"]").removeAttr(x);
    }
    for (let x of listOfBannedTags) {
        new_element.find(x).remove();
        if(new_element.is(x)) return $("<div></div>")
    }
    console.log(new_element)
    return new_element;
}
