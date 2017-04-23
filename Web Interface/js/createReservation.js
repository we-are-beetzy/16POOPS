// Get references to the database service and Reservations
var ref = firebase.database().ref();
var resRef = ref.child('Reservations');


// Checks that all of the fields have a value
function validateForm(name, number, date, time) {
	
    if (name === "") {
        alert("Party name must be filled out");
        return false;
    }
    else if (number == "") {
        alert("Party Size must be filled out");
        return false;
    }
	else if(number < 1){
		alert("Need at least 1 in party");
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
    var dateInt = createDateTime(date, time);
	
	if(confirm('Is the information correct?') && validateForm(name, number, date, time)){
		
		createReservation(name, number, dateInt);
		history.go(-1);
	}
	else{
		// should not clear fields if the information is not correct
		return;
	}
	
}
/*
// if "Return to Reservations" is clicked, alert will pop up,
// cancel should keep form data and stay on page
function loseInformation(){
	if(name.length > 0 || number.length > 0){
		if(confirm('Are you sure? You will lose all of your data')){
			
		}
		else{
			return;
		}
		
	}
}
*/
// will read data and time inputs and create date object for
// the reservation time
function createDateTime(date, time) {
    var year = date.substring(0,4);
    var month = date.substring(5,7);
	var x = parseInt(month);
	x = x - 1;
	month = x.toString();
    var day = date.substring(8,10);  
    var hours = time.substring(0,2);
    var minutes = time.substring(3,5);
    
    // using the substrings creates Date object
    var dateTime = new Date(year, month, day, hours, minutes);
    
    // changes date object to dateTime standard
    var dateInt = dateTime.getTime();
    
    return dateInt;
}


// Pushes data from form fields to firebase database in Reservation directory
function createReservation(name, number, dateInt){
	//standard reservation children
     
    var numParty = parseInt(number); // partySize should be 'int' when pushed to firebase
	var reservation = {name: name, partySize: numParty, dateTime: dateInt};
    
    var currentTime = new Date();
	
    //resNumber = resRef.child('resCounter').key;
    resNumber = currentTime.getTime(); // change to resCounter when you figure it out
    //resRef.child('resCounter').update( 1);
	
	ref.child('Reservations/' + resNumber).set(reservation);

}

function addToQueue(resNumber){
	var resQ = ref.child('ReservationQueue');
	resQ.once("value").then(function(snapshot){
		var queueKey = snapshot.numChildren();
		ref.child('ReservationQueue/' + queueKey).set(resNumber);		
	});
}

	

