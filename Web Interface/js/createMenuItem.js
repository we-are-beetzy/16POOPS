// Get references to the database service and Menu
var menus = firebase.database().ref().child('Menu');
var menuItems = menus.child('MenuItems');

function makeMenuItem(){
    var itemName = document.forms["createMenuItem"]["itemName"].value;
	var itemPrice = document.forms["createMenuItem"]["itemPrice"].value;
    
    if(validateForm(itemName, itemPrice) === true){
        
        console.log(itemName + " " + itemPrice)
        
        createMenuItem(itemName, itemPrice);
        
        //ensure reloading from server instead of cache
        location.reload(true);

    }
}

// Checks that all of the fields have a value
function validateForm(itemName, itemPrice) {
	
    if (itemName === "") {
        alert("Name must be filled out");
        return false;
    }
    else if (itemPrice == "") {
        alert("Price must be filled out");
        return false;
    }
	else{
		return true;
	}

}
       
// Pushes data from form fields to firebase database in Reservation directory
function createMenuItem(itemName, itemPrice){
	//standard reservation children
    
    var newMenuItem = {name: itemName, price: itemPrice};
	
    menus.child('MenuItems/' + itemName).set(newMenuItem);	
	
	window.alert("Created " + itemName + ".");  
    
}

function loseInformation(){
	if(name.length > 0 || number.length > 0){
		if(confirm('Are you sure? You will lose all of your data')){
			window.location.href = "manageReservations.html";
		}
		else{
			return;
		}
		
	}
}