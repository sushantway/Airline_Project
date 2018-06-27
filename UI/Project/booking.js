var app = angular.module("myAppBooking", []);
app.controller("myCtrlBooking", function($scope,$http) {
	var user_detail_userId = sessionStorage.getItem("success_user_id");
    var success_first_name1 = sessionStorage.getItem("success_first_name");
    var label2 = "Welcome,"+success_first_name1;
        if(user_detail_userId === null){
        }
        else{
         $('#signupButton').hide();
         $('#manageButton').show();   
         $('#loginDiv').remove();
         $('#passwordDiv').remove();
         $('#loginbutton').remove();
         $('#manageButton').text(label2);
     }
 var url_getBookings = 'http://localhost:8080/ARS/api/flight/book/list/'+user_detail_userId;     	
    	//var data;
    	$http.get(url_getBookings).then(
    		successCallback,errorCallback
    		)
    	function successCallback(response){
    //     alert(JSON.stringify(response.data[0]));
          $scope.bookingData = response.data;
          sessionStorage.setItem("temp_all_booking_details",((JSON.stringify(response.data))));
          //$scope.bookingData.  

    	}
    	function errorCallback(argument) {

    	}
        

   $scope.clickedbookingid = function(id){
    sessionStorage.setItem("temp_booking_id",id);
    $(location).attr("href", "manageBooking.html"); 
   }     

    });


$(document).ready(function(){


  $("#logOutButton").click(function(){
    sessionStorage.clear();
    $(location).attr("href", "index.html");        
  });


});   

