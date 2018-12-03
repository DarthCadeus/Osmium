function loadFile(sourceObject, file, query) {

    // create the bound file object
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
        selfObjectId: file.get("objectId"),
        source: sourceObject
    });

    // // TODO: expand this
    // if (sourceObject.type == "png" || sourceObject.type == "jpg") {
    //     let file = AV.File.createWithoutData('552e0a27e4b0643b709e891e');
    //     let thumbnailUrl = file.thumbnailURL(100, 200);
    //     fileObject.icon = thumbnailUrl;
    // }

    let parent;

    // see if to use the default
    if (sourceObject.parent == "fs.originNode" || !sourceObject.parent) {
        parent = fs.originNode;

        // create new file entity
        let fileEntity = new FileEntity(sourceObject.name, parent, fileObject);
    } else {

        // if selfObjectId is specified
        if (sourceObject.parent.selfObjectId) {

            // search for parent in the file system
            parent = fs.search({
                selfObjectId: sourceObject.parent.selfObjectId
            });

            // is parent found
            if(parent.length == 0) {

                // parent is not found
                console.error(`No parent found for node ${fileObject.selfObjectId}(${sourceObject.name})`);

            } else {

                // is only one parent found
                if(parent.length > 1) {

                    // multiple parents found
                    console.warn(`Found multiple parents for ${fileObject.selfObjectId}(${sourceObject.name})`);

                }

                // set the parent to the first, and hopefully only, parent object found
                parent = parent[0];


                // create new file entity
                let fileEntity = new FileEntity(sourceObject.name, parent, fileObject);


            }

        } else {

            // no object id is specified
            console.error(`No object id specified for parent of node ${fileObject.selfObjectId}(${sourceObject.name})`);

        }
    }
}
