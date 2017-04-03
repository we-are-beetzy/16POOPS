function makeOrder(){
    var tableNumber = document.forms["createOrder"]["tableNumber"].value;
    
    if(validateForm(tableNumber) === true){
        window.alert("Order Created For Table " + tableNumber + ".");
        
        //add to Firebase here
    }
    else{
        window.alert("Please Enter A Valid Table Number.");
    }
}

function validateForm(tableNumber){
    if(tableNumber >= 0 && tableNumber <= 10{
       // should also validate that order doesn't already exist
        return true;
    }
    return false;
}