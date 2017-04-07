// read variable value "orderNumber" saved to localStorage from "viewOrders.html"
var orderNumber = localStorage.getItem("orderNumber"); 

var orders = firebase.database().ref().child('Orders'); //references to firebase
var orderToEdit = orders.child('OrderList/' + orderNumber);

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
                  updateStatus(orderNumber, tableNumber, menuItem, "Delivered");
                  updateStatus(orderNumber, tableNumber, menuItem, "InProgress");
                  updateStatus(orderNumber, tableNumber, menuItem, "Placed");
                  updateStatus(orderNumber, tableNumber, menuItem, "Ready");
                  updateStatus(orderNumber, tableNumber, menuItem, "SeeKitchen");
              });
            });


    });
    
    // pre-fills the form using the "fillForm" function after finding out
    // if the orderNumber is found under "Delivered"
    function updateStatus(orderNumber, tableNumber, menuItem, orderStatus){
    
        var updateStatusRef = orders.child(orderStatus); //reference to orderStatus directory

        // snapshot of "Delivered" directory, cycles each child of directory using
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
    
    // pre-fills the form using the "fillForm" function after finding out
    // if the orderNumber is found under "InProgress"
    function updateInProgress(orderNumber, tableNumber, menuItem){
    
        var inProgress = orders.child('InProgress'); //reference to "InProgress" Directory

        // snapshot of "InProgress" directory, cycles each child of directory using
        // forEach function and fills the form if it contains the orderNumber
        inProgress.once("value")
              .then(function(inProgressSnapshot) {
                   inProgressSnapshot.forEach(function(childSnapshot){
                       
                       if(childSnapshot.val() === orderNumber){
                           fillForm(tableNumber, menuItem, "InProgress");   
                       }
                       else{

                       }
              });
         });
        
    }
    
    // pre-fills the form using the "fillForm" function after finding out
    // if the orderNumber is found under "Placed"
    function updatePlaced(orderNumber, tableNumber, menuItem){
        
        var placed = orders.child('Placed'); //reference to "Placed" directory

        // snapshot of "Placed" directory, cycles each child of directory using
        // forEach function and fills the form if it contains the orderNumber
        placed.once("value")
              .then(function(placedSnapshot) {
                   placedSnapshot.forEach(function(childSnapshot){
  
                       if(childSnapshot.val() === orderNumber){
                           fillForm(tableNumber, menuItem, "Placed");   
                       }
                       else{
                           
                        }
              });
         });
        
    }
    
    // pre-fills the form using the "fillForm" function after finding out
    // if the orderNumber is found under "Ready"
    function updateReady(orderNumber, tableNumber, menuItem){
        
        var ready = orders.child('Ready'); // reference to "Ready" Directory
 
        // snapshot of "Ready" directory, cycles each child of directory using
        // forEach function and fills the form if it contains the orderNumber        
        ready.once("value")
              .then(function(readySnapshot) {
                   readySnapshot.forEach(function(childSnapshot){
                       
                       if(childSnapshot.val() === orderNumber){
                           fillForm(tableNumber, menuItem, "Ready");   
                       }
                       else{

                        }
              });
         });
        
    }
    
    // pre-fills the form using the "fillForm" function after finding out
    // if the orderNumber is found under "seeKitchen"
    function updateSeeKitchen(orderNumber, tableNumber, menuItem){
        
        var seeKitchen = orders.child('SeeKitchen'); // reference "seeKitchen" Directory

        // snapshot of "seeKitchen" directory, cycles each child of directory using
        // forEach function and fills the form if it contains the orderNumber  
        seeKitchen.once("value")
              .then(function(seeKitchenSnapshot) {
                   seeKitchenSnapshot.forEach(function(childSnapshot){

                       if(childSnapshot.val() === orderNumber){
                           fillForm(tableNumber, menuItem, "SeeKitchen");   
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
    }
}

// save changes made to the form to Firebase
function saveChanges(){
    // save inputs from the form as variables
    var menuItem = document.forms["editOrder"]["menuItem"].value;
    var tableNumber = document.forms["editOrder"]["tableNumber"].value;
    var orderStatus = document.forms["editOrder"]["orderStatus"].value;
    
    // create a new JSON order to push at the orderNumber
    var updatedOrder = {item: menuItem, tableKey: tableNumber}; 
    
    // push updatedOrder to firebase
    orders.child('OrderList/' + orderNumber).set(updatedOrder);
    
    // make statuschanges in Firebase, if necessary
    updateStatus(orderStatus, orderNumber);
    
    // clean up after yourself
    localStorage.removeItem("orderNumber");
    
    // return to table view
    window.location.href = 'viewOrders.html';
}

// pause for synchronicity purposes due to firebase
function pause(milliseconds) {
	var firstDate = new Date();
	while ((new Date()) - firstDate <= milliseconds) { /* Do nothing */ }
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
    pause(500);
  
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