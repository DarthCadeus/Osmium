const DESKTOPS = 6;

$(".desktop").css({
    "background-image": `url(assets/default_backgrounds/${random.randint(1, DESKTOPS)}.png)`
});

function selectDesktop(locale) {
    const source = document.getElementById("background-entity-template").innerHTML;
	const template = Handlebars.compile(source);
    let context;
    let choice;
    for (let i = 1; i <= DESKTOPS; i++) {
    	context = {
    		image: {
                image: `assets/default_backgrounds/${i}.png`,
                label: `${i}`
            }
    	};
        $(locale).find(".background-image-space").append(template(context));
    }
}

function setDesktop(id) {
    $(".desktop").css({
        "background-image": `url(assets/default_backgrounds/${id}.png)`
    });
}

registry.register(selectDesktop);
