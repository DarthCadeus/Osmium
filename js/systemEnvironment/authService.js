function lcInit() {
	const options_redundant = {
		title: "link to a database!",
		beforeClose: function(event, ui) {
			return false;  // cancel the close event (for now)
		},
		open: function(event, ui) {
			$(".authServicePopUp")
		},
		modal: true
	}
	let frame = $([
		"<div class='authServicePopUp'>",
		"	<div class='description'>",
		"		<h3 title='we are so poor we cannot afford a professional unlimited database!'> We respect your privacy! </h3>",
		"		<p>In order for this sytem to function, we need to ask you to link this application to a database created with <a href='https://leancloud.cn'>leancloud</a>.</p>",
		"		<p>We do not supply a database because we respect your privacy. If you want to create your own, we are all for it! </p>",
		"		<p>However, if you simply wish to try this out, it is okay to use our trial database. Simply click <button class='useDefault'>this button</button>!</p>",
		"		<p>If you so wish, be warned that there is a limit to requests set by the provider. </p>",
		"		<p>Id: <input class='appId' place='app id'><br/>Key: <input type='password' class='appKey' place='app key'><br/><button class='useCustom'>confirm</button></p>",
		"	</div>",
		"</div>"
	].join("\n"));
	$("body").append(frame);
	$(".authServicePopUp p .useDefault").click(function(){
		leancloudInit();
		frame.remove();
		logIn();
	});
	$(".authServicePopUp p .useCustom").click(function(){
		leancloudInit($(".authServicePopUp p .appId").val(), $(".authServicePopUp p .appKey").val());
		frame.remove();
		logIn();
	});
}

lcInit();

function logIn() {
	let frame = $([
		"<div class='authServiceLogin'>",
		"	<h3> Please Login! </h3>",
		"	<p> Although you have chosen a database, you have not yet logged in. There might be multiple users, after all! </p>",
		"	<p> <input type='text' class='userName' placeholder='username' required> <br/><input type='text' class='email' placeholder='email' required> <br/><input type='password' class='passWord' placeholder='password' required> <br/><button class='logIn'>log in</button> <button class='register'>Register</button> </p>",
		"</div>"
	].join("\n"));
	$("body").append(frame);
	$(".authServiceLogin p .register").click(function(){
		let user = new AV.User();
		user.setUsername($(".authServiceLogin p .userName").val());
		user.setPassword($(".authServiceLogin p .passWord").val());
		user.setEmail($(".authServiceLogin p .email").val());
		user.signUp().then(function(){
			frame.remove();
			loadMainOS();
		}, function(err){
			console.log(err);
		})
	});
	$(".authServiceLogin p .logIn").click(function(){
		AV.User.logIn($(".authServiceLogin p .userName").val(), $(".authServiceLogin p .passWord").val()).then(function(){
			frame.remove();
			loadMainOS();
		}, function(err){
			console.log(err);
		})
	});
}
//
// let authService = {
// 	curUser: AV.User.current()
// }
