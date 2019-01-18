$(function() {
    // create application from iframe
    let app = new AppObject("QuizMaster", {
        icon: "assets/logos/apps/quizmaster.png",
        source: "http://darthcadeuscn.pythonanywhere.com"  // use the original source to avoid excessiveness nesting
    });

    // register the application
    appInterface.register(app);
});
