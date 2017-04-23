/*
* generateCharts.js
* 
* List of functions required by metrics.html in order to create the various charts and graphs 
* the manager can view.
*
* Total profits, average meal cost, employee distribution
*/

/*
* Begin Employee Distribution
*/

localStorage.setItem("Available", 0);
localStorage.setItem("Seated", 0);
localStorage.setItem("Closing", 0);


// Create the references to each User Type.
var manRef = firebase.database().ref("Users/Manager");
var hostRef = firebase.database().ref("Users/Host");
var kitchenRef = firebase.database().ref("Users/Kitchen");
var serverRef = firebase.database().ref("Users/Server");
var menuRef = firebase.database().ref("Menu/MenuItems");

/*
=========================================================================================
|                               Employee Distribution                                   | 
=========================================================================================
*/

// Grab the number of each type of employee for the employee distribution chart.
manRef.once("value")
    .then(function(snapshot) {
        numManagers = snapshot.numChildren();
        localStorage.setItem("numManagers", numManagers);
    });


hostRef.once("value")
    .then(function(snapshot) {
        numHosts = snapshot.numChildren();
        localStorage.setItem("numHosts", numHosts);
    });

kitchenRef.once("value")
    .then(function(snapshot) {
        numKitchen = snapshot.numChildren();
        localStorage.setItem("numKitchen", numKitchen);
    });

serverRef.once("value")
    .then(function(snapshot) {
        numServer = snapshot.numChildren();
        localStorage.setItem("numServer", numServer);
    });

// Generate the Employee Distribution Pie Chart.
function employeeDistribution() {

    numManagers = localStorage.getItem("numManagers");
    numHosts = localStorage.getItem("numHosts");
    numKitchen = localStorage.getItem("numKitchen");
    numServer = localStorage.getItem("numServer");
    // Make the chart responsive.
    var option = {
        responsive: true,
    };
    
        var data =[
        {value: numManagers,
         color: "#F7464A",
         highlight: "#FF5A5E",
         label: "Managers"
        },
        
        {value: numHosts,
         color: "#46BFBD",
         highlight: "#5AD3D1",
         label: "Hosts"
        },
        {value: numKitchen,
         color: "#FDB45C",
         highlight: "#FFC870",
         label: "Kitchen"
        },
        {value: numServer,
         color: "#00E500",
         highlight: "#98fb98",
         label: "Servers"
        }
    ]
    
    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("accounts").getContext('2d');
    var accountDistribution = new Chart(ctx).Doughnut(data, option); //'Pie' defines type of the chart.
}

/*
=========================================================================================
|                               Average Price                                           | 
=========================================================================================
*/
localStorage.setItem("price", 0);
localStorage.setItem("numItems", 0);
function averagePrice(){
menuRef.once("value")
    .then(function(snapshot){
        snapshot.forEach(function(snapshot) {
            // Keep a running total of the sum of all items on the menu
            var oldPrice = parseFloat(localStorage.getItem("price"));
            var price = parseFloat(snapshot.child("price").val());
			var newPrice = oldPrice + price;
            localStorage.setItem("price", newPrice);			
			// Count the number of items in the MenuItems table.
            var currItems = localStorage.getItem("numItems");
			if(price !== 0){
				currItems++;
				localStorage.setItem("numItems", currItems);
			}
 
        });
	
	var sumPrices = localStorage.getItem("price");
    var numItems = localStorage.getItem("numItems");
    var averagePrice = sumPrices/numItems;
	console.log(sumPrices);
	console.log(numItems);
    document.querySelector('.averageSale').innerHTML = "$" + averagePrice.toFixed(2);
   
   });
}
/*
function averagePrice() {

    var sumPrices = localStorage.getItem("price");
    var numItems = localStorage.getItem("numItems");
	console.log(sumPrices);
	console.log(numItems);
    var averagePrice = parseInt(sumPrices)/parseInt(numItems);
	console.log(averagePrice);
    document.querySelector('.averageSale').innerHTML = "$" + averagePrice.toFixed(2);
}
*/
/*
=========================================================================================
|                               Table status                                            | 
=========================================================================================
*/

