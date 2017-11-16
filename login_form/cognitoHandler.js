AWSCognito.config.region = 'us-east-2';
        
var poolData = { 
	UserPoolId : 'us-east-2_ShLJ6Qd0I',
	ClientId : '5ffhmh1dnnptnnk089ks8v25mk'
};
var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
var cognitoUser;

function buildCognitoUser(email){
	var userData = {
        Username : email,
        Pool : userPool
    };
	return new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
}

function signUpUser(email, pswd, callback){
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
		}else
			console.log(result);
		
		if(callback){
			callback(err,result);
		}
	});
}


function authenticateUser(email,pswd,callback){
	var userData = {
        Username : email,
        Pool : userPool
    };	
    var authenticationData = {
        Username : email,
        Password : pswd
    };
    var authenticationDetails = 
		new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
	 
	cognitoUser = 
		new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (result) {
				console.log(result);
			},
			onFailure: function(err) {
				console.log(err);
				if(callback){
					callback(err,null);
				}
			},
		});
}

