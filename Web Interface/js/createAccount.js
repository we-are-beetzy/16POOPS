var flag = 0;

function pause(milliseconds) {
	var firstDate = new Date();
	while ((new Date()) - firstDate <= milliseconds) { /* Do nothing */ }
}

function handleSignUp() {
	
	var firstName = document.getElementById('firstName').value;
	var lastName = document.getElementById('lastName').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
	var employeeInfo;
	var tables;
	
    // Ensure the name, username and password fields are not empty.
	if(firstName.length == 0){
		alert('Please enter a first name.');
		return;
	}
	
	if(lastName.length == 0){
		alert('Please enter a last name.');
		return;
	}	
	
    if (email.length < 2){
        alert('Please enter an e-mail address.');
        return;
    }
    if (password.length < 2){
        alert('Please enter a password.');
        return;
    }
    
    // Ensure the password and confirm password are equal
    if (password !== confirmPassword){
        alert('Password does not match the confirm password.');
        return;
    }
	
	var radioType = null;
	if(document.getElementById("radio1").checked){
		radioType = radio1.value;
	}
	if(document.getElementById("radio2").checked){
		radioType = radio2.value;
	}
	if(document.getElementById("radio3").checked){
		radioType = radio3.value;
	}
	
	if(radioType === null){
		alert("Employee type must be selected.");
		return;
	}
	
	var userName = firstName.concat(" ");
	userName = userName.concat(lastName);
	console.log(userName);
	if(!(radioType.localeCompare("Host"))){
		var ref = firebase.database().ref('Users/Host');
		employeeInfo = {name: userName, email: email, Password: password};
	}
	else if(!(radioType.localeCompare("Kitchen"))){
		var ref = firebase.database().ref('Users/Kitchen');
		employeeInfo = {name: userName, email: email, Password: password};		
	}
	else if(!(radioType.localeCompare("Server"))){
		var ref = firebase.database().ref('Users/Server');
		 tables = {0: "", 1: "", 2: "", 3: ""};
		 employeeInfo = {assignedTables: tables, name: userName, email: email, Password: password};
	}
	
	
    // Attempt to create the user with the provided username and password.
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Error Handling
        var errorCode = error.code;
        var errorMessage = error.message;
        
        if (errorCode == 'auth/weak-password'){
            alert('Password is too weak.');
            flag = 1;
        }
        else {
            alert(errorMessage);
            return;
        }
        console.log(error);
		
    });
	
	firebase.auth().onAuthStateChanged(function(user) {
	if(user){
		
		var user = firebase.auth().currentUser;
		var id = user.uid;
		ref.child(id).set(employeeInfo);
		console.log(id);
		
		var field1 = document.getElementById("firstName");
		field1.value = "";
		field1 = document.getElementById("lastName");
		field1.value = "";
		field1 = document.getElementById("email");
		field1.value = "";
		field1 = document.getElementById("password");
		field1.value = "";
		field1 = document.getElementById("confirmPassword");
		field1.value = "";
		
		
	} 
    });	


}