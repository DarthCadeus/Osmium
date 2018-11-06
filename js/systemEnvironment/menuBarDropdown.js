let registry = [];

registry.register = function (f) {
    this.push(f);
}

$(".system-icon img").click(function () {
    $(this).toggleClass("active")
    $(".extended-system-space").toggleClass("hidden");
    $(".extended-system-space").children().each(function () {
        $(this).empty();
    });
    for(let registered of registry) {
        registered($(".extended-system-space"));
    }
});
