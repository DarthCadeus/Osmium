function randint (min, max) {
    return Math.floor(Math.random() * (max+1 - min) + min);
}
function choice(list) {
    return list[randint(0, list.length-1)];
}
var random = {
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
