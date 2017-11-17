var error;
//expecting stored email from signup or login flows
var unconfirmedEmail = localStorage.getItem('confirm-email');

if(cognitoUser){
	console.log("found user session:",cognitoUser);
	document.getElementById("insert-email").innerHTML = " to "+cognitoUser.email;
}else if(unconfirmedEmail){
	console.log("passover from login form");
	document.getElementById("insert-email").innerHTML = " to "+unconfirmedEmail;
	cognitoUser = buildCognitoUser(unconfirmedEmail);
}else{
	console.log("No data found, user needs to log in again");
	window.location.href = "login.html";
}

//validate the verification code
function verifyCode(){
	code=document.getElementById("code").value;
	cognitoUser.confirmRegistration(""+code, true, function(err, result) {
		if (err) {
			error=err;
			console.log(err.toString());
			clearHints();
			document.getElementById("wrong-code").style.display = 'block';
		}else{
			console.log('call result: ' + result);
			localStorage.removeItem('confirm-email');
			
			window.location.href = 'login.html';
		}
	});
}

//resend the verification code
function resendEmail(){
	cognitoUser.resendConfirmationCode();
	
	clearHints();
	document.getElementById("resend-code").style.display = 'block';
}


//clear all hint text
function clearHints(){
	document.getElementById("wrong-code").style.display = 'none';
	document.getElementById("resend-code").style.display = 'none';
}



