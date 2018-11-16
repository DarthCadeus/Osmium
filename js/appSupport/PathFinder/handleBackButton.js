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
    if(CUR_DIR.parent) {
        $(button).removeClass("hidden");
        return true;
    } else {
        $(button).addClass("hidden");
        return false;
    }
}
