var orders = firebase.database().ref().child('Orders');
var orderList = orders.child('OrderList');

function loadOrders(){

    orderList.once("value")
      .then(function(snapshot) {

        
        snapshot.forEach(function(childSnapshot){
            
        var orderNumber = childSnapshot.key;
        //var childData = (array)childSnapshot.val();
        var childData = new Array();
        var i = 0;  
            
        childSnapshot.forEach(function(orderValues){
            childData.push(orderValues.val());
                              });
            
       // console.log("orderNumber:" + orderNumber);
        //console.log("foodItem:" + childData[0]);
        //console.log("tableNumber:" + childData[1]);

        if(orderNumber == 'Example'){
            
        }
        else{
            deliveredOrders(orderNumber, childData);
            
            inProgressOrders(orderNumber, childData);
            placedOrders(orderNumber, childData);
            readyOrders(orderNumber, childData);
            seeKitchenOrders(orderNumber, childData);
        }


      });
     });

     function addToTable(orderNumber, childData, orderStatus){
        var editButton = '<a class="blue-text" id="'+orderNumber+'" onClick="editAction(this.id)"><i class="fa fa-pencil"></i></a>';
        //editButton.id = orderNumber;
        //editButton.onClick = editAction(this.id);
         
        var deleteButton = '<a class="red-text" id="'+orderNumber+'" onClick="deleteAction(this.id)"><i class="fa fa-times">';
        deleteButton.id = orderNumber;
         
        var table = document.getElementById("orderTable");
        var rowCount = table.rows.length; 
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        //var cell6 = row.insertCell(5);
         
        cell1.innerHTML = orderNumber;  // order ID
        cell2.innerHTML = childData[1]; // Table Number
        cell3.innerHTML = childData[0]; // Menu Item
        cell4.innerHTML = orderStatus; //  should be table status
        cell5.innerHTML = editButton + " " + deleteButton;
     }
    
    function deliveredOrders(orderNumber, childData){
        var delivered = orders.child('Delivered');
        //var result;
        
        delivered.once("value")
              .then(function(deliveredSnapshot) {
                   deliveredSnapshot.forEach(function(childSnapshot){

                    //console.log(childSnapshot.key); 
                    //console.log(childSnapshot.val())
                    
                   if(childSnapshot.val() === orderNumber){
                       //console.log("luck");
                       addToTable(orderNumber, childData, "Delivered")   
                   }
                   else{
                       //console.log("bad luck");
                    }
              });
         });
        
    }
    
    function inProgressOrders(orderNumber, childData){
        var inProgress = orders.child('InProgress');
        //var result;
        
        inProgress.once("value")
              .then(function(inProgressSnapshot) {
                   inProgressSnapshot.forEach(function(childSnapshot){

                    //console.log(childSnapshot.key); 
                    //console.log(childSnapshot.val())
                   
                   if(childSnapshot.val() === orderNumber){
                       //console.log("luck");
                       addToTable(orderNumber, childData, "In Progress")   
                   }
                   else{
                       //console.log("bad luck");
                    }
              });
         });
        
    }
    
    function placedOrders(orderNumber, childData){
        var placed = orders.child('Placed');
        //var result;
        
        placed.once("value")
              .then(function(placedSnapshot) {
                   placedSnapshot.forEach(function(childSnapshot){

                    //console.log(childSnapshot.key); 
                    //console.log(childSnapshot.val())
                  
                   if(childSnapshot.val() === orderNumber){
                       //console.log("luck");
                       addToTable(orderNumber, childData, "Placed")   
                   }
                   else{
                       //console.log("bad luck");
                    }
              });
         });
        
    }
    
    function readyOrders(orderNumber, childData){
        var ready = orders.child('Ready');
        //var result;
        
        ready.once("value")
              .then(function(readySnapshot) {
                   readySnapshot.forEach(function(childSnapshot){

                    //console.log(childSnapshot.key); 
                    //console.log(childSnapshot.val())
                   
                   if(childSnapshot.val() === orderNumber){
                       //console.log("luck");
                       addToTable(orderNumber, childData, "Ready")   
                   }
                   else{
                       //console.log("bad luck");
                    }
              });
         });
        
    }
    
    function seeKitchenOrders(orderNumber, childData){
        var seeKitchen = orders.child('SeeKitchen');
        //var result;
        
        seeKitchen.once("value")
              .then(function(seeKitchenSnapshot) {
                   seeKitchenSnapshot.forEach(function(childSnapshot){

                    //console.log(childSnapshot.key); 
                    //console.log(childSnapshot.val())
                    
                   if(childSnapshot.val() === orderNumber){
                       //console.log("luck");
                       addToTable(orderNumber, childData, "See Kitchen")   
                   }
                   else{
                       //console.log("bad luck");
                    }
              });
         });
        
    }
}


function editAction(orderNumber){
    console.log("edit " + orderNumber);
    localStorage.setItem("orderNumber", orderNumber);
    window.location.href = 'editOrder.html';
}

function deleteAction(orderNumber){
    if(confirm('Are you sure you wish to delete order ' + orderNumber + '?')){
        orderList.child(orderNumber).remove();
        console.log("delete " + orderNumber);
        location.reload(true);
    }
    else{}
}