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
