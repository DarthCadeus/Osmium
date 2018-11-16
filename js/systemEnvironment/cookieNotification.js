function projectCookies(){
    $(".cookie").tooltip({
        content: function() {
            const element = $(this);
            if(element.attr("ctitle")) {
                return element.attr("ctitle");
            } else {
                return "this uses cookies!"
            }
        }
    });
}

function alertCookies() {
    let frame = $(
        [
            "<p class='cookie-note'>",
            "   This website uses cookies! Each time you see a 'remember me' or 'remember me for x days' option, it uses cookies! Do <b>not</b> choose the options if you do not wish to accept!",
            "<button class='close'>X</button>",
            "</p>"
        ].join("\n"));
    $("body").append(frame);
    $(".cookie-note .close").click(function(){
        $(frame).remove();
    });
}

$(projectCookies);
$(alertCookies);
