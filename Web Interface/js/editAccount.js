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
 
   window.location.href = 'editAccount.html'; // navigate to "editOrder.html"
}

function setForm(){

var type = localStorage.getItem("radioType");
console.log(type);
var query;
if(!(type.localeCompare("Host"))){
	var userKey = localStorage.getItem("userKey");
	query = firebase.database().ref('Users/Host/'+ userKey);
	var name = document.getElementById("radio2");
	name.checked = true;
	query.once("value")
			.then(function(snapshot) {								
				childData = snapshot.val();				
				var fname = document.getElementById("name");
				fname.value = childData.name;
				var email = document.getElementById("email");
				email.value = childData.email;
				var pword = document.getElementById("password");
				pword.value = childData.password;
				pword = document.getElementById("confirmPassword");
				pword.value = childData.password;
				radio1.checked = true;
});
}
if(!(type.localeCompare("Server"))){
	var userKey = localStorage.getItem("userKey");
	query = firebase.database().ref('Users/Server/'+ userKey);
	var name = document.getElementById("radio3");
	name.checked = true;
	console.log(userKey);
	query.once("value")
			.then(function(snapshot) {								
				childData = snapshot.val();	
				console.log(childData);
				var fname = document.getElementById("name");
				fname.value = childData.name;
				var email = document.getElementById("email");
				email.value = childData.email;
				var pword = document.getElementById("password");
				pword.value = childData.password;
				pword = document.getElementById("confirmPassword");
				pword.value = childData.password;
				radio2.checked = true;
});
}
if(!(type.localeCompare("Kitchen"))){
	var userKey = localStorage.getItem("userKey");
	query = firebase.database().ref('Users/Kitchen/'+ userKey);
	var name = document.getElementById("radio4");
	name.checked = true;
	query.once("value")
			.then(function(snapshot) {								
				childData = snapshot.val();				
				var fname = document.getElementById("name");
				fname.value = childData.name;
				var email = document.getElementById("email");
				email.value = childData.email;
				var pword = document.getElementById("password");
				pword.value = childData.password;
				pword = document.getElementById("confirmPassword");
				pword.value = childData.password;
				radio3.checked = true;
});
}
if(!(type.localeCompare("Manager"))){
	var userKey = localStorage.getItem("userKey");
	query = firebase.database().ref('Users/Manager/'+ userKey);
	var name = document.getElementById("radio4");
	name.checked = true;
	query.once("value")
			.then(function(snapshot) {								
				childData = snapshot.val();				
				var fname = document.getElementById("name");
				fname.value = childData.name;
				var email = document.getElementById("email");
				email.value = childData.email;
				var pword = document.getElementById("password");
				pword.value = childData.password;
				pword = document.getElementById("confirmPassword");
				pword.value = childData.password;
});
}

}

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

function removeUser(){
	
	var userKey = localStorage.getItem("userKey");
	var radioType = localStorage.getItem("radioType");
	
	if(!(radioType.localeCompare("Host"))){
		var ref = firebase.database().ref('Users/Host/' + userKey);
		
		ref.once("value")
		.then(function(snapshot) {	
				var childData = snapshot.val();
				
					//firebase.database().ref('Users/Host/' + userKey).remove();
					ref.remove();
					
				
		});
	}
	else if(!(radioType.localeCompare("Kitchen"))){
		var ref = firebase.database().ref('Users/Kitchen/' + userKey);
		
		ref.once("value")
		.then(function(snapshot) {	
				var childData = snapshot.val();
			
					//firebase.database().ref('Users/Kitchen/' + userKey).remove();
					ref.remove();
					
							
		});
	}
	else if(!(radioType.localeCompare("Server"))){
		var ref = firebase.database().ref('Users/Server/' + userKey);
		console.log(userKey);
		ref.once("value")
		.then(function(snapshot) {	
				var childData = snapshot.val();
					//firebase.database().ref('Users/Kitchen/' + userKey).remove();
					ref.remove();
				
				
							
		});
	}
	else if(!(radioType.localeCompare("Manager"))){
		var ref = firebase.database().ref('Users/Manager/' + userKey);
		
		ref.once("value")
		.then(function(snapshot) {	
				var childData = snapshot.val();
			
					//firebase.database().ref('Users/Manager/' + userKey).remove();
					ref.remove();
				
									
		});
	}
	
}

function newAccount(){
	
	var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
	var employeeInfo;
	var tables;
	console.log(password);
	if(name.length == 0){
		alert('Please enter a first name.');
		return;
	}


    if (email.length < 2){
        alert('Please enter an e-mail address.');
        return;
    }
    if (password.length < 2){
        alert('Please enter a password.');
        return;
    }
    
    // Ensure the password and confirm password are equal
    if (password !== confirmPassword){
        alert('Password does not match the confirm password.');
        return;
    }
	
	var radioType = null;
	if(document.getElementById("radio1").checked){
		radioType = radio1.value;
	}
	if(document.getElementById("radio2").checked){
		radioType = radio2.value;
	}
	if(document.getElementById("radio3").checked){
		radioType = radio3.value;
	}
	
	if(radioType === null){
		alert("Employee type must be selected.");
		return;
	}
	
	if(!(radioType.localeCompare("Host"))){
		var ref = firebase.database().ref('Users/Host');
		employeeInfo = {name: userName, email: email, Password: password};
	}
	else if(!(radioType.localeCompare("Kitchen"))){
		var ref = firebase.database().ref('Users/Kitchen');
		employeeInfo = {name: userName, email: email, Password: password};		
	}
	else if(!(radioType.localeCompare("Server"))){
		var ref = firebase.database().ref('Users/Server');
		 tables = {0: "", 1: "", 2: "", 3: ""};
		 employeeInfo = {assignedTables: tables, name: name, email: email, Password: password};
	}
	
	
    // Attempt to create the user with the provided username and password.
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Error Handling
        var errorCode = error.code;
        var errorMessage = error.message;
        
        if (errorCode == 'auth/weak-password'){
            alert('Password is too weak.');
            flag = 1;
        }
        else {
            alert(errorMessage);
            return;
        }
        console.log(error);
		
    });
	
	firebase.auth().onAuthStateChanged(function(user) {
	if(user){
		
		var user = firebase.auth().currentUser;
		var id = user.uid;
		ref.child(id).set(employeeInfo);
		console.log(id);
		
		var field1 = document.getElementById("name");
		field1.value = "";
		field1 = document.getElementById("email");
		field1.value = "";
		field1 = document.getElementById("password");
		field1.value = "";
		field1 = document.getElementById("confirmPassword");
		field1.value = "";
		
		
	} 
    });	
}
