var orders = firebase.database().ref().child('Orders');
var orderList = orders.child('OrderList');

function loadOrders(){

orderList.once("value")
  .then(function(snapshot) {
	snapshot.forEach(function(childSnapshot){
	var Order = childSnapshot.key;
	var childData = childSnapshot.val();

		addToTable(childData);
	
	
  });
 });

 function addToTable(data){
	var table = document.getElementById("resTable");
    var rowCount = table.rows.length; 
	var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	
    cell1.innerHTML = data.resDate;
    cell2.innerHTML = data.partyName;
    cell3.innerHTML = data.partyNumber;
	cell4.innerHTML = data.resTime;
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
