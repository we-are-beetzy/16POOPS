/*
These functions are required to authenticate a user when they attempt to use the login form.
S. Brady Davis
*/

// Toggle the user between being logged in and logged out.
function pause(milliseconds) {
	var firstDate = new Date();
	while ((new Date()) - firstDate <= milliseconds) { /* Do nothing */ }
}

function toggleSignIn() {
    // If the current user is logged in, log them out.
	
	var spinner = document.getElementById("spinner");
	spinner.style.visibility = "visible";
    if (firebase.auth().currUser) {
        firebase.auth().signOut();
    }
    
    // If the user is currently logged out, begin validation.
   
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        // Ensure the form is not empty.
        if (email.length < 2){
            alert('Please enter an e-mail address.');
			spinner.style.visibility = "hidden";
            return;
        }
        if (password.length < 2){
            alert('Please enter a password.');
			spinner.style.visibility = "hidden";
            return;
        }
        
        // Authenticate using provided credentials.
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/wrong-password'){
                spinner.style.visibility = "hidden";
				alert('Invalid username or password.');
            }
            
            else if (errorCode == 'auth/user-not-found'){
                spinner.style.visibility = "hidden";
				alert('Invalid username or password.')
            }
            
            else {
				spinner.style.visibility = "hidden";
                alert(errorMessage);
            }
            console.log(error);
            document.getElementsByName('quickstart-sign-in').disabled = false;	
	});
		
		firebase.auth().onAuthStateChanged(function(user) {
	if(user){
		var id = user.uid;
		console.log(id);
		var email = user.email;
		console.log(email);
		//localStorage.setItem("userKey", id);
		//localStorage.setItem("userEmail", email);
		//pause(5000);
		window.location.href="manageReservations.html"
	} 
        });				
 
}   //document.getElementById('quickstart-sign-in').disabled = true;


// Creates a new account within the 'Create Account' form.


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