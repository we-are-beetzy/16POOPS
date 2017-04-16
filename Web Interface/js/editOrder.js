// read variable value "orderNumber" saved to localStorage from "viewOrders.html"
var orderNumber = localStorage.getItem("orderNumber"); 

var orders = firebase.database().ref().child('Orders'); //references to firebase
var orderToEdit = orders.child('OrderList/' + orderNumber);

var tables = firebase.database().ref().child('Tables');


// runs onLoad, automatically fills in the "Edit Order" form
function setForm(){
    
    // creates a snapshot of the Order menuItem and tableKey for
    // the given orderNumber from OrderList
    orderToEdit.once("value")
      .then(function(snapshot) {
        
        var tableNumber = snapshot.val().tableKey;
        var menuItem = snapshot.val().item;

        // creates a snapshot of "Orders" directory, and traverses
        // each order status through the "updateDelivered()" function
        // in order to find the correct orderStatus to pre-fill the form
        orders.once("value")
        .then(function(snapshot) {
              snapshot.forEach(function(childSnapshot){
                  updateOrder(orderNumber, tableNumber, menuItem, "Delivered");
                  updateOrder(orderNumber, tableNumber, menuItem, "InProgress");
                  updateOrder(orderNumber, tableNumber, menuItem, "Placed");
                  updateOrder(orderNumber, tableNumber, menuItem, "Ready");
                  updateOrder(orderNumber, tableNumber, menuItem, "SeeKitchen");
              });
            });


    });
    
    // pre-fills the form using the "fillForm" function after finding out
    // if the orderNumber is found under orderStatus
    function updateOrder(orderNumber, tableNumber, menuItem, orderStatus){
    
        var updateStatusRef = orders.child(orderStatus); //reference to orderStatus directory

        // snapshot of orderStatus directory, cycles each child of directory using
        // forEach function and fills the form if it contains the orderNumber
        updateStatusRef.once("value")
              .then(function(snapshot) {
                   snapshot.forEach(function(childSnapshot){
                       
                       if(childSnapshot.val() === orderNumber){
                           fillForm(tableNumber, menuItem, orderStatus);   
                       }
                       else{

                        }
              });
         });
        
    }
  
    // fills in the parameter into the corresponding inputs on the form in
    // "editOrder.html"
    function fillForm(tableNumber, menuItem, orderStatus){
        document.getElementById("tableNumber").value = tableNumber;
        document.getElementById("menuItem").value = menuItem;
        document.getElementById("orderStatus").value = orderStatus;
        localStorage.setItem("oldOrderStatus", orderStatus);
        localStorage.setItem("oldTableNumber", tableNumber)
    }
}

// save changes made to the form to Firebase
function saveChanges(){
    // read variable from "oldOrderStatus" in localStorage
    var oldOrderStatus = localStorage.getItem("oldOrderStatus"); 
    var oldTableNumber = localStorage.getItem("oldTableNumber");
 
    // save inputs from the form as variables
    var menuItem = document.forms["editOrder"]["menuItem"].value;
    var tableNumber = document.forms["editOrder"]["tableNumber"].value;
    var orderStatus = document.forms["editOrder"]["orderStatus"].value;
    
    // create a new JSON order to push at the orderNumber
    var updatedOrder = {item: menuItem, tableKey: tableNumber}; 
    

    
    // push updatedOrder to firebase
    orders.child('OrderList/' + orderNumber).set(updatedOrder);
    
    if(tableNumber == oldTableNumber){
        //nothing
        console.log("table number is same");
    }
    else{
        // remove from old Table, add to new
        deleteTable(orderNumber);
        pause(250);
        addToTable(tableNumber, orderNumber);

    }
    
    
    if(orderStatus === oldOrderStatus){
        // nothing
    }
    else{
        // make statuschanges in Firebase, if necessary
        updateStatus(orderStatus, orderNumber);
    }
    
    // clean up after yourself
    localStorage.removeItem("orderNumber");
    localStorage.removeItem("oldOrderStatus");
    
    // return to table view
    window.location.href = 'viewOrders.html';
}


// will remove orderNumber from old status, then place it 
// into the new status that is read from the form in "editOrder.html"
function updateStatus(orderStatus, orderNumber){
    
    // go to each Order status directory, and remove the orderNumber
    // wherever it is present
    removeStatus(orderNumber, "Delivered");
    removeStatus(orderNumber, "InProgress");
    removeStatus(orderNumber, "Placed");
    removeStatus(orderNumber, "Ready");
    removeStatus(orderNumber, "SeeKitchen");
        
    var newStatus = orders.child(orderStatus); // reference to the new orderStatus directory
        
    // creates snapshot of the newStatus directory and if it has an empty child at key 0
    // the orderNumber will be added at key 0, else it will create a new key and place it there
    newStatus.once("value")
        .then(function(snapshot) {
        
            var newKey = snapshot.numChildren(); // potential new key for the orderNumber at newStatus
            if(snapshot.child(0).val() == ""){
                orders.child(orderStatus + '/' + 0).set(orderNumber.toString());
            }
            else{
                orders.child(orderStatus + '/' + newKey).set(orderNumber.toString());
            }
    });
    
    // pause for synchronicity
    pause(250);
  
    // removes the orderNumber if it's present in the orderStatus directory
    // fixes the array at each orderStatus if necessary, will also leave
    // an empty string at key 0 if it is the last remaining orderNumber in 
    // the given orderStatus directory
    function removeStatus(orderNumber, orderStatus){
       
        var newOrderRef = orders.child(orderStatus); //reference for the orderStatus

            // creates snapshot of the directory for the orderStatus
            newOrderRef.once("value")
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
                                    newOrderRef.child(childSnapshot.key).remove();
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
                    newOrderRef.child(numChild - 1).remove();
                    // pushes each value in array to corresponding key at orderStatus
                    for(var i = 0; i<reorderArray.length; i++){
                        orders.child(orderStatus + '/' + i).set(reorderArray[i]);
                    }
                }
             });
    } 
    
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


    // creates snapshot of the directory for the orderStatus
    deleteTableRef.once("value") // im having trouble getting inside of this snapshot, maybe create a new function or check reference
          .then(function(snapshot) {
                console.log("inside the tableref snapshot");
                
                    console.log("table ref is " + snapshot.key);
                

                pause(250);

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

// Add an order to it's Table when creating an order
function addToTable(tableNumber, orderNumber){
    
        var tableOrders = tables.child(tableNumber + '/Orders/');
        tableOrders.once("value")
          .then(function(snapshot) {
            var numChild = snapshot.numChildren(); 
            
            // replace value at key 0 if empty
            if(snapshot.child(0).val() == ""){
                tables.child( tableNumber + '/Orders/' + 0).set(orderNumber.toString());
            }
            else{
                tables.child(tableNumber + '/Orders/' + numChild).set(orderNumber.toString());
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