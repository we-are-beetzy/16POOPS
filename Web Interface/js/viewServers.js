var server = firebase.database().ref().child('Server');

function loadMenu(){
	
    server.once("value").then(function(snapshot) {

		snapshot.forEach(function(childSnapshot){
            
		var name = childSnapshot.key;
        //var childData = (array)childSnapshot.val();
        var childData = new Array();
        var i = 0;  
            
        childSnapshot.forEach(function(serverValues){
            childData.push(serverValues.val());
                              });
            
        console.log(childData[0]);  
		
        addToTable(name, childData);
		
		});
	});
	
	function addToTable(name, childData){
        var editButton = '<a class="blue-text" id="'+name+'" onClick="editAction(this.id)"><i class="fa fa-pencil"></i></a>';
         
        var deleteButton = '<a class="red-text" id="'+name+'" onClick="deleteAction(this.id)"><i class="fa fa-times">';
        deleteButton.id = name;
         
        var table = document.getElementById("serverTable");
        var rowCount = table.rows.length; 
        var row = table.insertRow(rowCount);
		var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
          
        cell1.innerHTML = itemCategory;// Item Category
		cell2.innerHTML = childData[0];  // Server Name
        cell3.innerHTML = childData[1]; // Server table
        cell4.innerHTML = editButton + " " + deleteButton;
	}
	
}	
 
 function editAction(tables){
    console.log("edit " + table);
    localStorage.setItem("Table:", table);
    //window.location.href = '_.html';
}

function deleteAction(name){
    if(confirm('Are you sure you wish to delete item ' + name + '?')){
        server.child(name).remove();
		
		deleteTablesArray(name, "assignedTables");
		
        console.log("delete " + name);
        location.reload(true);
    }
    else{
		
	}
}

// deletes orderNumber if it is a child of orderStatus
function deleteTablesArray(name, assignedTables){
    
    // pause for synchronicity
    pause(250);    
        
    var deleteTableArrayRef = server.child("assignedTables").child(assignedTables); //reference for the orderStatus

        // creates snapshot of the directory for the orderStatus
        deleteTableArrayRef.once("value")
              .then(function(snapshot) {

                    // create array to store any values not removed from orderStatus directory
                    var reorderArray = new Array();
                    var numChild = snapshot.numChildren(); // number of orders under orderStatus

                    // cycles through each child of orderStatus directory
                    snapshot.forEach(function(childSnapshot){

                        // push the orderNumber at the current child to reorderArray
                        reorderArray.push(childSnapshot.val());

                        // check if the value of current child is the orderNumber to remove
                       if(childSnapshot.val() === name){

                            // check if the orderNumber to remove is the last child under the 
                           // orderStatus directory
                           if(numChild > 1){
                               // remove orderNumber from orderStatus directory, and remove
                               // from reorderArray so it's not added back to orderStatus
                                deleteTableArrayRef.child(childSnapshot.key).remove();
                                reorderArray.pop();
                           }
                           else{
                               // leave an empty string at key 0, clear array
                                server.child(assignedTables +'/' + 0).set("");
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
                deleteTableArrayRef.child(numChild - 1).remove();
                // pushes each value in array to corresponding key at orderStatus
                for(var i = 0; i<reorderArray.length; i++){
                    server.child(assignedTables + '/' + i).set(reorderArray[i]);
                }
            }
         });
}

// pause for synchronicity purposes due to firebase
function pause(milliseconds) {
	var firstDate = new Date();
	while ((new Date()) - firstDate <= milliseconds) { /* Do nothing */ }
}

