function loadMenu(){

var query = firebase.database().ref('Menu/MenuItems/').orderByChild("name");
query.once("value")
  .then(function(snapshot) {
	snapshot.forEach(function(childSnapshot){
	var menu = childSnapshot.key;
	var childData = childSnapshot.val();
	addToTable(childData);

  });
 });

 function addToTable(data){
	var table = document.getElementById("menuM");
    var rowCount = table.rows.length; 
	var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
	
    cell1.innerHTML = data.name;
    cell2.innerHTML = data.price;
 }
}

