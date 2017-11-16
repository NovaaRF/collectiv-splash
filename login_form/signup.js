
var error;
var hintText = document.getElementById('hint-text');

function submitAcct(){
	//var hintText = document.getElementById('hint-text');
	hintText.style.display = 'none';
	
	var email = document.getElementById("email").value;
	var pswd = document.getElementById("password").value;
	var c_pswd = document.getElementById("confirm-password").value;
	
	var emailCheck = /\w+@\w+\.\w/;
	var abc = /[a-z]/;
	var ABC = /[A-Z]/;
	var oneTwo = /[0-9]/;
	var symb = /[\!\^_@\*\?\(\)\[\]\{\}]/;
	
	if(!emailCheck.test(email)){
		hintText.style.display = 'block';
		hintText.innerHTML = "Not an email address.";
	}
	else if(!(abc.test(pswd)&&ABC.test(pswd)&&oneTwo.test(pswd)&&symb.test(pswd)&&pswd.length>=8)){
		hintText.style.display = 'block';
		hintText.innerHTML = "Password must be at least 8 characters, contain upper and lower case letters, numbers, and symbols (^*@_[]{}()!?).";
	}
	else if(pswd != c_pswd){
		hintText.style.display = 'block';
		hintText.innerHTML = "The passwords do not match.";
	}
	else{
		console.log("submitting new user info..");
		
		//generate a new user in AWS
		signUpUser(email,pswd,function(err,result){
			if(err.toString().indexOf('UsernameExistsException')!=-1){
				hintText.style.display = 'block';
				hintText.innerHTML = "An account already exists for this email address.";
			}else if (err) {
				error=err;
				hintText.style.display = 'block';
				hintText.innerHTML = "There was an error.";
			}else{
				cognitoUser = result.user;
				localStorage.setItem('confirm-email',cognitoUser.email);
				window.location.href("verifyEmail.html");
			}
		});
	}
}

	