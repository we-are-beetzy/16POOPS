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
            
        cell1.innerHTML = childData[0];  // order ID
        cell2.innerHTML = childData[1]; // Item Name
        cell3.innerHTML = editButton + " " + deleteButton;
     }
    
	 
 };

