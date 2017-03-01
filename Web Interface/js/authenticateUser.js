/*
These functions are required to authenticate a user when they attempt to use the login form.
S. Brady Davis
*/

// Toggle the user between being logged in and logged out.
function toggleSignIn() {
    // If the current user is logged in, log them out.
    if (firebase.auth().currUser) {
        firebase.auth().signOut();
    }
    
    // If the user is currently logged out, begin validation.
    else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        // Ensure the form is not empty.
        if (email.length < 2){
            alert('Please enter an e-mail address.');
            return;
        }
        if (password.length < 2){
            alert('Please enter a password.');
            return;
        }
        
        // Authenticate using provided credentials.
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/wrong-password'){
                alert('Invalid username or password.');
            }
            
            else if (errorCode == 'auth/user-not-found'){
                alert('Invalid username or password.')
            }
            
            else {
                alert(errorMessage);
            }
            console.log(error);
            document.getElementsByName('quickstart-sign-in').disabled = false;
        });
    }
    document.getElementById('quickstart-sign-in').disabled = true;
}

// Creates a new account within the 'Create Account' form.
function handleSignUp() {
	var firstName = document.getElementById('firstName').value;
	var lastName = document.getElementById('lastName').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    
	
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
}

// Send an e-mail verification to confirm user sign-up.
function sendEmailVerification() {
  firebase.auth().currentUser.sendEmailVerification().then(function() {
        alert('Verification E-mail Sent.');
    });
}

// Send a password reset e-mail for the 'Forgot Password?' portion of the log in page.
function resetPassword() {
    var email = document.getElementById('email').value;
    
    // Send the password reset email.
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        alert('Password Reset E-mail Sent.');
    }).catch(function(error) {
        // Error Handling
        var errorCode = error.code;
        var errorMessage = error.message;
        
        if (errorCode == 'auth/invalid-email'){
            alert(errorMessage);
        }
        else if (errorCode == 'auth/user-not-found'){
            alert(errorMessage);
        }
        console.log(error);
    });
}