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

// Create the references to each User Type.
var manRef = firebase.database().ref("Users/Manager");
var hostRef = firebase.database().ref("Users/Host");
var kitchenRef = firebase.database().ref("Users/Kitchen");
var serverRef = firebase.database().ref("Users/Server");
var tableRef = firebase.database().ref("Table");
var menuRef = firebase.database().ref("Menu/MenuItems");

var numManagers;

menuRef.once("value")
    .then(function(snapshot){
        snapshot.forEach(function(snapshot) {
            // Keep a running total of the sum of all items on the menu
            var oldPrice = parseInt(localStorage.getItem("price"));
            var price = parseInt(snapshot.child("price").val());
            var newPrice = oldPrice + price;
            localStorage.setItem("price", newPrice);

            // Count the number of items in the MenuItems table.
            var currItems = parseInt(localStorage.getItem("numItems"));
            currItems++;
            localStorage.setItem("numItems", currItems);
        });
    });

// Grab the number of each type of employee for the employee distribution chart.
manRef.once("value")
    .then(function(snapshot) {
        numManagers = snapshot.numChildren();
        localStorage.setItem("numManagers", numManagers);
        console.log("Number of Managers: " + numManagers);
    });


hostRef.once("value")
    .then(function(snapshot) {
        numHosts = snapshot.numChildren();
        localStorage.setItem("numHosts", numHosts);
        console.log("Number of Hosts: " + numHosts);
    });

kitchenRef.once("value")
    .then(function(snapshot) {
        numKitchen = snapshot.numChildren();
        localStorage.setItem("numKitchen", numKitchen);
        console.log("Number of Kitchen: " + numKitchen);
    });

serverRef.once("value")
    .then(function(snapshot) {
        numServer = snapshot.numChildren();
        localStorage.setItem("numServer", numServer);
        console.log("Number of Servers: " + numServer);
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

function averagePrice() {

    sumPrices = localStorage.getItem("price");
    numItems = localStorage.getItem("numItems");

    var averagePrice = parseInt(sumPrices)/parseInt(numItems);
    document.querySelector('.averageSale').innerHTML = "$" + averagePrice.toFixed(2);
}

/*
* Begin Table Status
*/


// Create the table reference and get the number of tables
function tableStats() {
   // Make the chart responsive.
    var option = {
        responsive: true,
    };
    
        var data =[
        {value: 4,
         color: "#F7464A",
         highlight: "#FF5A5E",
         label: "Seated"
        },
        
        {value: 2,
         color: "#FDB45C",
         highlight: "#FFC870",
         label: "Closing"
        },
        
        {value: 4,
         color: "#00E500",
         highlight: "#98fb98",
         label: "Available"
        }
    ]
    
    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("table").getContext('2d');
    var tableDistribution = new Chart(ctx).Pie(data, option); //'Pie' defines type of the chart.
    
}


function saleStats() {
    // Make the chart responsive.
    var option = {
        responsive: true,
    };
    
    var data = {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [
            {
                label: "This Week",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "Last Week",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    var ctx = document.getElementById("sales").getContext('2d');
    var salesDistribution = new Chart(ctx).Line(data, option);

}


function pause(milliseconds) {
    var firstDate = new Date();
    while ((new Date()) - firstDate <= milliseconds) { /* Do nothing */ }
}





console.log(localStorage.getItem("price"));
console.log(localStorage.getItem("numItems"));









