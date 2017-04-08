var tables = firebase.database().ref().child('Tables'); // references to firebase
var tableList = tables.child('Tables');

// Generate the tables and their status on page load.
function loadTables(){

  var query = firebase.database().ref('Tables').orderByChild("key");
  query.once("value").then(function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var table = childSnapshot.key;
    var childData = childSnapshot.val();
    if (table == 'tableCounter') {
      ; // Do nothing
    }
    else {
      addToTable(childData);
    }

  });
 });

 function addToTable(data){

   // Create edit and delete buttons
   var editButton = '<a class="blue-text" id="'+data.name+'" onClick="editAction(this.id)"><i class="fa fa-pencil"></i></a>';
   var deleteButton = '<a class="red-text" id="'+data.name+'" onClick="deleteReservation(this.id)"><i class="fa fa-times">';

   // Create the table for viewTables.html
   var table = document.getElementById('tableTable');
   var rowCount = table.rows.length;
   var row = table.insertRow(rowCount);
   var cell1 = row.insertCell(0);
   var cell2 = row.insertCell(1);
   var cell3 = row.insertCell(2);
   var cell4 = row.insertCell(3);
   var cell5 = row.insertCell(4);

   // Populate the table
   cell1 = data.name;
   cell2 = data.capacity;
   cell3 = data.status;
   cell4 = data.reservationName;
   cell5 = editButton + " " + deleteButton;
 }
}

function editAction(tableName){
  // Save the table name to localStorage for retrieval in "editTable.html"
  localStorage.setItem("tableName", tableName);
  window.location.href = './editTable.html'; // Move to editTable.html
}

function deleteTable(tableName){
  // Popup confirmation
  if(confirm('Are you sure you wish to delete the table \"' + tableName + '\"?')){
    var query = firebase.database().ref('Tables');
    query.once("value")
      .then(function(snapshot) {
        // Search out the table to be removed.
        snapshot.forEach(function(childSnapshot){
          var table = childSnapshot.key;
          var childData = childSnapshot.val();
          var n = tableName.localeCompare(childData.name);
          if (n == 0)
            {
              // Purge the table.
              firebase.database().ref('Tables/' + table).remove();
              location.reload(true);
            }

        });
      });
  }

}
