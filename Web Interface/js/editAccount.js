//function addToDropdown() {
   // <a class="dropdown-item"> Carlos2 </a>
    /*
    var options = '';
    $.each(data, function(index, value) {
        options += '<option value="' + car + '" text="' + car + '" />';
    });

    $('.accountDropdown').append(options);
    */
//}
var childData;

function loadEmployees(){
	
	var Table = document.getElementById("empTable");
	Table.innerHTML = "";
	
	var radioType = null;
	var placeHolder = null;
	if(document.getElementById("radio1").checked){
		radioType = radio1.value;
	}
	if(document.getElementById("radio2").checked){
		radioType = radio2.value;
	}
	if(document.getElementById("radio3").checked){
		radioType = radio3.value;
	}
	if(document.getElementById("radio4").checked){
		radioType = radio3.value;
	}
	
	localStorage.setItem("radioType", radioType);
	
	if(radioType === null){
		alert("Employee type must be selected.");
		return;
	}
	
	if(!(radioType.localeCompare("Host"))){
		var ref = firebase.database().ref('Users/Host');
		placeHolder = "hostCounter";
	}
	else if(!(radioType.localeCompare("Kitchen"))){
		var ref = firebase.database().ref('Users/Kitchen');
		placeHolder = "kitchenCounter";	
	}
	else if(!(radioType.localeCompare("Server"))){
		var ref = firebase.database().ref('Users/Server');
		placeHolder = "serverCounter";
		
	}
	else if(!(radioType.localeCompare("Manager"))){
		var ref = firebase.database().ref('Users/Manager');
		placeHolder = "managerCounter";
		
	}
	ref.once("value").then(function(snapshot) {
	snapshot.forEach(function(childSnapshot){
	var userId = childSnapshot.key;
	var userData = childSnapshot.val();
	if(userId === placeHolder){
	   ;
	}
	else{
		addToTable(userId, userData, radioType);
		
	}
  });
 });
}
 function addToTable(userId, userData, radioType){
	 
	var editButton = '<a class="blue-text" id="'+userId+'" onClick="editUser(this.id)"><i class="fa fa-pencil"></i></a>';
    var deleteButton = '<a class="red-text" id="'+userId+'" onClick="deleteUser(this.id)"><i class="fa fa-times">';
	var key = userId;
	var table = document.getElementById("empTable");
    var rowCount = table.rows.length; 
	var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	
    cell1.innerHTML = radioType;
    cell2.innerHTML = userData.name;
    cell3.innerHTML = userData.email;
	cell4.innerHTML = editButton + " " + deleteButton;
 }

function editUser(userKey){  
    // saves the party name to localStorage for retrieval in "editOrder.html"	
   localStorage.setItem("userKey", userKey);
   localStorage
   window.location.href = 'editAccount.html'; // navigate to "editOrder.html"
}

function setForm(){

var userKey = localStorage.getItem("userKey");
var type = localStorage.getItem("radioType");
var query;
if(!(type.localeCompare("Host"))){
	query = firebase.database().ref('Users/Host/'+ userKey);
	var name = document.getElementById("radio2");
	name.checked = true;
}
if(!(type.localeCompare("Server"))){
	query = firebase.database().ref('Users/Server/'+ userKey);
	var name = document.getElementById("radio3");
	name.checked = true;
}
if(!(type.localeCompare("Kitchen"))){
	query = firebase.database().ref('Users/Kitchen/'+ userKey);
	var name = document.getElementById("radio4");
	name.checked = true;
}
if(!(type.localeCompare("Manager"))){
	query = firebase.database().ref('Users/Manager/'+ userKey);
	var name = document.getElementById("radio4");
	name.checked = true;
}

		query.once("value")
			.then(function(snapshot) {								
				childData = snapshot.val();				
				var name = document.getElementById("name");
				name.value = childData.name;
				
});
}
/*
function updateUser(){
	
	var radioType = null;
	if(document.getElementById("radio2").checked){
		radioType = radio1.value;
	}
	if(document.getElementById("radio3").checked){
		radioType = radio2.value;
	}
	if(document.getElementById("radio4").checked){
		radioType = radio3.value;
	}
	if(document.getElementById("radio5").checked){
		radioType = radio3.value;
	}
	if(radioType === null){
		alert("Employee type must be selected.");
		return;
	}
	var userKey = localStorage.getItem("userKey");	
	
	var userName = document.getElementById("name");
	
	if(!(radioType.localeCompare("Host"))){
		var ref = firebase.database().ref('Users/Host' + userKey);
		employeeInfo = {name: userName, email: childData.email, Password: childData.password};
		ref.child(userKey).set(employeeInfo);
	}
	else if(!(radioType.localeCompare("Kitchen"))){
		var ref = firebase.database().ref('Users/Kitchen');
		employeeInfo = {name: userName, email: childData.email, Password: childData.password};		
		ref.child(userKey).set(employeeInfo);
	}
	else if(!(radioType.localeCompare("Server"))){
		 var ref = firebase.database().ref('Users/Server');
		 tables = {0: 0, 1: 0, 2: 0, 3: 0};
		 employeeInfo = {assignedTables: tables, name: userName, email: childData.email, Password: childData.password};
		ref.child(userKey).set(employeeInfo);
	}
	else if(!(radioType.localeCompare("Manager"))){
		var ref = firebase.database().ref('Users/Manager');
		employeeInfo = {name: userName, email: childData.email, Password: childData.password};	
		ref.child(userKey).set(employeeInfo);
	}

	
}*/

function goBack(){
	history.go(-1);
}
function deleteUser(userKey){
	var radioType = localStorage.getItem("radioType");
	
	if(!(radioType.localeCompare("Host"))){
		var ref = firebase.database().ref('Users/Host/' + userKey);
		
		ref.once("value")
		.then(function(snapshot) {	
				var childData = snapshot.val();
				if(confirm("Do you wish to terminate " + childData.name + "'s employment?")){
					//firebase.database().ref('Users/Host/' + userKey).remove();
					ref.remove();
					location.reload(true);
				}
				else{
					return;
				}					
		});
	}
	else if(!(radioType.localeCompare("Kitchen"))){
		var ref = firebase.database().ref('Users/Kitchen/' + userKey);
		
		ref.once("value")
		.then(function(snapshot) {	
				var childData = snapshot.val();
				if(confirm("Do you wish to terminate " + childData.name + "'s employement?")){
					//firebase.database().ref('Users/Kitchen/' + userKey).remove();
					ref.remove();
					location.reload(true);
				}
				else{
					return;
				}					
		});
	}
	else if(!(radioType.localeCompare("Server"))){
		var ref = firebase.database().ref('Users/Server/' + userKey);
		console.log(userKey);
		ref.once("value")
		.then(function(snapshot) {	
				var childData = snapshot.val();
				if(confirm("Do you wish to terminate " + childData.name + "'s employment?")){
					//firebase.database().ref('Users/Kitchen/' + userKey).remove();
					ref.remove();
					location.reload(true);
				}
				else{
					return;
				}					
		});
	}
	else if(!(radioType.localeCompare("Manager"))){
		var ref = firebase.database().ref('Users/Manager/' + userKey);
		
		ref.once("value")
		.then(function(snapshot) {	
				var childData = snapshot.val();
				if(confirm("Do you wish to terminate " + childData.name + "'s employment?")){
					//firebase.database().ref('Users/Manager/' + userKey).remove();
					ref.remove();
					location.reload(true);
				}
				else{
					return;
				}					
		});
	}
}
