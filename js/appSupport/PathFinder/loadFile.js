function loadFile(sourceObject, file, query, parentless) {

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
    let parent;

    // see if to use the default
    if (sourceObject.parent == "fs.originNode" || !sourceObject.parent) {
        parent = fs.originNode;

        // create new file entity
        let fileEntity = new FileEntity(sourceObject.name, parent, fileObject);
        return parentless;
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
                parentless.push([sourceObject, file, query]);

            } else {

                // is only one parent found
                if(parent.length > 1) {

                    // multiple parents found
                    console.warn(`Found multiple parents for ${fileObject.selfObjectId}(${sourceObject.name})`);

                }

                // set the parent to the first, and hopefully only, parent object found
                parent = parent[0];

                let indicator = parentless.indexOf([sourceObject, file, query]);
                if(indicator > -1) {
                    parentless.splice(indicator, 1);
                }

                // create new file entity
                let fileEntity = new FileEntity(sourceObject.name, parent, fileObject);
                return parentless;


            }

        } else {

            // no object id is specified
            console.error(`No object id specified for parent of node ${fileObject.selfObjectId}(${sourceObject.name})`);

        }
    }
    return parentless
}
