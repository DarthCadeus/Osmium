function handleFileUpload(a) {

    // render the file system
    render(fs, ".files-area");


    $(".pathfinder .upload-button").click(function(){


        // create the dialog
        popDialog([
            "<div class='uploadDialog'>",
            "   <input type='file' class='fileUpload'>",
            "   <button class='fileUploadConfirm'>upload</button>",
            "</div>"
        ].join("\n"), {title: "select file"});


        // attach the event listener
        $(".uploadDialog .fileUploadConfirm").click(function(){

            // get local file
            const localFile = $(".uploadDialog .fileUpload")[0].files[0];

            // get name of local file
            let name = $(".uploadDialog .fileUpload").val();
            // separate the name proper from path
            name = name.split("\\")[name.split("\\").length-1];

            // create a leancloud file object
            const file = new AV.File(name, localFile);

            // extend the leancloud file manager class
            const FileManager = AV.Object.extend("FileManager");
            // create a new instance of a file record
            const f = new FileManager();


            // save the local file to the server
            file.save().then(function(fobj){

                // create the file object to be stored in the cloud
                fileobject = {
                    name: name,
                    type: name.split(".")[name.split(".").length-1],
                    url: fobj.url(),
                    user: AV.User.current(),
                    objectId: fobj.get("objectId"),
                    size: fobj.attributes.metaData.size,
                    parent: "fs.originNode"
                };  // everything stored on the cloud is primitive


                // set it and save
                f.set("FileObject", fileobject);
                f.save().then(function(){console.log("success")}, function(err){console.error(err)});

            }, function(err) {
                console.error(err);
            });
        });
    });
}
