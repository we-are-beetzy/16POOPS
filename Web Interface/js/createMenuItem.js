// Get references to the database service and Menu
var menus = firebase.database().ref().child('Menu');
var menuItems = menus.child('MenuItems');

function makeMenuItem(){
	var itemCategory = document.forms["createMenuItem"]["menuCategory"].value;
    var itemName = document.forms["createMenuItem"]["itemName"].value;
	var itemPrice = document.forms["createMenuItem"]["itemPrice"].value;
    
    if(validateForm(itemName, itemPrice) === true){
        
        console.log(itemCategory + " " + itemName + " " + itemPrice);
        
        createMenuItem(itemCategory, itemName, itemPrice);
        
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
function createMenuItem(itemCategory, itemName, itemPrice){
	//standard reservation children
    
    var newMenuItem = {name: itemName, price: itemPrice};
	
	if(itemCategory == "Alcohol" || itemCategory == "SoftDrinks"){
		var category = menus.child('Drinks').child(itemCategory);
			category.once("value")
			.then(function(snapshot) {
				var newKey = snapshot.numChildren(); 
				console.log("numChildren is:" + newKey);
				menus.child('Drinks/').child(itemCategory + '/' + newKey).set(itemName.toString());
			}); 
	}else{
		var category = menus.child(itemCategory);
			category.once("value")
			.then(function(snapshot) {
				var newKey = snapshot.numChildren(); 
				menus.child('Food/').child(itemCategory + '/' + newKey).set(itemName.toString());
			}); 
	}
	
    menus.child('MenuItems/' + itemName).set(newMenuItem);	
	
	window.alert("Created " + itemName + ".");  
    
}
