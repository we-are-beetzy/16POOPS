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
                  updateDelivered(orderNumber, tableNumber, menuItem);
                  updateInProgress(orderNumber, tableNumber, menuItem);
                  updatePlaced(orderNumber, tableNumber, menuItem);
                  updateReady(orderNumber, tableNumber, menuItem);
                  updateSeeKitchen(orderNumber, tableNumber, menuItem);
              });
            });


    });
    
    // pre-fills the form using the "fillForm" function after finding out
    // if the orderNumber is found under "Delivered"
    function updateDelivered(orderNumber, tableNumber, menuItem){
    
        var delivered = orders.child('Delivered'); //reference to "Delivered" directory

        // snapshot of "Delivered" directory, cycles each child of directory using
        // forEach function and fills the form if it contains the orderNumber
        delivered.once("value")
              .then(function(deliveredSnapshot) {
                   deliveredSnapshot.forEach(function(childSnapshot){
                       
                       if(childSnapshot.val() === orderNumber){
                           fillForm(tableNumber, menuItem, "Delivered");   
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
    removeDelivered(orderNumber);
    removeInProgress(orderNumber);
    removePlaced(orderNumber);
    removeReady(orderNumber);
    removeSeeKitchen(orderNumber);
        
    var newStatus = orders.child(orderStatus); // reference to the new orderStatus directory
        
    
    newStatus.once("value")
        .then(function(snapshot) {
            var newKey = snapshot.numChildren(); 
            if(snapshot.child(0).val() == ""){
            orders.child(orderStatus + '/' + 0).set(orderNumber.toString());
            }
            else{
            orders.child(orderStatus + '/' + newKey).set(orderNumber.toString());
            }
    });
    
    // 
    pause(500);
  
    function removeDelivered(orderNumber){
        var delivered = orders.child('Delivered');
        //var result;
        

            delivered.once("value")
                  .then(function(deliveredSnapshot) {
                        var reorderArray = new Array();
                        var numChild = deliveredSnapshot.numChildren();
                        deliveredSnapshot.forEach(function(childSnapshot){
                            
                            reorderArray.push(childSnapshot.val());
                                                      
                           if(childSnapshot.val() === orderNumber){
                               
                               //console.log("luck");
                                if(numChild > 1){
                                    delivered.child(childSnapshot.key).remove();
                                    reorderArray.pop();
                               }
                               else{
                                    orders.child('Delivered/' + 0).set("");
                                    reorderArray.pop();
                               }  
                           }
                           else{
                               //console.log("bad luck");
                            }
                  });
                console.log(reorderArray);
                if(numChild === reorderArray.length){
                    //nothing
                }
                else if(numChild === 1){
                    //nothing
                }
                else{
                    delivered.child(numChild - 1).remove();
                    for(var i = 0; i<reorderArray.length; i++){
                        orders.child('Delivered/' + i).set(reorderArray[i]);
                    }
                }
             });
    } 
    
    function removeInProgress(orderNumber){
        var inProgress = orders.child('InProgress');
        //var result;
        
        console.log("removeInProgress");


            inProgress.once("value")
                  .then(function(inProgressSnapshot) {
                        var reorderArray = new Array();
                        var numChild = inProgressSnapshot.numChildren();
                        inProgressSnapshot.forEach(function(childSnapshot){
                            
                            reorderArray.push(childSnapshot.val());
                                                      
                           if(childSnapshot.val() === orderNumber){
                               
                               //console.log("luck");
                                if(numChild > 1){
                                    inProgress.child(childSnapshot.key).remove();
                                    reorderArray.pop();
                               }
                               else{
                                    orders.child('InProgress/' + 0).set("");
                                    reorderArray.pop();
                               }  
                           }
                           else{
                               //console.log("bad luck");
                            }
                  });
                console.log(reorderArray);
                if(numChild === reorderArray.length){
                    //nothing
                }
                else if(numChild === 1){
                    //nothing
                }
                else{
                    inProgress.child(numChild - 1).remove();
                    for(var i = 0; i<reorderArray.length; i++){
                        orders.child('InProgress/' + i).set(reorderArray[i]);
                    }
                }
             });
    }  
    
    function removeReady(orderNumber){
        var ready = orders.child('Ready');
        //var result;
        
        console.log("removeReady");


            ready.once("value")
                  .then(function(readySnapshot) {
                        var reorderArray = new Array();
                        var numChild = readySnapshot.numChildren();
                        readySnapshot.forEach(function(childSnapshot){
                            
                            reorderArray.push(childSnapshot.val());
                                                      
                           if(childSnapshot.val() === orderNumber){
                               
                               //console.log("luck");
                                if(numChild > 1){
                                    ready.child(childSnapshot.key).remove();
                                    reorderArray.pop();
                               }
                               else{
                                    orders.child('Ready/' + 0).set("");
                                    reorderArray.pop();
                               }  
                           }
                           else{
                               //console.log("bad luck");
                            }
                  });
                console.log(reorderArray);
                if(numChild === reorderArray.length){
                    //nothing
                }
                else if(numChild === 1){
                    //nothing
                }
                else{
                    ready.child(numChild - 1).remove();
                    for(var i = 0; i<reorderArray.length; i++){
                        orders.child('Ready/' + i).set(reorderArray[i]);
                    }
                }
             });
    } 
    
    function removePlaced(orderNumber){
        var placed = orders.child('Placed');
        //var result;
        
        console.log("removePlaced");


            placed.once("value")
                  .then(function(placedSnapshot) {
                        var reorderArray = new Array();
                        var numChild = placedSnapshot.numChildren();
                        placedSnapshot.forEach(function(childSnapshot){
                            
                            reorderArray.push(childSnapshot.val());
                                                      
                           if(childSnapshot.val() === orderNumber){
                               
                               //console.log("luck");
                                if(numChild > 1){
                                    placed.child(childSnapshot.key).remove();
                                    reorderArray.pop();
                               }
                               else{
                                    orders.child('Placed/' + 0).set("");
                                    reorderArray.pop();
                               }  
                           }
                           else{
                               //console.log("bad luck");
                            }
                  });
                console.log(reorderArray);
                if(numChild === reorderArray.length){
                    //nothing
                }
                else if(numChild === 1){
                    //nothing
                }
                else{
                    placed.child(numChild - 1).remove();
                    for(var i = 0; i<reorderArray.length; i++){
                        orders.child('Placed/' + i).set(reorderArray[i]);
                    }
                }
             });
    } 
    
    function removeSeeKitchen(orderNumber){
        var seeKitchen = orders.child('SeeKitchen');
        //var result;
        
        console.log("removeSeeKitchen");


            seeKitchen.once("value")
                  .then(function(seeKitchenSnapshot) {
                        var reorderArray = new Array();
                        var numChild = seeKitchenSnapshot.numChildren();
                       seeKitchenSnapshot.forEach(function(childSnapshot){
                            reorderArray.push(childSnapshot.val());
                           
                           
                           if(childSnapshot.val() === orderNumber){
                               //console.log("luck");
                                if(numChild > 1){
                                    seeKitchen.child(childSnapshot.key).remove();
                                    reorderArray.pop();
                               }
                               else{
                                    orders.child('SeeKitchen/' + 0).set("");
                                    reorderArray.pop();
                               }  
                           }
                           else{
                               //console.log("bad luck");
                            }
                  });
                console.log(reorderArray);
                if(numChild === reorderArray.length){
                    //nothing
                }
                else if(numChild === 1){
                    //nothing
                }
                else{
                    seeKitchen.child(numChild - 1).remove();
                    for(var i = 0; i<reorderArray.length; i++){
                        orders.child('SeeKitchen/' + i).set(reorderArray[i]);
                    }
                }
             });
    }
}