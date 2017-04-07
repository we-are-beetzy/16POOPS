var tables = firebase.database().ref().child('Tables'); // references to firebase

// Generate the tables and their status on page load.
function loadTables(){
    
    // Create a snapshot for the table directory
    tables.once("value")
    .then(function(snapshot) {
        
        // Run through each table in the table list.
        snapshot.forEach(function(childSnapshot) {
            
            var tableNum = childSnapshot.key;
            var childData = new Array();
            
            // Cycle through each child of each table and childData will hold the values
            // from the table status, owner, etc.
            childSnapshot.forEach(function(orderValues){
                childData.push(orderValues.val());
            });
            
            // Ignore the "Examples" table (why not?)
            if (tableNum == "Example"){
                // Do nothing.   
            }
            
            // Print the table
            else {
                printTables(tableNum, childData, "capacity");
                printTables(tableNum, childData, "key");
                printTables(tableNum, childData, "name");
                printTables(tableNum, childData, "newStatus");
                printTables(tableNum, childData, "reservationName");
                printTables(tableNum, childData, "status");
            }
            
        });
    });
    

    // Add a new row to the table
    function addToTable(tableNum, childData, tableStatus){
        // Declare the edit and delete buttons
        var editButton = '<a class="blue-text" id="'+tablNum+'" onClick="editAction(this.id)"><i class="fa fa-pencil"></i></a>';
        var deleteButton = '<a class="red-text" id="'+tableNum+'" onClick="deleteAction(this.id)"><i class="fa fa-times">';
        
        // Create a row with 6 horizontal cells in tableTable in viewTables.html
        var table = document.getElementById("tableTable");
        var rowCount = table.rows.length; 
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);

        // fill in each cell in the row
        cell1.innerHTML = tableNum;  // Table Number
        cell2.innerHTML = childData[3];// Name
        cell3.innerHTML = childData[1]; // Capacity
        cell4.innerHTML = childData[6]; //  should be table status
        cell5.innerHTML = childData[5]; // Reservation Name.
        cell6.innerHTML = editButton + " " + deleteButton; // self-explanatory
    }
    
    function printTables(tableNum, childData, tableStatus){
        var currTableRef = tables.child(tableStatus); // reference to firebase for tableStatus

        // snapshot for tableStatus
        currTableRef.once("value")
            .then(function(snapshot) {
            // Cycle through each child of tableStatus
                  snapshot.forEach(function(childSnapshot){
                  // if the tableNumber is a child of tableStatus is will be added to the table with that table status.
                    if (childSnapshot.val() == talbeNum){
                        addtoTable(tableNum, childData, tableStatus)
                    }
                    else{
                        //Nothing
                    }
                });
        });
    }
}