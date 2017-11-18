var error;
var hintText = document.getElementById('hint-text');
var hintText2 = document.getElementById('hint-text2');
var verificationContext;

//check fields and send code
function initiateForgot(){
	hintText.style.display = 'none';
	
	var email = document.getElementById("email").value;
	var emailCheck = /\w+@\w+\.\w/;
	
	if(!emailCheck.test(email)){
		hintText.style.display = 'block';
		hintText.innerHTML = "Not an email address.";
	}else{
		sendRecoveryEmail(email,function(err,result){
			if(err){
				if(err.toString().indexOf('UserNotFoundException')!=-1){
					hintText.style.display = 'block';
					hintText.innerHTML = "No accounts associated with this email.";
				}else{
					hintText.style.display = 'block';
					hintText.innerHTML = "There was an error.";
				}
			}else{
				document.getElementById('insert-email').innerHTML = " to "+email;
				showSecondForm();
			}
		});
	}
}

//send the verification code
function sendRecoveryEmail(email,callback){
	cognitoUser = buildCognitoUser(email);
	cognitoUser.forgotPassword({
		onSuccess: function(result){
			console.log(result);
			if(callback) callback(null,result);
		},
		onFailure: function(err){
			console.log(err);
			if(callback) callback(err,null);
			error=err;
		}
	});
}


//submit code and new password
function submitNewPass(){
	hintText2.style.display = 'none';
	
	var email = document.getElementById("email").value;
	var code = ""+document.getElementById("code").value;
	var pswd = document.getElementById("password").value;
	var c_pswd = document.getElementById("confirm-password").value;
	
	var abc = /[a-z]/;
	var ABC = /[A-Z]/;
	var oneTwo = /[0-9]/;
	var symb = /[\!\^_@\*\?\(\)\[\]\{\}]/;
	
	if(!code){
		hintText2.style.display = 'block';
		hintText2.innerHTML = "Please enter the verification code.";
	}if(!(abc.test(pswd)&&ABC.test(pswd)&&oneTwo.test(pswd)&&symb.test(pswd)&&pswd.length>=8)){
		hintText2.style.display = 'block';
		hintText2.innerHTML = "Password must be at least 8 characters, contain upper and lower case letters, numbers, and symbols (^*@_[]{}()!?).";
	}
	else if(pswd != c_pswd){
		hintText2.style.display = 'block';
		hintText2.innerHTML = "The passwords do not match.";
	}
	else{
		console.log("validating code");
		if(!cognitoUser) cognitoUser = buildCognitoUser(email);
		cognitoUser.confirmPassword(code,pswd,{
			onFailure(err){
				error=err;
				hintText2.style.display = 'block';
				hintText2.innerHTML = "Invalid code.";
			},
			onSuccess(){
				console.log("password updated");
				showThirdForm();
			}
		});
	}
}

//send a new code
function resendCode(){
	hintText2.style.display = 'block';
	hintText2.innerHTML = "A new verification code was sent";
	sendRecoveryEmail(document.getElementById("email").value);
}


function showSecondForm(){
	document.getElementById('first-form').style.display = 'none';
	document.getElementById('second-form').style.display = 'block';
	hintText2.style.display = 'none';
}


function showThirdForm(){
	document.getElementById('first-form').style.display = 'none';
	document.getElementById('second-form').style.display = 'none';
	document.getElementById('third-form').style.display = 'block';
}

function toLogin(){
	window.location.href = "login.html";
}