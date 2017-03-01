var name;
var number;
var date;
var time;

function validateForm() {
    name = document.forms["createReservation"]["partyName"].value;
	number = document.forms["createReservation"]["partyNumber"].value;
	date = document.forms["createReservation"]["date"].value;
	time = document.forms["createReservation"]["time"].value;

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

function confirmReservation(){
	if(confirm('Is the information correct?') && validateForm()){
		window.location.href = "manageReservations.html";
		return true;
	}
	else{
		return;
	}
}

function loseInformation(){
	if(name.length > 0 || number > 0){
		if(confirm('Are you sure? You will lose all of your data')){
			
		}
		else{
			return;
		}
		
	}
}