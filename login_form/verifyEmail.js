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


//clear all hint text
function clearHints(){
	document.getElementById("wrong-code").style.display = 'none';
	document.getElementById("resend-code").style.display = 'none';
}

function showSecondForm(){
	document.getElementById('first-form').style.display = 'none';
	document.getElementById('second-form').style.display = 'block';
}

function showFirstForm(){
	document.getElementById('first-form').style.display = 'block';
	document.getElementById('second-form').style.display = 'none';
}

//add text field if 'other' is selected as type
function checkOther(dropdown){
	if(dropdown.value=='other'){
		document.getElementById(dropdown.id+"-other-text").style.display = 'block';
	}else{
		document.getElementById(dropdown.id+"-other-text").style.display = 'none';
	}
}

//map to cognito attributes and submit
function submitOtherInfo(){
	if(!document.getElementById("username").value
		||(document.getElementById("user-type").value=='other' 
		&& !document.getElementById("user-type-input").value)
		||(document.getElementById("referral").value=='other'
		&& !document.getElementById("referral-input").value)){
		
		document.getElementById("not-complete-hint").style.display = 'block';
		console.log("form not complete");
	}else{
		var attributes = [
		{
			Name: 'preferred_username',
			Value: document.getElementById('username').value
		},{
			Name: 'custom:user_category',
			Value: document.getElementById('user-type').value
		},{
			Name: 'custom:user_source',
			Value: document.getElementById('referral').value
		}
		];
		
		localStorage.setItem('userExtraInfo',JSON.stringify(attributes));
		
		window.location.href = 'login.html';
	}
}
