// Get references to the database service and Menu
var menus = firebase.database().ref().child('Menu');
var menuRef = menus.child('MenuItems');

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
	
	var name = document.forms["createMenuItem"]["itemName"].value;
	var	price = document.forms["createMenuItem"]["itemPrice"].value;
    
	if(validateForm(name, price)){
		window.location.href = "menu.html";
		createMenuItem(name, price);
	}
	else{
		// should not clear fields if the information is not correct
		return;
	}
}

// Pushes data from form fields to firebase database in Menu directory
function createMenuItem(itemName, ItemPrice){
	//standard menu children
	var newMenuItem = {name: itemName, price: itemPrice};
	
	var mName = itemName;
	
    menus.child('MenuItems/' + mName).set(newMenuItem);	
}

// if "Return to Menu" is clicked, alert will pop up,
// cancel should keep form data and stay on page
function loseInformation(){
	if(name.length > 0 || price.length > 0){
		if(confirm('Are you sure? You will lose all of your data')){
			window.location.href = "menu.html";
		}
		else{
			return;
		}
		
	}
}
