$(function() {
    let app = new DefaultApp("Notation", {
        icon: "assets/logos/apps/noted.png"
    }, $([
        "<div class='notation'>",
        "</div>"
    ].join("\n")), function (a) {

    });

    appInterface.register(app);
});
