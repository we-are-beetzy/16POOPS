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
	var dayOfRes = date.substring(0, 15);
	var timeOfRes = date.substring(16, 21);
	
    cell1.innerHTML = dayOfRes;
    cell2.innerHTML = data.name;
    cell3.innerHTML = data.partySize;
	cell4.innerHTML = timeOfRes;
	cell5.innerHTML = editButton + " " + deleteButton;
 }
}

function editAction(resName){  
    // saves the party name to localStorage for retrieval in "editOrder.html"	
   localStorage.setItem("resName", resName);
   window.location.href = 'editReservation.html'; // navigate to "editOrder.html"
}

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

