$(function() {
    let aboutPage = $("<div></div>").append(
        $("<div class='about-header'><h2>Osmium</h2></div>")
    ).append(
        $("<div class='about-description'>An elegant operating system for a more civilized age</div>")
    ).append(
        $("<hr>")
    ).append(
        $("<div class='about-wallpapers'>Wallpapers are hosted by <a href='https://postimages.org/'>postimage.org</a>. Find the original images <a href='https://postimg.cc/gallery/3g9jrm62i/'>here</a>. They were created using <a href='https://canva.com/'>Canva</a>. </div>")
    );
    contextMenuRegister.register({
        name: "About",
        callbacks: function() {
            popDialog(aboutPage, {
                title: "About"
            });
        }
    })
})
