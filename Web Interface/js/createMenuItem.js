// Get references to the database service and Menu
var ref = firebase.database().ref();
var resRef = ref.child('Menu');

// Checks that all of the fields have a value
function validateForm(name, price) {
	
    if (name === "") {
        alert("Name must be filled out");
        return false;
    }
    else if (price == "") {
        alert("Price must be filled out");
        return false;
    }
	else{
		return true;
	}

}

// Will run when the confirm create Menu Item button is clicked,
// Pulls values from the form and asks if information is correct,
// if so will check if all fields have values, pushes form inputs to database
function confirmMenuItem(){
	
	var name = document.forms["createMenuItem"]["name"].value;
	var	price = document.forms["createMenuItem"]["price"].value;
    
	if(confirm('Is the information correct?') && validateForm(name, price)){
		window.location.href = "manageReservations.html";
		createMenuItem(name, price);
	}
	else{
		// should not clear fields if the information is not correct
		return;
	}
}
// if "Return to Menu" is clicked, alert will pop up,
// cancel should keep form data and stay on page
function loseInformation(){
	if(name.length > 0 || number.length > 0){
		if(confirm('Are you sure? You will lose all of your data')){
			window.location.href = "menu.html";
		}
		else{
			return;
		}
		
	}
}

// Pushes data from form fields to firebase database in Menu directory
function createMenuItem(name, price){
	//standard menu children
    
    window.console.log(dateInt);

	var menu = {name: name, price: price};
	
    ref.child('Menu/').set(menu);	
}
