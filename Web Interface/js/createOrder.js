var orders = firebase.database().ref().child('Orders');
var orderList = orders.child('OrderList');

function makeOrder(){
    var tableNumber = document.forms["createOrder"]["tableNumber"].value;
    
    if(validateForm(tableNumber) === true){
        
        var menuItem = document.forms["createOrder"]["menuItem"].value;
        
        if(tableNumber > 9){
            tableNumber = "Table" + tableNumber;
        }
        else{
            tableNumber = ("Table0" + tableNumber);
        }
        
        console.log(tableNumber + " " + menuItem)
        
        createReservation(menuItem, tableNumber);
        
        window.alert("Order Created For " + tableNumber + ".");  
        
        //ensure reloading from server instead of cache
        location.reload(true);

    }
    else{
        window.alert("Please Enter A Valid Table Number.");
    }
}

function validateForm(tableNumber){
    if(tableNumber > 0 && tableNumber <= 10){
       // should also validate that order doesn't already exist
        return true;
    }
    return false;
}
       
// Pushes data from form fields to firebase database in Reservation directory
function createReservation(menuItem, tableNumber){
	//standard reservation children
    
    var newOrder = {item: menuItem, tableKey: tableNumber};
    
    var currentTime = new Date();
	
    var orderNumber = currentTime.getTime(); // change to resCounter when you figure it out
    orders.child('OrderList/' + orderNumber).set(newOrder);
    //orders.child('Placed/' + orderNumber).set(orderNumber.toString());	
    
    var placed = orders.child('Placed');
        placed.once("value")
          .then(function(snapshot) {
            var newKey = snapshot.numChildren(); 
            orders.child('Placed/' + newKey).set(orderNumber.toString());
 
  });
    
}