var reservationList = firebase.database().ref(); // references to firebase
var resList = reservationList.child('Reservations');

function loadReservations(){

var query = firebase.database().ref('Reservations').orderByChild("dateTime");
query.once("value").then(function(snapshot) {
	snapshot.forEach(function(childSnapshot){
	var reservation = childSnapshot.key;
	var childData = childSnapshot.val();
	if(reservation === 'resCounter'){
	   ;
	}
	else{
		addToTable(childData);
	}
	
  });
 });

 function addToTable(data){
	 
	var editButton = '<a class="blue-text" id="'+data.name+'" onClick="editAction(this.id)"><i class="fa fa-pencil"></i></a>';
    var deleteButton = '<a class="red-text" id="'+data.name+'" onClick="deleteReservation(this.id)"><i class="fa fa-times">';
	
	var table = document.getElementById("resTable");
    var rowCount = table.rows.length; 
	var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var str = data.dateTime
	var date = new Date(str);
	date = date.toString();
	dayOfRes = date.substring(0, 15);
	timeOfRes = date.substring(16, 21);
	
    cell1.innerHTML = dayOfRes;
    cell2.innerHTML = data.name;
    cell3.innerHTML = data.partySize;
	cell4.innerHTML = timeOfRes;
	cell5.innerHTML = editButton + " " + deleteButton;
 }
}

function editAction(resName){
    console.log("resName " + resName);
    
    // saves the orderNumber to localStorage for retrieval in "editOrder.html"
    localStorage.setItem("resName", resName);
    window.location.href = 'editReservation.html'; // navigate to "editOrder.html"
}
/*
function editAction(orderNumber){
    console.log("edit " + orderNumber);
    
    // saves the orderNumber to localStorage for retrieval in "editOrder.html"
    localStorage.setItem("orderNumber", orderNumber);
    window.location.href = 'editOrder.html'; // navigate to "editOrder.html"
}

function refreshPage() {
    //ensure reloading from server instead of cache
    location.reload(true);
}
function delayRefreshPage(milliSeconds) {
    window.setTimeout(refreshPage, milliSeconds);
}
function editReservation(){
		
	var partyName = prompt("Please enter the party name to update.");
	if(partyName === null){
		return;
	}
	
	var update = prompt("What would you like to change?\nEnter a value below.\nTime:  1\nDate:  2\nParty Size:  3\n");
	if(update === null){
		return;
	}
	if(update < 1 || update > 3){
		alert("You must enter 1, 2, or 3!");
		return;
	}
	
	if(update === '1')
	{
		var resTime = prompt("What time would you like to change the reservation to?\n24 hour time format:    hh:mm");
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
		
		var query = firebase.database().ref('Reservations');
		query.once("value")
			.then(function(snapshot) {
				snapshot.forEach(function(childSnapshot){
					var reservation = childSnapshot.key;
					var childData = childSnapshot.val();
					var n = partyName.localeCompare(childData.name);
					if(n === 0)
					{
						firebase.database().ref('Reservations/' + reservation).set({
						name: childData.name,
						partySize: partyNumber,
						dateTime: childData.dateTime					
						});
						return true;
					}		
			});
		
		});	
	}
	
	delayRefreshPage(2000);
}
*/
function deleteReservation(resName){
	
	if(confirm('Are you sure you wish to delete the reservation for ' + resName + '?')){
		var query = firebase.database().ref('Reservations');
		query.once("value")
			.then(function(snapshot) {
				snapshot.forEach(function(childSnapshot){
					var reservation = childSnapshot.key;
					var childData = childSnapshot.val();
					var n = resName.localeCompare(childData.name);
					if(n === 0)
					{
						
						firebase.database().ref('Reservations/' + reservation).remove();
						location.reload(true);
					}
					
			});
		});
		
	}
}

