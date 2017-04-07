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
		
        addToTable(name, childData);
		//drinksCategory(name, childData);
		//foodCategory(name, childData);
		
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
				alcoholCat.forEach(function(childSnapshot){
					if(childSnapshot.val() === name){
						addToTable(name, childData, "Alcohol")
					}
				});
			});
			
		//Finds menu item in "SoftDrinks
		softDrinksCat.once("value")
			.then(function(dinksSnapshot) {
				softDrinksCat.forEach(function(childSnapshot){
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
				appetizersCat.forEach(function(childSnapshot){
					if(childSnapshot.val() === name){
						addToTable(name, childData, "Appetizers")
					}
				});
			});
			
		//Finds menu item in Dessert
		dessertCat.once("value")
			.then(function(foodSnapshot) {
				dessertCat.forEach(function(childSnapshot){
					if(childSnapshot.val() === name){
						addToTable(name, childData, "Dessert")
					}
				});
			});
			
		//Finds menu item in Entree
		entreeCat.once("value")
			.then(function(foodSnapshot) {
				entreeCat.forEach(function(childSnapshot){
					if(childSnapshot.val() === name){
						addToTable(name, childData, "Entree")
					}
				});
			});
			
		//Finds menu item in Sides
		sidesCat.once("value")
			.then(function(foodSnapshot) {
				sidesCat.forEach(function(childSnapshot){
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
        console.log("delete " + itemName);
        location.reload(true);
    }
    else{
		
	}
}

