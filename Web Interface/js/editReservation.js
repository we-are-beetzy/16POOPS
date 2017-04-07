var resName = localStorage.getItem("resName"); 
function setForm(){
	
var query = firebase.database().ref('Reservations');
		query.once("value")
			.then(function(snapshot) {
				snapshot.forEach(function(childSnapshot){
					var reservation = childSnapshot.key;
					var childData = childSnapshot.val();
					var n = resName.localeCompare(childData.name);
					if(n === 0)
					{
						alert("Please update the reservation for " + resName + ".");
						var name = document.getElementById("partyName");
						name.value = resName;
						name = document.getElementById("partyNumber");
						name.value = childData.partySize;	
						
					}
					
			});
		});
	
}

function updateReservation(){
	
	
	
}