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
    });

    // register the application
    appInterface.register(app);
});

$(initFileSystem);  // source: init file system.js
