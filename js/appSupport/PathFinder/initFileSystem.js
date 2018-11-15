function initFileSystem() {
    // fetch files from server

    // create a query to the database
    const query = new AV.Query("FileManager");

    // get all files from the query
    query.find().then(function(allFiles){


        let files = [];

        // for every file entry in the database
        allFiles.forEach(function(file) {

            files.push(file)

        });

        files.sort(function(a, b) {
            return a.get("updatedAt") - b.get("updatedAt");
        });

        for(let file of files) {
            // get the primitive object stored in the cloud
            const sourceObject = file.get("FileObject");

            // check if the user ids agree
            // cannot have cross-user access of files
            if(sourceObject.user.id == AV.User.current().id) {
                parentless = loadFile(sourceObject, file, query, parentless);
            }
        }


    }, (err) => {
        console.error(err);
    });
}
