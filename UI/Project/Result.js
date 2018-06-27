
var app = angular.module("mySearchApp", []);
app.controller("mySearchController", function($scope,$http) {
  $("#modalButton").hide();
  //$("#backButton").hide();

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
  var journey_class_updated = "e";
  if (journey_class == "Economy") {
    journey_class_updated = "e";

  }else if (journey_class== "Business") {
    journey_class_updated = "b";
  }
  else if(journey_class=="Premium"){
    journey_class_updated = "pe";

  }

  var journey_type_updated = true;
  if (journey_type != "Return") {
    journey_type_updated = false;
  }


  var formatted_Departure_Date = moment(departure_date).format('YYYY-MM-DD');
 
  var formatted_arrival_Date = (arrival_Date== "undefined" ? '' : moment(arrival_Date).format('YYYY-MM-DD'));
  $scope.type_model = journey_type;
  $scope.departurecity_model = departure_City;
  $scope.arrivalcity_model = arrival_city;
  $scope.departure_date_model = formatted_Departure_Date;
  $scope.arrival_date_model = formatted_arrival_Date;
  $scope.number_of_passengers= number_of_passengers;
  $scope.class_model = journey_class;
  $scope.result_search_departure_forward = departure_City;
  $scope.result_search_arrival_forward = arrival_city;
  $scope.result_search_departure_return = arrival_city;
  $scope.result_search_arrival_return = departure_City;
  
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
var departure_City_updated=departure_City.substring(departure_City.lastIndexOf("(")+1,departure_City.lastIndexOf(")"));
var arrival_City_updated=arrival_city.substring(arrival_city.lastIndexOf("(")+1,arrival_city.lastIndexOf(")"));
 sessionStorage.getItem("search_departure_city",departure_City_updated);
 sessionStorage.getItem("search_arrival_city",arrival_City_updated);
var user_Details = {};
user_Details['depart_timestamp'] = formatted_Departure_Date;   
user_Details['destination_airport'] = arrival_City_updated;   
user_Details['origin_airport'] = departure_City_updated;   
user_Details['seatClass'] = journey_class_updated;   
user_Details['isBothway'] = journey_type_updated;   
user_Details['return_depart_timestamp'] = formatted_arrival_Date;   
user_Details['seatCount'] = parseInt(number_of_passengers);
user_Details['user_id'] = user_detail_userId;     
//alert(JSON.stringify(user_Details));

function showMessage(message)
  {           
    $('#alertText').text(message);
    $("#modalButton").trigger( "click" );

  }

$http.post('http://localhost:8080/ARS/api/flight/search',user_Details).then(
  successCallback,errorCallback
  )
function successCallback(response){
  console.log(response);
  var forward_nonstop = [];
  var forward_stop = [];
  var return_nonstop = [];
  var return_stop = [];
  
  var oneWayData = response.data.oneWay;

  

  $('#backButton').click(function(){
      $(location).attr("href", "index.html"); 
  });

  if(oneWayData==undefined || oneWayData.length == 0)
  {
      $('#forwardHeading').hide();
      $('#returnHeading').hide();
      $('#submitButton').hide();
      $('#sortContainer').hide();
      $("#backButton").show();


      showMessage("No Fights Available for Selection, Please select a diferent date or source destinaion combination");

      //$(location).attr("href", "index.html"); 
  }

  for (var i = 0; i < oneWayData.length; i++) {
    if(oneWayData[i].stop_airport=='')
    {
      forward_nonstop.push(oneWayData[i]);
    }
    else
    {
      forward_stop.push(oneWayData[i]);
    }
  }
  
  $scope.forward_nonstop = forward_nonstop;
  $scope.forward_stop = forward_stop;

  var returnWayData = response.data.returnWay;
  if(returnWayData!=undefined){
    for (var i = 0; i < returnWayData.length; i++) {
      if(returnWayData[i].stop_airport=='')
      {
        return_nonstop.push(returnWayData[i]);
      }
      else
      {
        return_stop.push(returnWayData[i]);
      }
    }


    $scope.return_nonstop = return_nonstop;
    $scope.return_stop = return_stop;
  }
  else
  {
    $('#returnHeading').hide();
  }
  
}
function errorCallback(argument) {

}

$scope.searchSubmit = function () { 
          var checked_radio =$('input[type = "radio"]:checked');
          //alert(checked_radio.length);
        if((sessionStorage.getItem("search_arrival_date")!="undefined") &&  checked_radio.length<2){
          showMessage("Please Select Both forward and Return Leg flight before moving on to seat Selection");
          return;
        }

        if((sessionStorage.getItem("search_arrival_date")=="undefined") &&  checked_radio.length<1){
          showMessage("Please Select a flight before moving on to seat Selection");
          return;
        }

          var flight_id_list = [];
          var temp_flight_id_list = [];
          checked_radio.each(function(){

            if($(this).val().includes("#")){
             flight_id_list.push(($(this).val().split("#")[0])); 
             flight_id_list.push(($(this).val().split("#")[1]));
             temp_flight_id_list.push(($(this).val().split("#")[0])); 
             temp_flight_id_list.push(($(this).val().split("#")[1])); 
           } 
           else{
            flight_id_list.push($(this).val());
            temp_flight_id_list.push($(this).val());
          } 
        });

        sessionStorage.setItem("flight_id_list",JSON.stringify(flight_id_list)); 
        sessionStorage.setItem("temp_flight_id_list",JSON.stringify(temp_flight_id_list)); 
        $(location).attr("href", "seatSelection.html");        


}


});