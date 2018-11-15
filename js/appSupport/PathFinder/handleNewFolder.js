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
