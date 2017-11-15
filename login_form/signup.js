
AWSCognito.config.region = 'us-east-2';
        
var poolData = { 
	UserPoolId : 'us-east-2_ShLJ6Qd0I',
	ClientId : '5ffhmh1dnnptnnk089ks8v25mk'
};
var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
var cognitoUser;
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
		var attributeList = [];
		var dataEmail = {
			Name : 'email',
			Value : email
		};
		var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
		attributeList.push(attributeEmail);

		userPool.signUp(email, pswd, attributeList, null, function(err, result) {
			if (err) {
				console.log(err);
				hintText.style.display = 'block';
				hintText.innerHTML = "There was an error.";
				return;
			}
			console.log(result);
			cognitoUser = result.user;
			
			localStorage.setItem('user',JSON.stringify(cognitoUser));
			window.location.href("verifyEmail.html");
		});
	}
}

function showSecondForm(){
	document.getElementById('email-password').style.display = 'none';
	document.getElementById('extra-info').style.display = 'block';
}

function showFirstForm(){
	document.getElementById('email-password').style.display = 'block';
	document.getElementById('extra-info').style.display = 'none';
}


	