var resKey = localStorage.getItem("resKey");

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

function dateStringConvert(dateTime){
	var date = new Date(dateTime);
	date = date.toISOString();
	date = date.substring(0, 10);
	return date;
}

function timeStringConvert(dateTime){
	var time = new Date(dateTime);
	time = time.toString();
	time = time.substring(16, 21);
	return time;
}

function setForm(){
	

var query = firebase.database().ref('Reservations/' + resKey);
		query.once("value")
			.then(function(snapshot) {								
				var childData = snapshot.val();				
				var name = document.getElementById("partyName");
				name.value = childData.name;
				name = document.getElementById("partyNumber");
				name.value = childData.partySize;
				var oldDate = dateStringConvert(childData.dateTime);
				name = document.getElementById("date");
				name.value = oldDate;
				var oldTime = timeStringConvert(childData.dateTime);						
				name = document.getElementById("time");
				name.value = oldTime;							
		});

}

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

function createReservation(name, number, dateInt){
	//standard reservation children
    
	var resInfo = {name: name, partySize: number, dateTime: dateInt};
	var ref = firebase.database().ref();
	ref.child('Reservations/' + resKey).set(resInfo);
	return;
}

function updateReservation(){
	
	var name = document.forms["editReservation"]["partyName"].value;
	var	number = document.forms["editReservation"]["partyNumber"].value;
	var	date = document.forms["editReservation"]["date"].value;
	var	time = document.forms["editReservation"]["time"].value;
    var dateInt = createDateTime(date, time);
	
	number = parseInt(number);
	
	if(confirm('Is the information correct?') && validateForm(name, number, date, time)){
		
		createReservation(name, number, dateInt);
		history.go(-1);
		
	}
	else{
		// should not clear fields if the information is not correct
		return;
	}	
}