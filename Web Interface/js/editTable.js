var tableKey = localStorage.getItem("tableName");

// Checks that all of the fields have a value
// Reservation does not need to filled as the table may not be reserved.
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

// Prefill out the form with the current data.
function setForm() {

  console.log("Set form called.");
  var query = firebase.database().ref('Tables/' + tableKey);
    query.once("value")
      .then(function(snapshot) {
          var childData = snapshot.val();
          var name = document.getElementById("tableName");
          name.value = childData.name;
          name = document.getElementById("capacity");
          name.value = childData.capacity;
          name = document.getElementById("status");
          name.value = childData.status;
          name = document.getElementById("reservation");
          name.value = childData.reservationName;
      });
}

// Pushes the changes to the database.
function createTable(tableName, capacity, status, reservation) {
  var newTable = {capacity: capacity, name: tableName, status: status, reservationName: reservation};
  var ref = firebase.database().ref();
  ref.child('Tables/' + tableKey).set(newTable);
  return;
}

// Confirm the changes and call to createTable. Return to viewTables if completed.
function updateTable() {

  var name = document.forms["editTable"]["tableName"].value;
  var capacity = document.forms["editTable"]["capacity"].value;
  var reservation = document.forms["editTable"]["reservation"].value;
  var status = document.forms["editTable"]["status"].value;

  if(confirm('Is the information correct?') && validateForm(name, capacity)) {
    createTable(name, capacity, status, reservation);
    history.go(-1);
  }
  else{
    return;
  }
}
