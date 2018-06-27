
var app = angular.module("manageApp", []);
app.controller("manageController", function($scope,$http) {
var user_detail_userId = sessionStorage.getItem("success_user_id");
    var success_first_name1 = sessionStorage.getItem("success_first_name");
    var label2 = "Welcome,"+success_first_name1;
  
  $("#modalButton").hide();
  //$("#backButton").hide();


  if(user_detail_userId === null){
   $(location).attr("href", "index.html");        

 }
 else{
  $('#manageButton').show();   
  $('#manageButton').text(label2);
  $('#logOutButton').show();   

}

var temp_booking_id = sessionStorage.getItem("temp_booking_id");
var temp_all_booking_details = sessionStorage.getItem("temp_all_booking_details");

 var temp_details = JSON.parse(temp_all_booking_details);


$http.get('http://localhost:8080/ARS/api/flight/status/bookingid/'+temp_booking_id).then(
  successCallback,errorCallback)
function successCallback(response){
            $scope.mydata1 = response.data;


  var booking_id_details ={};
for (var i =0; i< temp_details.length ; i++) {
  if (temp_details[i].booking_id == response.data[0].booking_id){
  booking_id_details = temp_details[i];
  break;  

  }
}
$scope.manage_booking_arrival_city = booking_id_details.destination_city;
$scope.booking_id_model = booking_id_details.booking_id;
  $scope.manage_booking_departure_city = booking_id_details.origin_city;
  $scope.manage_booking_departure_date = booking_id_details.journey_date;
    //$scope.manage_booking_type_journey = (booking_id_details.return_flag==1 ? ("Two Way") || ("One Way"));



    if (booking_id_details.return_flag==1) {
    $scope.manage_booking_type_journey = "Two Way";

  }
  else{
    $scope.manage_booking_type_journey = "One Way";
  }

}
function errorCallback(argument) {

}

$scope.cancelBooking = function () { 
        $http.get('http://localhost:8080/ARS/api/flight/book/cancel/'+temp_booking_id).then(
  successCallback,errorCallback)
function successCallback(response){
alert("Booking Cancelled");
$(location).attr("href", "Booking.html");

}


}

$("#logOutButton").click(function(){
  sessionStorage.clear();
  $(location).attr("href", "index.html");        

});


});



