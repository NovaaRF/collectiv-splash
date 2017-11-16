//support functions for login.html
var error;
function userLogin(){
	var email = document.getElementById('email').value;
	var pswd = document.getElementById('password').value;
	clearHints();
	
	if(!(email && pswd)){
		document.getElementById("empty-fields").style.display = 'block';
	}
	else{
		console.log("authenticating against email: "+email+", password: "+pswd);
		authenticateUser(email,pswd,function(err,result){
			if(err){
				error = err;
				if(err.toString().indexOf('UserNotConfirmedException')!=-1){
					localStorage.setItem('confirm-email',email);
					window.location.href = "verifyEmail.html";
				}
				else
					document.getElementById("invalid").style.display = 'block';
			}
		});
	}
}

function clearHints(){
	document.getElementById("empty-fields").style.display = 'none';
	document.getElementById("invalid").style.display = 'none';
}