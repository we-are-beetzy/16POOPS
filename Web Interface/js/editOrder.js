var orderNumber = localStorage.getItem("orderNumber");

var orders = firebase.database().ref().child('Orders');
var orderToEdit = orders.child('OrderList/' + orderNumber);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setForm(){
    //document.getElementById("menuItem").value = "Apple Pie";
    
    
    orderToEdit.once("value")
      .then(function(snapshot) {

        var tableNumber = snapshot.val().tableKey;
        var menuItem = snapshot.val().item;

        //console.log(tableNumber + " " + menuItem);
        
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
    
    function updateDelivered(orderNumber, tableNumber, menuItem){
    var delivered = orders.child('Delivered');
    //var result;

        delivered.once("value")
              .then(function(deliveredSnapshot) {
                   deliveredSnapshot.forEach(function(childSnapshot){

                    //console.log(childSnapshot.key); 
                    //console.log(childSnapshot.val());
                       
                   if(childSnapshot.val() === orderNumber){
                       //console.log("luck");
                       fillForm(tableNumber, menuItem, "Delivered");   
                   }
                   else{
                       //console.log("bad luck");
                    }
              });
         });
        
    }
    
    function updateInProgress(orderNumber, tableNumber, menuItem){
    var inProgress = orders.child('InProgress');
    //var result;

        inProgress.once("value")
              .then(function(inProgressSnapshot) {
                   inProgressSnapshot.forEach(function(childSnapshot){

                    //console.log(childSnapshot.key); 
                    //console.log(childSnapshot.val());
                       
                   if(childSnapshot.val() === orderNumber){
                       //console.log("luck");
                       fillForm(tableNumber, menuItem, "InProgress");   
                   }
                   else{
                       //console.log("bad luck");
                    }
              });
         });
        
    }
    
    function updatePlaced(orderNumber, tableNumber, menuItem){
    var placed = orders.child('Placed');
    //var result;

        placed.once("value")
              .then(function(placedSnapshot) {
                   placedSnapshot.forEach(function(childSnapshot){

                    //console.log(childSnapshot.key); 
                    //console.log(childSnapshot.val());
                       
                   if(childSnapshot.val() === orderNumber){
                       //console.log("luck");
                       fillForm(tableNumber, menuItem, "Placed");   
                   }
                   else{
                       //console.log("bad luck");
                    }
              });
         });
        
    }
    
    function updateReady(orderNumber, tableNumber, menuItem){
    var ready = orders.child('Ready');
    //var result;

        ready.once("value")
              .then(function(readySnapshot) {
                   readySnapshot.forEach(function(childSnapshot){

                    //console.log(childSnapshot.key); 
                    //console.log(childSnapshot.val());
                       
                   if(childSnapshot.val() === orderNumber){
                       //console.log("luck");
                       fillForm(tableNumber, menuItem, "Ready");   
                   }
                   else{
                       //console.log("bad luck");
                    }
              });
         });
        
    }
    
    function updateSeeKitchen(orderNumber, tableNumber, menuItem){
    var seeKitchen = orders.child('SeeKitchen');
    //var result;

        seeKitchen.once("value")
              .then(function(seeKitchenSnapshot) {
                   seeKitchenSnapshot.forEach(function(childSnapshot){

                    //console.log(childSnapshot.key); 
                    //console.log(childSnapshot.val());
                       
                   if(childSnapshot.val() === orderNumber){
                       //console.log("luck");
                       fillForm(tableNumber, menuItem, "SeeKitchen");   
                   }
                   else{
                       //console.log("bad luck");
                    }
              });
         });
        
    }
    
    function fillForm(tableNumber, menuItem, orderStatus){
        document.getElementById("tableNumber").value = tableNumber;
        document.getElementById("menuItem").value = menuItem;
        document.getElementById("orderStatus").value = orderStatus;
    }
}

function saveChanges(){
    var menuItem = document.forms["editOrder"]["menuItem"].value;
    var tableNumber = document.forms["editOrder"]["tableNumber"].value;
    var orderStatus = document.forms["editOrder"]["orderStatus"].value;
    
    //console.log(orderStatus);
    
    var updatedOrder = {item: menuItem, tableKey: tableNumber};
    
    orders.child('OrderList/' + orderNumber).set(updatedOrder);
    
    //console.log("updated orderlist");
    
    updateStatus(orderStatus, orderNumber);
    
    console.log("status updated");
    
    window.location.href = 'viewOrders.html';
}

function pause(milliseconds) {
	var firstDate = new Date();
	while ((new Date()) - firstDate <= milliseconds) { /* Do nothing */ }
}

function updateStatus(orderStatus, orderNumber){
    
    
    removeDelivered(orderNumber);
    removeInProgress(orderNumber);
    removePlaced(orderNumber);
    removeReady(orderNumber);
    removeSeeKitchen(orderNumber);
    
    
    console.log(orderStatus);
    var newStatus = orders.child(orderStatus);
    
    
    newStatus.once("value")
        .then(function(snapshot) {
            var newKey = snapshot.numChildren(); 
            orders.child(orderStatus + '/' + newKey).set(orderNumber.toString());
    });
    
    // 
    pause(500);
  
    function removeDelivered(orderNumber){
        var delivered = orders.child('Delivered');
        //var result;
        
            console.log("removeDelivered");


            delivered.once("value")
                  .then(function(deliveredSnapshot) {
                       deliveredSnapshot.forEach(function(childSnapshot){

                       if(childSnapshot.val() === orderNumber){
                           //console.log("luck");
                           delivered.child(childSnapshot.key).remove();  
                       }
                       else{
                           //console.log("bad luck");
                        }
                  });
             });
    } 
    
    function removeInProgress(orderNumber){
        var inProgress = orders.child('InProgress');
        //var result;
        
            console.log("removeInProgress");


            inProgress.once("value")
                  .then(function(inProgressSnapshot) {
                       inProgressSnapshot.forEach(function(childSnapshot){

                       if(childSnapshot.val() === orderNumber){
                           //console.log("luck");
                           inProgress.child(childSnapshot.key).remove();  
                       }
                       else{
                           //console.log("bad luck");
                        }
                  });
             });
    } 
    
    function removePlaced(orderNumber){
        var placed = orders.child('Placed');
        //var result;
        
        console.log("removePlaced");


            placed.once("value")
                  .then(function(placedSnapshot) {
                       placedSnapshot.forEach(function(childSnapshot){

                       if(childSnapshot.val() === orderNumber){
                           //console.log("luck");
                           placed.child(childSnapshot.key).remove();  
                       }
                       else{
                           //console.log("bad luck");
                        }
                  });
             });
    } 
    
    function removeReady(orderNumber){
        var ready = orders.child('Ready');
        //var result;
        
        console.log("removeReady");

            ready.once("value")
                  .then(function(readySnapshot) {
                       readySnapshot.forEach(function(childSnapshot){
                           
                        console.log(childSnapshot.val());

                       if(childSnapshot.val() === orderNumber){
                           console.log("luck");
                           ready.child(childSnapshot.key).remove();  
                       }
                       else{
                           //console.log("bad luck");
                        }
                  });
             });
    } 
    
    function removeSeeKitchen(orderNumber){
        var seeKitchen = orders.child('SeeKitchen');
        //var result;
        
        console.log("removeSeeKitchen");


            seeKitchen.once("value")
                  .then(function(seeKitchenSnapshot) {
                       seeKitchenSnapshot.forEach(function(childSnapshot){

                       if(childSnapshot.val() === orderNumber){
                           //console.log("luck");
                           seeKitchen.child(childSnapshot.key).remove();  
                       }
                       else{
                           //console.log("bad luck");
                        }
                  });
             });
    }
}