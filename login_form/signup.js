
var error;
var hintText = document.getElementById('hint-text');
var hintText2 = document.getElementById('hint-text2');

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
		console.log("continue to second form");
		showSecondForm();
	}
}

//map to cognito attributes and submit
function submitOtherInfo(){
	hintText2.style.display = 'none';
	
	if(!document.getElementById("username").value
		||(document.getElementById("user-type").value=='other' 
		&& !document.getElementById("user-type-input").value)
		||(document.getElementById("referral").value=='other'
		&& !document.getElementById("referral-input").value)){
		
		hintText2.style.display = 'block';
		hintText2.innerHTML = "Please fill out all the prompts.";
		console.log("form not complete");
	}else{
		var email = document.getElementById("email").value;
		var pswd = document.getElementById("password").value;
		var userType = document.getElementById("user-type").value;
		var referral = document.getElementById("referral").value;
		if(userType=='other'){
			userType = "other: "+document.getElementById("user-type-input").value;
		}
		if(referral=='other'){
			referral = "other: "+document.getElementById("referral-input").value;
		}
		
		var attributes = [
		{
			Name: 'email',
			Value: email
		},{
			Name: 'preferred_username',
			Value: document.getElementById('username').value
		},{
			Name: 'custom:user_category',
			Value: userType
		},{
			Name: 'custom:user_source',
			Value: referral
		}
		];
		
		//generate a new user in AWS
		signUpUser(attributes,email,pswd,function(err,result){
			if(err){
				if(err.toString().indexOf('UsernameExistsException')!=-1){
				showFirstForm();
				hintText.style.display = 'block';
				hintText.innerHTML = "An account already exists for this email address.";
				}else{
					error=err;
					hintText2.style.display = 'block';
					hintText2.innerHTML = "There was an error.";
				}
			}else{
				cognitoUser = result.user;
				localStorage.setItem('confirm-email',cognitoUser.email);
				window.location.href("verifyEmail.html");
			}
		});
		
	}
}


function showSecondForm(){
	document.getElementById('first-form').style.display = 'none';
	document.getElementById('second-form').style.display = 'block';
	hintText2.style.display = 'none';
}

function showFirstForm(){
	document.getElementById('first-form').style.display = 'block';
	document.getElementById('second-form').style.display = 'none';
	hintText.style.display = 'none';
}

//add text field if 'other' is selected as type
function checkOther(dropdown){
	if(dropdown.value=='other'){
		document.getElementById(dropdown.id+"-other-text").style.display = 'block';
	}else{
		document.getElementById(dropdown.id+"-other-text").style.display = 'none';
	}
}

	