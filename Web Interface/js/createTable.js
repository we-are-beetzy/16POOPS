// Get references to the database service and Reservations
var ref = firebase.database().ref();
var tableRef = ref.child('Tables');

// Checks that all of the fields have a value
function validateForm(tableName, capacity) {

    if (tableName == "") {
        alert("Table name cannot be empty.");
        return false;
    }
	else if(capacity < 0){
		alert("Capacity must be greater than 0.");
		return false;
	}
    else if(capacity == "") {
        alert("Capacity cannot be empty.");
    }
	else{
		return true;
	}

}

// Will run when the confirm reservation button is clicked,
// Pulls values from the form and asks if information is correct,
// if so will check if all fields have values, pushes form inputs to database
function confirmTable(){

    var status = document.forms["createTable"]["status"].value;
    var name = document.forms["createTable"]["tableName"].value;
    var capacity = document.forms["createTable"]["capacity"].value;
    var reservation = document.forms["createTable"]["reservation"].value;

	if(confirm('Is the information correct?') && validateForm(tableName, capacity)){
		createTable(status, name, capacity, reservation);
    history.go(-1);
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
			window.location.href = "./viewTables.html";
		}
		else{
			return;
		}

	}
}

// Pushes data from form fields to firebase database in Reservation directory
function createTable(status, name, capacity, reservation){
	//standard reservation children

    var capacityNumber = parseInt(capacity); // partySize should be 'int' when pushed to firebase
	var newTable = {capacity: capacity, name: name, status: status, reservationName: reservation};

    ref.child('Tables/' + name).set(newTable);
	return;
}
