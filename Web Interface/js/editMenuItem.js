// read variable value "itemName" saved to localStorage from "viewMenu.html"
var itemName = localStorage.getItem("itemName");

// Get references to the database service and Menu
var menus = firebase.database().ref().child('Menu');
var menuItems = menus.child('MenuItems');

function makeMenuItem(){
	
	menuItems.child(itemName).remove();
	
	deleteMenuArray(itemName, "Alcohol");
	deleteMenuArray(itemName, "SoftDrinks");
	deleteMenuArray(itemName, "Appetizers");
	deleteMenuArray(itemName, "Dessert");
	deleteMenuArray(itemName, "Entree");
	deleteMenuArray(itemName, "Sides");
	
	var itemCategory = document.forms["createMenuItem"]["menuCategory"].value;
    itemName = document.forms["createMenuItem"]["itemName"].value;
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
	
	window.alert("Edited " + itemName + ".");  
    
}

// deletes orderNumber if it is a child of orderStatus
function deleteMenuArray(itemName, ItemCategory){
    
    // pause for synchronicity
    pause(250);    
        
    var deleteMenuArrayRef = menus.child("Drinks").child(ItemCategory); //reference for the orderStatus

        // creates snapshot of the directory for the orderStatus
        deleteMenuArrayRef.once("value")
              .then(function(snapshot) {

                    // create array to store any values not removed from orderStatus directory
                    var reorderArray = new Array();
                    var numChild = snapshot.numChildren(); // number of orders under orderStatus

                    // cycles through each child of orderStatus directory
                    snapshot.forEach(function(childSnapshot){

                        // push the orderNumber at the current child to reorderArray
                        reorderArray.push(childSnapshot.val());

                        // check if the value of current child is the orderNumber to remove
                       if(childSnapshot.val() === itemName){

                            // check if the orderNumber to remove is the last child under the 
                           // orderStatus directory
                           if(numChild > 1){
                               // remove orderNumber from orderStatus directory, and remove
                               // from reorderArray so it's not added back to orderStatus
                                deleteMenuArrayRef.child(childSnapshot.key).remove();
                                reorderArray.pop();
                           }
                           else{
                               // leave an empty string at key 0, clear array
                                menus.child(itemCategory +'/' + 0).set("");
                                reorderArray.pop();
                           }  
                       }
                       else{
                            //nothing
                       }
              });

            // check if any orderNumber was removed from orderStatus, if numChild and
            // reorderArray.length match
            if(numChild === reorderArray.length){
                //nothing
            }
            else if(numChild === 1){ // this is the last remaining child and has already been set as empty string
                //nothing
            }
            else{
                //remove largest key as it will not be replaced by the reorderArray, avoids duplicates
                deleteMenuArrayRef.child(numChild - 1).remove();
                // pushes each value in array to corresponding key at orderStatus
                for(var i = 0; i<reorderArray.length; i++){
                    menus.child(ItemCategory + '/' + i).set(reorderArray[i]);
                }
            }
         });
}

// pause for synchronicity purposes due to firebase
function pause(milliseconds) {
	var firstDate = new Date();
	while ((new Date()) - firstDate <= milliseconds) { /* Do nothing */ }
}
