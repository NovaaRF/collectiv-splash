

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
	//window.location.href = "login.html";
}

//clear all hint text
function clearHints(){
	document.getElementById("wrong-code").style.display = 'none';
	document.getElementById("resend-code").style.display = 'none';
}

function verifyCode(){
	cognitoUser.confirmRegistration(""+code, true, function(err, result) {
		if (err) {
			console.log(err);
			clearHints();
			document.getElementById("wrong-code").style.display = 'block';
		}else{
			console.log('call result: ' + result);
			
			showSecondForm();
		}
	});
}

//resend the verification code
function resendEmail(){
	cognitoUser.resendConfirmationCode();
	
	clearHints();
	document.getElementById("resend-code").style.display = 'block';
}

function showSecondForm(){
	document.getElementById('first-form').style.display = 'none';
	document.getElementById('second-form').style.display = 'block';
}

function showFirstForm(){
	document.getElementById('first-form').style.display = 'block';
	document.getElementById('second-form').style.display = 'none';
}