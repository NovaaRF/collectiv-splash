//support functions for login.html
var error;
var debug = JSON.parse(localStorage.getItem('userExtraInfo'));
function userLogin(){
	var email = document.getElementById('email').value;
	var pswd = document.getElementById('password').value;
	clearHints();
	
	if(!(email && pswd)){
		document.getElementById("empty-fields").style.display = 'block';
	}
	else{
		console.log("authenticating user..");
		authenticateUser(email,pswd,function(err,result){
			if(err){
				error = err;
				if(err.toString().indexOf('UserNotConfirmedException')!=-1){
					localStorage.setItem('confirm-email',email);
					window.location.href = "verifyEmail.html";
				}
				else
					document.getElementById("invalid").style.display = 'block';
			}else{
				//successful login
				console.log("user authenticated");
				localStorage.setItem('activeUser',JSON.stringify(cognitoUser));
				
				//check for unsubmitted new account info
				var signupAttributes = JSON.parse(localStorage.getItem('userExtraInfo'));
				if(signupAttributes){
					console.log("detected additional user attributes");
					updateUserProfile(signupAttributes,function(err,result){
						error = err;
						if(result){
							localStorage.removeItem('userExtraInfo');
							window.location.href = '../dashboard/dashboard.html';
						}
					});
				}else{
					window.location.href = '../dashboard/dashboard.html';
				}
			}
		});
	}
}

function clearHints(){
	document.getElementById("empty-fields").style.display = 'none';
	document.getElementById("invalid").style.display = 'none';
}