var navBarHTML ='<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><a class="navbar-brand" href="#"><b>Helps Kitchen</b></a><div class="collapse navbar-collapse" id="navbarNavDropdown"><ul class="navbar-nav"><li class="nav-item"><a class="nav-link" href="index.html">Home <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link" href="createAccount.html">Create Account <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link" href="editAccount.html">Edit Account <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link" href="#">Kitchen & Food Status <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link" href="#">Table View <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link" href="manageReservations.html">Manage Reservations <span class="sr-only"></span></a></li><li class="nav item"><a class="nav-link active" href="manageReservations.html">Orders <span class="sr-only">(current)</span></a></li></ul><ul class="navbar-nav ml-auto nav-flex-icons nav-flex-icons"><li class="nav-item"><a class="nav-link waves-effect waves-light"><i class="fa fa-power-off"></i> Logout</a></li></ul></div>';


function loadNavBar(){
    var navBar = document.getElementById("HKnavBar");
    navBar.innerHTML = navBarHTML;
}