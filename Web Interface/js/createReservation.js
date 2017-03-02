// Get a reference to the database service
var ref = firebase.database().ref();
var resRef = ref.child('Reservations');

function validateForm(name, number, date, time) {
	
    if (name== "") {
        alert("Party name must be filled out");
        return false;
    }
    else if (number == "") {
        alert("Number in Party must be filled out");
        return false;
    }
	else if(number < 1){
		alert("Need at least 1 in prty");
		return false;
	}
    else if (date == "") {
        alert("Date must be filled out");
        return false;
    }
    else if (time == "") {
        alert("Time must be filled out");
        return false;
    }
	else{
		return true;
	}

}

function confirmReservation(){
	
	var name = document.forms["createReservation"]["partyName"].value;
	var	number = document.forms["createReservation"]["partyNumber"].value;
	var	date = document.forms["createReservation"]["date"].value;
	var	time = document.forms["createReservation"]["time"].value;
	
	if(confirm('Is the information correct?') && validateForm(name, number, date, time)){
		window.location.href = "manageReservations.html";
		createReservation(name, number, date, time);
		return true;
	}
	else{
		return;
	}
}

function loseInformation(){
	if(name.length > 0 || number > 0){
		if(confirm('Are you sure? You will lose all of your data')){
			
		}
		else{
			return;
		}
		
	}
}

// FireBase calls

function createReservation(name, number, date, time){
	var reservation = {partyName: name, partyNumber: number, resDate: date, resTime: time};
	
	resRef.push(reservation);	
}