// Create the table reference and get the different table statuses.
var tableRef = firebase.database().ref("Tables");

var numAvail = 0;
var numSeated = 0;
var numClose = 0;

function testTable() {

tableRef.once("value")
    .then(function(snapshot) {
        snapshot.forEach(function(snapshot) {
            
            var status = snapshot.child("status").val();
            if (status == "Available"){
                numAvail++;
            }
            else if (status == "Closing"){
                numClose++;
            }
            else if (status == "Seated"){
                numSeated++;
            }

        });

    console.log("Available Tables: " + numAvail);
    console.log("Seated Tables: " + numSeated);
    console.log("Closing Tables: " + numClose);

   // Make the chart responsive.
    var option = {
        responsive: true,
    };
    
        var data =[
        {value: numSeated,
         color: "#F7464A",
         highlight: "#FF5A5E",
         label: "Seated"
        },
        
        {value: numClose,
         color: "#FDB45C",
         highlight: "#FFC870",
         label: "Closing"
        },
        
        {value: numAvail,
         color: "#00E500",
         highlight: "#98fb98",
         label: "Available"
        }
    ]
    
    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("table").getContext('2d');
    var tableDistribution = new Chart(ctx).Pie(data, option); //'Pie' defines type of the chart.

    });
}

/*
=========================================================================================
|                               Order Status                                            | 
=========================================================================================
*/

var readyRef = firebase.database().ref("Orders/Ready");
var inProgRef = firebase.database().ref("Orders/InProgress");
var placedRef = firebase.database().ref("Orders/Placed");
var delivRef = firebase.database().ref("Orders/Delivered");


var numReady = 0;
var numInProg = 0;
var numPlaced = 0;
var numDeliv = 0;

readyRef.once("value")
    .then(function(snapshot) {
        numReady = snapshot.numChildren();
        localStorage.setItem("numReady", numReady);
    });

inProgRef.once("value")
    .then(function(snapshot) {
        numInProg = snapshot.numChildren();
        localStorage.setItem("numInProg", numInProg);
    });

placedRef.once("value")
    .then(function(snapshot) {
        numPlaced = snapshot.numChildren();
        localStorage.setItem("numPlaced", numPlaced);
    });

delivRef.once("value")
    .then(function(snapshot) {
        numDeliv = snapshot.numChildren();
        localStorage.setItem("numDeliv", numDeliv);
    });

// Generate the Order Status Distribution Pie Chart.
function orderDistribution() {

var numReady = 0;
var numInProg = 0;
var numPlaced = 0;
var numDeliv = 0;

    numReady = localStorage.getItem("numReady");
    numInProg = localStorage.getItem("numInProg");
    numPlaced = localStorage.getItem("numPlaced");
    numDeliv = localStorage.getItem("numDeliv");

    // Make the chart responsive.
    var option = {
        responsive: true,
    };
    
        var data =[
        {value: numReady,
         color: "#F7464A",
         highlight: "#FF5A5E",
         label: "Ready"
        },
        
        {value: numInProg,
         color: "#46BFBD",
         highlight: "#5AD3D1",
         label: "In Progress"
        },
        {value: numPlaced,
         color: "#FDB45C",
         highlight: "#FFC870",
         label: "Placed"
        },
        {value: numDeliv,
         color: "#00E500",
         highlight: "#98fb98",
         label: "Delivered"
        }
    ]


var data = {
    labels: ["Placed", "In Progress", "Ready", "Delivered"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "#FFC904",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "#000000",
            highlightStroke: "rgba(220,220,220,1)",
            data: [numPlaced, numInProg, numReady, numDeliv]
        }
    ]
};
    
    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("orders").getContext('2d');
    var accountDistribution = new Chart(ctx).Bar(data, option); //'Pie' defines type of the chart.
}
