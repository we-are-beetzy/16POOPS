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
		});
	});
	
		function addToTable(name, childData){
        var editButton = '<a class="blue-text" id="'+name+'" onClick="editAction(this.id)"><i class="fa fa-pencil"></i></a>';
        //editButton.id = orderNumber;
        //editButton.onClick = editAction(this.id);
         
        var deleteButton = '<a class="red-text" id="'+name+'" onClick="deleteAction(this.id)"><i class="fa fa-times">';
        deleteButton.id = name;
         
        var table = document.getElementById("menuTable");
        var rowCount = table.rows.length; 
        var row = table.insertRow(rowCount);
		var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
            
        cell2.innerHTML = childData[0];  // Item Name
        cell3.innerHTML = childData[1]; // Item Price
        cell4.innerHTML = editButton + " " + deleteButton;
     }
    
	 
 }
 
 function editAction(itemName){
    console.log("edit " + itemName);
    localStorage.setItem("Item: ", itemName);
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

