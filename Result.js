
var app = angular.module("mySearchApp", []);
app.controller("mySearchController", function($scope,$http,$location) {
  var user_detail_userId = sessionStorage.getItem("success_user_id");
  var success_first_name1 = sessionStorage.getItem("success_first_name");
  var label2 = "Welcome,"+success_first_name1;
  var departure_City = sessionStorage.getItem("search_departure_city");
  var journey_type =sessionStorage.getItem("search_journey_type");
  var departure_date =sessionStorage.getItem("search_departure_date");
  var arrival_Date =sessionStorage.getItem("search_arrival_date");
  var arrival_city =sessionStorage.getItem("search_arrival_city");
  var number_of_passengers =sessionStorage.getItem("search_number_of_passengers");
  var journey_class =sessionStorage.getItem("search_class");
  if(journey_type == "Return"){ 
  }
  else{
    $('#arrivaldate').remove();
  }
  $scope.departurecity_model = departure_City;
  $scope.type_model = journey_type;
  $scope.arrival_date_model = arrival_Date;
  $scope.departure_date_model = departure_date;
  $scope.arrivalcity_model = arrival_city;
  $scope.number_of_passengers = number_of_passengers;
  $scope.class_model = journey_class;

  if(user_detail_userId === null){
   $(location).attr("href", "index.html");        

 }
 else{
  $('#manageButton').show();   
  $('#manageButton').text(label2);
  $('#logOutButton').show();   


}
$("#logOutButton").click(function(){
  sessionStorage.clear();
  $(location).attr("href", "index.html");        

});
});