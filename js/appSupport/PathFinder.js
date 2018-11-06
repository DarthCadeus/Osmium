$(function(){
    let app = new DefaultApp("Path Finder", {
        icon: "assets/logos/apps/pathfinder.png"
    }, $([
        "<div class='pathfinder'>",
        "   <div class='files-area'>",
        "   </div>",
        "   <div class='display-area'",
        "   </div>",
        "   <hr>",
        "   <button class='upload-button'>",
        "   upload files",
        "   </button>",
        "</div>"
    ].join("\n")), function(a) {
        render(fs, ".pathfinder");
    });

    appInterface.register(app);
});
