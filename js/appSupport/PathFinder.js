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
        render(fs, ".files-area");
        $(".pathfinder .upload-button").click(function(){
            popDialog([
                "<div class='uploadDialog'>",
                "   <input type='file' class='fileUpload'>",
                "   <button class='fileUploadConfirm'>upload</button>",
                "</div>"
            ].join("\n"), {title: "select file"});
            $(".uploadDialog .fileUploadConfirm").click(function(){
                const localFile = $(".uploadDialog .fileUpload")[0].files[0];
                let name = $(".uploadDialog .fileUpload").val();
                name = name.split("\\")[name.split("\\").length-1];
                const file = new AV.File(name, localFile);
                const FileManager = AV.Object.extend("FileManager");
                const f = new FileManager();
                file.save().then(function(fobj){
                    console.log(fobj);
                    console.log("Success!");
                    fileobject = {
                        name: name,
                        type: name.split(".")[name.split(".").length-1],
                        url: fobj.url(),
                        user: AV.User.current(),
                        objectId: fobj.get("objectId"),
                        size: fobj.attributes.metaData.size,
                        parent: "fs.originNode"
                    };  // everything stored on the cloud is primitive
                    console.log(fobj.url());
                    f.set("FileObject", fileobject);
                    f.save().then(function(){console.log("success")}, function(err){console.error(err)});

                }, function(err) {
                    console.error(err);
                });
            });
        });
    });

    appInterface.register(app);
});

$(function() {
    // fetch files from server
    const query = new AV.Query("FileManager");
    query.find().then(function(allFiles){
        allFiles.forEach(function(file) {
            const sourceObject = file.get("FileObject");
            if(sourceObject.user.id == AV.User.current().id) {
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
                    selfObjectId: file.get("objectId")
                });
                let parent;
                if (sourceObject.parent == "fs.originNode" || !sourceObject.parent) {
                    parent = fs.originNode;
                } else {
                    if (sourceObject.parent.selfObjectId) {
                        parent = fs.search({
                            selfObjectId: sourceObject.parent.selfObjectId
                        });
                        if(parent == []) {
                            console.error(`No parent found for node ${sourceObject.selfObjectId}(${sourceObject.name})`)
                        }
                        if(parent.length > 1) {
                            console.warn(`Found multiple parents for ${sourceObject.selfObjectId}(${sourceObject.name})`);
                        }
                        parent = parent[0];
                    } else {
                        console.error(`No object id found for parent of node ${sourceObject.selfObjectId}(${sourceObject.name})`);
                    }
                }
                let fileEntity = new FileEntity(sourceObject.name, parent, fileObject);
            }
        });
    }, (err) => {
        console.error(err);
    });
});
