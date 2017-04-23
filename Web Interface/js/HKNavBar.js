var navBarHTML ='<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><a class="navbar-brand" href="index.html"><img src="img/HK180.png" style="width:50px;height:50px"></img><b> </b><b>Helps Kitchen</b></a><div class="collapse navbar-collapse" id="navbarNavDropdown"><ul class="navbar-nav"><li class="nav-item"><a class="nav-link" href="index.html">Home <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link" href="createAccount.html">Create Account <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link" href="viewEmployees.html">View Employees <span class="sr-only"></span></a></li><li class="nav item"></li><li class="nav item"><a class="nav-link" href="viewTables.html">Table View <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link" href="manageReservations.html">Manage Reservations <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link" href="viewOrders.html">Orders <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link" href="viewMenu.html">Menu <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link" href="viewServers.html">Servers <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link" href="metrics.html">Metrics <span class="sr-only"></span></a></li></ul><ul class="navbar-nav ml-auto nav-flex-icons nav-flex-icons"><li class="nav-item"><a class="nav-link waves-effect waves-light" onclick="logOut()";><i class="fa fa-power-off"></i> Logout</a></li></ul></div>';

function logOut(){
	firebase.auth().signOut().then(function() {
  // Sign-out successful.
	}).catch(function(error) {
  // An error happened.
	});

	window.location.href = "index.html";
}
function loadNavBar(){
    var navBar = document.getElementById("HKnavBar");
    navBar.innerHTML = navBarHTML;
}
