// Get references to the database service and Menu
var menus = firebase.database().ref().child('Menu');
var menuItems = menus.child('MenuItems');

function editMenuItem(){
	
	menuItems.once("value")
		.then(function(snapshot) {
			
        //var itemCategory = snapshot.val().tableKey;
        var itemName = snapshot.val().name;
		var itemPrice = snapshot.val().price;
		
    });
	
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
function saveChanges(){
	//var itemCategory = document.forms["createMenuItem"]["menuCategory"].value;
    var itemName = document.forms["createMenuItem"]["itemName"].value;
	var itemPrice = document.forms["createMenuItem"]["itemPrice"].value;
    
    
    var updatedItem = {item: menuItem, tableKey: tableNumber};
    
	menus.child('MenuItems/' + itemName).set(updatedItem);
	
	menuItems.once("value")
	.then(function(itemSnapshot) {
		itemSnapshot.forEach(function(childSnapshot){
			if(childSnapshot.val() === orderNumber){
				menuItems.child(childSnapshot.key).remove();  
			}
		});
	});
    
    window.location.href = 'menu.html';
}

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