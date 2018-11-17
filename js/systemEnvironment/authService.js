const ls = new LocalStorageManager(false)


function lcInit() {
	if(ls.get("appKey") && ls.get("appId")) {
		leancloudInit(ls.get("appId"), ls.get("appKey"));
		logIn();
		return;
	}
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
		"		<p>In order for this sytem to function, we need to ask you to link this application to a database created with <a href='https://leancloud.cn'>leancloud</a>.",
		"		We do not supply a database because we respect your privacy. If you want to create your own, we are all for it! ",
		"		However, if you simply wish to try this out, it is okay to use our trial database. Simply click <button class='useDefault'>this button</button>!",
		"		If you so wish, be warned that there is a limit to requests set by the provider. </p>",
		"		<div>Id: <input class='appId' place='app id'><br/>Key: <input type='password' class='appKey' place='app key'><br/><input type='checkbox' class='rememberMe'>remember me<br/><input type='checkbox' class='rememberMeTen'>remember me for ten days<br/><button class='useCustom'>confirm</button></div>", // it doesn't really use cookies (local storage), but hey!
		"	</div>",
		"</div>"
	].join("\n"));


	$("body").append(frame);
	$(".authServicePopUp p .useDefault").click(function(){
		if($(".authServicePopUp div .rememberMe").val()) {
			ls.set("appId", "MDPFnMc2dUwuywGmueDNyOft-gzGzoHsz");
			ls.set("appKey", "LSrD2F64K8NEnQftI8vkxEfT");
		} else if ($(".authServicePopUp div .rememberMeTen").val()) {
			ls.set("appId", "MDPFnMc2dUwuywGmueDNyOft-gzGzoHsz", 10);
			ls.set("appKey", "LSrD2F64K8NEnQftI8vkxEfT", 10);
		}
		leancloudInit();
		frame.remove();
		logIn();
	});
	$(".authServicePopUp div .useCustom").click(function(){
		if($(".authServicePopUp p .rememberMe").val()) {
			ls.set("appId", $(".authServicePopUp div .appId").val());
			ls.set("appKey", $(".authServicePopUp div .appKey").val());
		} else if ($(".authServicePopUp div .rememberMeTen").val()) {
			ls.set("appId", $(".authServicePopUp div .appId").val(), 10);
			ls.set("appKey", $(".authServicePopUp div .appKey").val(), 10);
		}
		leancloudInit($(".authServicePopUp div .appId").val(), $(".authServicePopUp div .appKey").val());
		frame.remove();
		logIn();
	});
}

lcInit();

function logIn() {
	if(ls.get("username") || ls.get("password")) {
		AV.User.logIn(ls.get("username"), ls.get("password")).then(function () {
			frame.remove();
			$(".authmode").removeClass("authmode");
			loadMainOS();
		}, function (err) {
			console.error(err);
		});
	}
	let frame = $([
		"<div class='description'>",
		"	<h3> Please Login! </h3>",
		"	<p> Although you have chosen a database, you have not yet logged in. There might be multiple users, after all! </p>",
		"	<div> <input type='text' class='userName' placeholder='username' required> <br/><input type='text' class='email' placeholder='email' required> <br/><input type='password' class='passWord' placeholder='password' required> <br/><input type='checkbox' class='rememberMe'>remember me<br/><input type='checkbox' class='rememberMeTen'>remember me for ten days<br/><button class='logIn'>log in</button> <button class='register'>Register</button> </div>",
		"</div>"
	].join("\n"));
	$("body").append(frame);
	projectCookies();
	$(".description div .register").click(function(){
		let user = new AV.User();
		user.setUsername($(".description div .userName").val());
		user.setPassword($(".description div .passWord").val());
		user.setEmail($(".description div .email").val());
		user.signUp().then(function(){
			if($(".description div .rememberMe").val()) {
				ls.set("username", $(".description div .userName").val());
				ls.set("password", $(".description div .passWord").val());
			} else if($(".description div .rememberMeTen").val()) {
				ls.set("username", $(".description div .userName").val(), 10);
				ls.set("password", $(".description div .passWord").val(), 10);
			}
			frame.remove();
			loadMainOS();
		}, function(err){
			console.log(err);
		})
	});
	$(".description div .logIn").click(function(){
		AV.User.logIn($(".description div .userName").val(), $(".description div .passWord").val()).then(function(){
			if($(".description div .rememberMe").val()) {
				ls.set("username", $(".description div .userName").val());
				ls.set("password", $(".description div .passWord").val());
			} else if($(".description div .rememberMeTen").val()) {
				ls.set("username", $(".description div .userName").val(), 10);
				ls.set("password", $(".description div .passWord").val(), 10);
			}
			frame.remove();
			$(".authmode").removeClass("authmode");
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
