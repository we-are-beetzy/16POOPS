var orders = firebase.database().ref().child('Orders'); // references to firebase
var orderList = orders.child('OrderList');
var tables = firebase.database().ref().child('Tables');

// runs onLoad for "viewOrders.html"
function loadOrders(){

    // creates snapshot for orderList directory
    orderList.once("value")
      .then(function(snapshot) {

        // cycles through each child (orders) in orderList
        snapshot.forEach(function(childSnapshot){
            
            // orderNumber is the key for the Order and 
            // childData will hold the values from the order
            // item and tableKey
            var orderNumber = childSnapshot.key;
            var childData = new Array();  
            
            // cycles through the children of each order
            // and pushes item and tableKey to childData
            childSnapshot.forEach(function(orderValues){
                childData.push(orderValues.val());
            });

            // avoids the "Example" order, there to avoid deleting 
            // OrderList
            if(orderNumber == 'Example'){
                // nothing
            }
            else{
                // checks each orderStatus and prints the orders that are
                // found in that directory to the table
                printOrders(orderNumber, childData, "Delivered");
                printOrders(orderNumber, childData, "InProgress");
                printOrders(orderNumber, childData, "Placed");
                printOrders(orderNumber, childData, "Ready");
                printOrders(orderNumber, childData, "SeeKitchen");

            }
        });
     });

     // adds a new row to the table with the right parameters
     function addToTable(orderNumber, childData, orderStatus){
         // declare edit button and delete button
        var editButton = '<a class="blue-text" id="'+orderNumber+'" onClick="editAction(this.id)"><i class="fa fa-pencil"></i></a>';
        var deleteButton = '<a class="red-text" id="'+orderNumber+'" onClick="deleteAction(this.id)"><i class="fa fa-times">';
         
        // creates a row with 5 horizontal cells in "orderTable" in "viewOrders.html"
        var table = document.getElementById("orderTable");
        var rowCount = table.rows.length; 
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
         
        // fill in each cell in the row
        cell1.innerHTML = orderNumber;  // order ID
        cell2.innerHTML = childData[1]; // Table Number
        cell3.innerHTML = childData[0]; // Menu Item
        cell4.innerHTML = orderStatus; //  should be table status
        cell5.innerHTML = editButton + " " + deleteButton; // self-explanatory
        
     }
    
    // finds the orderStatus of the orderNumber and prints it to the table
    function printOrders(orderNumber, childData, orderStatus){
       
        var currentOrderRef = orders.child(orderStatus); // reference to firebase for orderStatus
        
        // snapshot for orderStatus
        currentOrderRef.once("value")
              .then(function(snapshot) {
                    // cycles through each child order in orderStatus
                   snapshot.forEach(function(childSnapshot){
                        // if the orderNumber is a child of orderStatus it will be added to the 
                       // table with that orderStatus
                       if(childSnapshot.val() === orderNumber){
                           addToTable(orderNumber, childData, orderStatus)   
                       }
                       else{
                           // nothing
                        }
              });
         });
        
    }
}

// runs when an editButton is clicked, the parameter is the corresponding 
// orderNumber for the button's row
function editAction(orderNumber){
    console.log("edit " + orderNumber);
    
    // saves the orderNumber to localStorage for retrieval in "editOrder.html"
    localStorage.setItem("orderNumber", orderNumber);
    window.location.href = 'editOrder.html'; // navigate to "editOrder.html"
}

// runs when a deleteButton is clicked, the parameter is the corresponding
// orderNumber for the button's row
function deleteAction(orderNumber){
    // double check it's the right order to delete
    if(confirm('Are you sure you wish to delete order ' + orderNumber + '?')){
        deleteHandler(orderNumber);
        pause(2000);
        console.log("delete " + orderNumber);
        location.reload(true); // reload page after deleting order
    }
    else{
        //nothing
    }
}

// calls delete status for each possible orderStatus
function deleteHandler(orderNumber){
    deleteTable(orderNumber);
    deleteStatus(orderNumber, "Delivered");
    deleteStatus(orderNumber, "InProgress");
    deleteStatus(orderNumber, "Placed");
    deleteStatus(orderNumber, "Ready");
    deleteStatus(orderNumber, "SeeKitchen");
    removeOrdersList(orderNumber);
}

