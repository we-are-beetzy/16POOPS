var menu = firebase.database().ref().child('Menu');
var menuItems = menu.child('MenuItems');

function loadMenu(){
	
    menuItems.once("value").then(function(snapshot) {

		snapshot.forEach(function(childSnapshot){
            
		var name = childSnapshot.key;
        //var childData = (array)childSnapshot.val();
        var childData = new Array();
        var i = 0;  
            
        childSnapshot.forEach(function(menuValues){
            childData.push(menuValues.val());
                              });
            
        console.log(childData[0]);  
		
        //addToTable(name, childData);
		drinksCategory(name, childData);
		foodCategory(name, childData);
		
		});
	});
	
	function addToTable(name, childData, itemCategory){
        var editButton = '<a class="blue-text" id="'+name+'" onClick="editAction(this.id)"><i class="fa fa-pencil"></i></a>';
         
        var deleteButton = '<a class="red-text" id="'+name+'" onClick="deleteAction(this.id)"><i class="fa fa-times">';
        deleteButton.id = name;
         
        var table = document.getElementById("menuTable");
        var rowCount = table.rows.length; 
        var row = table.insertRow(rowCount);
		var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
          
        cell1.innerHTML = itemCategory;// Item Category
		cell2.innerHTML = childData[0];  // Item Name
        cell3.innerHTML = childData[1]; // Item Price
        cell4.innerHTML = editButton + " " + deleteButton;
	}
	
	function drinksCategory(name, childData){
        var alcoholCat = menu.child('Drinks').child('Alcohol');
		var softDrinksCat = menu.child('Drinks').child('SoftDrinks');
        
		//Finds menu item in Alcohol
        alcoholCat.once("value")
			.then(function(dinksSnapshot) {
				dinksSnapshot.forEach(function(childSnapshot){
					if(childSnapshot.val() === name){
						addToTable(name, childData, "Alcohol")
					}
				});
			});
			
		//Finds menu item in "SoftDrinks
		softDrinksCat.once("value")
			.then(function(dinksSnapshot) {
				dinksSnapshot.forEach(function(childSnapshot){
					if(childSnapshot.val() === name){
						addToTable(name, childData, "Soft Drink")
					}
				});
			});
        
    }
	
	function foodCategory(name, childData){
        var appetizersCat = menu.child('Food').child('Appetizers');
		var dessertCat = menu.child('Food').child('Dessert');
		var entreeCat = menu.child('Food').child('Entree');
		var sidesCat = menu.child('Food').child('Sides');
        
		//Finds menu item in Appetizers
        appetizersCat.once("value")
			.then(function(foodSnapshot) {
				foodSnapshot.forEach(function(childSnapshot){
					if(childSnapshot.val() === name){
						addToTable(name, childData, "Appetizers")
					}
				});
			});
			
		//Finds menu item in Dessert
		dessertCat.once("value")
			.then(function(foodSnapshot) {
				foodSnapshot.forEach(function(childSnapshot){
					if(childSnapshot.val() === name){
						addToTable(name, childData, "Dessert")
					}
				});
			});
			
		//Finds menu item in Entree
		entreeCat.once("value")
			.then(function(foodSnapshot) {
				foodSnapshot.forEach(function(childSnapshot){
					if(childSnapshot.val() === name){
						addToTable(name, childData, "Entree")
					}
				});
			});
			
		//Finds menu item in Sides
		sidesCat.once("value")
			.then(function(foodSnapshot) {
				foodSnapshot.forEach(function(childSnapshot){
					if(childSnapshot.val() === name){
						addToTable(name, childData, "Sides")
					}
				});
			});
        
    }
    
	 
 }
 
 function editAction(itemName){
    console.log("edit " + itemName);
    localStorage.setItem("itemName", itemName);
    window.location.href = 'editMenuItem.html';
}

function deleteAction(itemName){
    if(confirm('Are you sure you wish to delete item ' + itemName + '?')){
        menuItems.child(itemName).remove();
		
		deleteMenuArray(itemName, "Alcohol");
		deleteMenuArray(itemName, "SoftDrinks");
		deleteMenuArray(itemName, "Appetizers");
		deleteMenuArray(itemName, "Dessert");
		deleteMenuArray(itemName, "Entree");
		deleteMenuArray(itemName, "Sides");
		
        console.log("delete " + itemName);
        location.reload(true);
    }
    else{
		
	}
}

// deletes orderNumber if it is a child of orderStatus
function deleteMenuArray(itemName, ItemCategory){
    
    // pause for synchronicity
    pause(250);    
        
    var deleteMenuArrayRef = menu.child("Drinks").child(ItemCategory); //reference for the orderStatus

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
                                menu.child(itemCategory +'/' + 0).set("");
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
                    menu.child(ItemCategory + '/' + i).set(reorderArray[i]);
                }
            }
         });
}

// pause for synchronicity purposes due to firebase
function pause(milliseconds) {
	var firstDate = new Date();
	while ((new Date()) - firstDate <= milliseconds) { /* Do nothing */ }
}

