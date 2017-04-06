var orders = firebase.database().ref().child('Orders'); //ref for Orders
var orderList = orders.child('OrderList'); // ref for Order

// onclick of "Place Order" button, creates order and saves to Firebase
function makeOrder(){
    // reads in tableNumber field
    var tableNumber = document.forms["createOrder"]["tableNumber"].value;
    
    // check validate form for proper table number, will send alert if false
    if(validateForm(tableNumber) === true){
        
        var menuItem = document.forms["createOrder"]["menuItem"].value;
        
        // Formatting for tableKey in database
        if(tableNumber > 9){
            tableNumber = "Table" + tableNumber;
        }
        else{
            tableNumber = ("Table0" + tableNumber);
        }
        
        console.log(tableNumber + " " + menuItem)
        
        createOrder(menuItem, tableNumber);
        
        // confirms the table that the order is created for
        window.alert("Order Created For " + tableNumber + ".");  
        
        //ensure reloading from server instead of cache
        location.reload(true);

    }
    else{
        window.alert("Please Enter A Valid Table Number.");
    }
}

// checks if a valid table number is entered in the form
function validateForm(tableNumber){
    if(tableNumber > 0 && tableNumber <= 10){
       // should also validate that order doesn't already exist
        return true;
    }
    return false;
}
       
// Pushes data from form fields to firebase database in Order directory
function createOrder(menuItem, tableNumber){
	//standard reservation children
    
    // creates a new order with the values form the form
    var newOrder = {item: menuItem, tableKey: tableNumber};
    
    // the order ID/ orderKey
    var currentTime = new Date();
	var orderNumber = currentTime.getTime(); 
    
    // pushes the newOrder to it's correct place on OrderList
    orders.child('OrderList/' + orderNumber).set(newOrder);
    
    // creates snapshot at "Placed" directory and creates a new key based
    // on the number of children of Placed, and saves the orderkey at the key
    // in placed
    var placed = orders.child('Placed');
        placed.once("value")
          .then(function(snapshot) {
            var newKey = snapshot.numChildren(); 
            orders.child('Placed/' + newKey).set(orderNumber.toString());
 
  });
    
}