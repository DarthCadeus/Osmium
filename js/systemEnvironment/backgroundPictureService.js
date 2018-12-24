const DESKTOPS = 6;

$(".desktop").css({
    "background-image": `url(https://i.postimg.cc/Cz2qk8dK/${random.randint(1, DESKTOPS)}.png)`
});

function selectDesktop(locale) {
    const source = document.getElementById("background-entity-template").innerHTML;
	const template = Handlebars.compile(source);
    let context;
    let choice;
    for (let i = 1; i <= DESKTOPS; i++) {
    	context = {
    		image: {
                image: `https://i.postimg.cc/Cz2qk8dK/${i}.png`,
                label: `${i}`
            }
    	};
        $(locale).find(".background-image-space").append(template(context));
    }
}

function setDesktop(id) {
    $(".desktop").css({
        "background-image": `url(https://i.postimg.cc/Cz2qk8dK/${id}.png)`
    });
}

registry.register(selectDesktop);
