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
        var table = document.getElementById("orderTable");
        var rowCount = table.rows.length; 
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
         
        cell1.innerHTML = orderNumber;  // order ID
        cell2.innerHTML = childData[1]; // Table Number
        cell3.innerHTML = childData[0]; // Menu Item
        cell4.innerHTML = orderStatus; //  should be table status
     }
    
    function deliveredOrders(orderNumber, childData){
        var delivered = orders.child('Delivered');
        //var result;
        
        delivered.once("value")
              .then(function(deliveredSnapshot) {
                   deliveredSnapshot.forEach(function(childSnapshot){

                    //console.log(childSnapshot.key); 
                    //console.log(childSnapshot.val())
;                    
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
;                    
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
;                    
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
;                    
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
;                    
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




function editOrder(){
		
	var tableNumber = prompt("Please enter the table number to update.");
	if(tableNumber === null){
		return;
	}
	
	var update = prompt("What would you like to change?\nEnter a value below.\nAdd Item:  1\nRemove Item:  2\nStatus:  3\n");
	if(update === null){
		return;
	}
	if(update < 1 || update > 3){
		alert("You must enter 1, 2, or 3!");
		return;
	}
	
	if(update === '1')
	{
		var newItem = prompt("What items would you like to add to the order?\n24 hour time format:    hh:mm");
		if(resTime === null){
			return;
		}
		
		var query = firebase.database().ref('Reservations');
		query.once("value")
			.then(function(snapshot) {
				snapshot.forEach(function(childSnapshot){
					var reservation = childSnapshot.key;
					var childData = childSnapshot.val();
					var n = partyName.localeCompare(childData.partyName);
					if(n === 0)
					{
						firebase.database().ref('Reservations/' + reservation).set({
						partyName: childData.partyName,
						partyNumber: childData.partyNumber,
						resDate: childData.resDate,
						resTime: resTime						
						});
						return true;
					}
		
			});
		});

	}
	else if(update === '2')
	{
		var resDate = prompt("What date would you like to change the reservation to?\nEnter in this format:    yyyy-mm-dd");
		if(resDate === null){
			return;
		}
		var query = firebase.database().ref('Reservations');
		query.once("value")
			.then(function(snapshot) {
				snapshot.forEach(function(childSnapshot){
					var reservation = childSnapshot.key;
					var childData = childSnapshot.val();
					var n = partyName.localeCompare(childData.partyName);
					if(n === 0)
					{
						firebase.database().ref('Reservations/' + reservation).set({
						partyName: childData.partyName,
						partyNumber: childData.partyNumber,
						resDate: resDate,
						resTime: childData.resTime						
						});
						return true;
					}
		
			});
		});

	}
	else if(update === '3')
	{
		var partyNumber = prompt("How many will now be in your party?");
		if(partyNumber === null){
			return;
		}
		var n = 1;
		var query = firebase.database().ref('Reservations');
		query.once("value")
			.then(function(snapshot) {
				snapshot.forEach(function(childSnapshot){
					var reservation = childSnapshot.key;
					var childData = childSnapshot.val();
					n = partyName.localeCompare(childData.partyName);
					if(n === 0)
					{
						firebase.database().ref('Reservations/' + reservation).set({
						partyName: childData.partyName,
						partyNumber: partyNumber,
						resDate: childData.resDate,
						resTime: childData.resTime						
						});
						return true;
					}		
			});
		});	
	}
	
	delayRefreshPage(2000);
}
