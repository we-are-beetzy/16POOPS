// Get references to the database service and Reservations
var ref = firebase.database().ref();
var resRef = ref.child('Reservations');

// Checks that all of the fields have a value
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

// Will run when the confirm reservation button is clicked,
// Pulls values from the form and asks if information is correct,
// if so will check if all fields have values, pushes form inputs to database
function confirmReservation(){
	
	var name = document.forms["createReservation"]["partyName"].value;
	var	number = document.forms["createReservation"]["partyNumber"].value;
	var	date = document.forms["createReservation"]["date"].value;
	var	time = document.forms["createReservation"]["time"].value;
	
	if(confirm('Is the information correct?') && validateForm(name, number, date, time)){
		window.location.href = "manageReservations.html";
		createReservation(name, number, date, time);
	}
	else{
		// should not clear fields if the information is not correct
		return;
	}
}
// if "Return to Reservations" is clicked, alert will pop up,
// cancel should keep form data and stay on page
function loseInformation(){
	if(name.length > 0 || number.length > 0){
		if(confirm('Are you sure? You will lose all of your data')){
			window.location.href = "manageReservations.html";
		}
		else{
			return;
		}
		
	}
}

// Pushes data from form fields to firebase database in Reservation directory
function createReservation(name, number, date, time){
	//standard reservation children
	var reservation = {partyName: name, partyNumber: number, resDate: date, resTime: time};
	
	resRef.push(reservation);	
}
