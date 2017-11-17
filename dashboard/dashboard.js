
fetchActiveUser(function(session){
	if(session.isValid()){
		document.getElementById("log-in").style.display = 'none';
		document.getElementById("log-out").style.display = 'block';
	}else{
		console.log("try logging in again");
	}
})



function logout(){
	if (cognitoUser != null) {
		cognitoUser.signOut();
		window.location.reload();
	}
}