// deletes orderNumber if it is a child of orderStatus
function deleteStatus(orderNumber, orderStatus){
    
    // pause for synchronicity
    pause(250);    
        
    var deleteStatusRef = orders.child(orderStatus); //reference for the orderStatus

        // creates snapshot of the directory for the orderStatus
        deleteStatusRef.once("value")
              .then(function(snapshot) {

                    // create array to store any values not removed from orderStatus directory
                    var reorderArray = new Array();
                    var numChild = snapshot.numChildren(); // number of orders under orderStatus

                    // cycles through each child of orderStatus directory
                    snapshot.forEach(function(childSnapshot){

                        // push the orderNumber at the current child to reorderArray
                        reorderArray.push(childSnapshot.val());

                        // check if the value of current child is the orderNumber to remove
                       if(childSnapshot.val() === orderNumber){

                            // check if the orderNumber to remove is the last child under the 
                           // orderStatus directory
                           if(numChild > 1){
                               // remove orderNumber from orderStatus directory, and remove
                               // from reorderArray so it's not added back to orderStatus
                                deleteStatusRef.child(childSnapshot.key).remove();
                                reorderArray.pop();
                           }
                           else{
                               // leave an empty string at key 0, clear array
                                orders.child(orderStatus +'/' + 0).set("");
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
                deleteStatusRef.child(numChild - 1).remove();
                // pushes each value in array to corresponding key at orderStatus
                for(var i = 0; i<reorderArray.length; i++){
                    orders.child(orderStatus + '/' + i).set(reorderArray[i]);
                }
            }
         });
}



// deletes orderNumber in the Table Directory
function deleteTable(orderNumber){
    
    // pause for synchronicity
    pause(250);    
    
    // find table number and save in localStorage
    var findTableRef = orders.child('OrderList').child(orderNumber);
    
    findTableRef.once("value")
        .then(function(snapshot) {
            localStorage.setItem("tableNumber", snapshot.val().tableKey);
    });
    
    var tableNumber = localStorage.getItem("tableNumber"); 
    console.log(tableNumber);
    deleteTableOrder(tableNumber, orderNumber);

}

// deletes an order from its table
function deleteTableOrder(tableNumber, orderNumber){

    console.log("deleteTableOrder function for " + tableNumber);
    var deleteTableRef = tables.child(tableNumber).child('Orders'); //reference for the orderStatus


    pause(500);
    // creates snapshot of the directory for the orderStatus
    deleteTableRef.once("value") // im having trouble getting inside of this snapshot, maybe create a new function or check reference
          .then(function(snapshot) {
                console.log("inside the tableref snapshot");
                
                    console.log("table ref is " + snapshot.key);
                

                pause(500);

                // create array to store any values not removed from orderStatus directory
                var reorderArray = new Array();
                var numChild = snapshot.numChildren(); // number of orders under orderStatus
                console.log(tableNumber + " has " + numChild);

                // cycles through each child of table directory
                snapshot.forEach(function(childSnapshot){
                    console.log(childSnapshot.key);

                    // push the orderNumber at the current child to reorderArray
                    reorderArray.push(childSnapshot.val());

                    // check if the value of current child is the orderNumber to remove
                   if(childSnapshot.val() === orderNumber){

                        // check if the orderNumber to remove is the last child under the 
                       // orderStatus directory
                       if(numChild > 1){
                           // remove orderNumber from orderStatus directory, and remove
                           // from reorderArray so it's not added back to orderStatus
                            deleteTableRef.child(childSnapshot.key).remove();
                            reorderArray.pop();
                       }
                       else{
                           // leave an empty string at key 0, clear array
                            tables.child(tableNumber +'/Orders/' + 0).set("");
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
            deleteTableRef.child(numChild - 1).remove();
            // pushes each value in array to corresponding key at orderStatus
            for(var i = 0; i<reorderArray.length; i++){
                tables.child(tableNumber + '/Orders/' + i).set(reorderArray[i]);
            }
        }
     });
}


function removeOrdersList(orderNumber){
    pause(250);
    orderList.child(orderNumber).remove();
}

// pause for synchronicity purposes due to firebase
function pause(milliseconds) {
	var firstDate = new Date();
	while ((new Date()) - firstDate <= milliseconds) { /* Do nothing */ }
}