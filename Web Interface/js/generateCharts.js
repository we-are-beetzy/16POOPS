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
var manRef = firebase.database().ref("Users/Managers");
var hostRef = firebase.database().ref("Users/Hosts");
var kitchenRef = firebase.database().ref("Users/Kitchen");
var serverRef = firebase.database().ref("Users/Servers");
var tableRef = firebase.database().ref("Table");
    
tableRef.once("value")
    .then(function(snapshot) {
    numTables = snapshot.numChildren();
});

var table1stuff = tableRef.child("Table1").once("value", function(snapshot) {
   var tablestuff = snapshot.val();
    console.log("Table 1 Status: " + tablestuff);
});

// Store the number of employees within each reference group.
manRef.once("value")
    .then(function(snapshot) {
    numMan = snapshot.numChildren();
});

hostRef.once("value")
    .then(function(snapshot) {
    numHosts = snapshot.numChildren();
});

kitchenRef.once("value")
    .then(function(snapshot) {
    numKitchen = snapshot.numChildren();
});

serverRef.once("value")
    .then(function(snapshot) {
    numServers = snapshot.numChildren();
});

// Generate the Employee Distribution Pie Chart.
function createPieChart() {
    // Make the chart responsive.
    var option = {
        responsive: true,
    };
    
        var data =[
        {value: numMan,
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
        {value: numServers,
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






















