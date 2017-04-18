function loadServers(){
	
	var query = firebase.database().ref('Users/Server').orderByChild("name");
query.once("value").then(function(snapshot) {
	snapshot.forEach(function(childSnapshot){
	var serverKey = childSnapshot.key;
	var childData = childSnapshot.val();
	if(serverKey === 'serverCounter'){
	   ;
	}
	else{
		addToTable(serverKey, childData);
		
	}
  });
 });
}

 function addToTable(serverKey, data){
	
	//var ref = firebase.database.ref('Users/Server/' + serverKey);
	//ref = ref.child("assignedTables");
	var editButton = '<a class="blue-text" id="'+serverKey+'" onClick="editTable(this.id)"><i class="fa fa-pencil"></i></a>';
    var deleteButton = '<a class="red-text" id="'+serverKey+'" onClick="deleteTable(this.id)"><i class="fa fa-times">';

	var table = document.getElementById("serverTable");
    var rowCount = table.rows.length; 
	var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);
	var tables = data.assignedTables;
	cell1.innerHTML = data.name;
	
	var x = tables[0];
	x = x.toString();
    cell1.innerHTML = data.name;
	if(x !== undefined){
		cell2.innerHTML = x;
	}
    
	x = tables[1];
	x = x.toString();
	if(x !== undefined){
		cell3.innerHTML = x;
	}
    
	x = tables[2];
	x = x.toString();
	if(x !== undefined){
		cell4.innerHTML = x;
	}
	
	x = tables[3];
	x = x.toString();
	if(x !== undefined){
		cell5.innerHTML = x;
	}
	
	cell6.innerHTML = editButton + " " + deleteButton;
 }

 function editTable(serverKey){
	 var childData;
	 var y = prompt("What table would you like to assign?");
	 var ref = firebase.database().ref('Users/Server/' + serverKey);
	 ref.once("value").then(function(snapshot){
		 childData = snapshot.val();
		 console.log(childData);
		  var tables = childData.assignedTables;
		for(var i = 0; i < tables.length; i++)
		{
			if(tables[i] === ""){
				tables[i] = y;
				break;
			}
		}
		
		childData.assignedTables = tables;
		ref.set(childData);
		location.reload(true);
	 }); 
 }
 
 function deleteTable(serverKey){
	 var childData;
	 var y = prompt("What table would you like to delete?");
	 var ref = firebase.database().ref('Users/Server/' + serverKey);
	 ref.once("value").then(function(snapshot){
		 childData = snapshot.val();
		 console.log(childData);
		  var tables = childData.assignedTables;
		for(var i = 0; i < tables.length; i++)
		{
			if(tables[i] === y){
				tables[i] = "";
				break;
			}
		}
		
		childData.assignedTables = tables;
		ref.set(childData);
		location.reload(true);
	 }); 
 }
