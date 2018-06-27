
var user_detail_userId = null;
var success_first_name1 = null;
function check() {
  
  user_detail_userId = sessionStorage.getItem("success_user_id");
  success_first_name1 = sessionStorage.getItem("success_first_name");
  var label2 = "Welcome,"+success_first_name1;
  if(user_detail_userId === null){
    $('#signupButton').show();
    $('#manageButton').hide();
    $('#logOutButton').hide();  

  }
  else{
   $('#signupButton').hide();
   $('#manageButton').show();   
   $('#loginDiv').remove();
   $('#passwordDiv').remove();
   $('#loginbutton').remove();
   $('#manageButton').text(label2);
   $('#logOutButton').show();   
   sessionStorage.clear();
    sessionStorage.setItem("success_user_id",user_detail_userId);
    sessionStorage.setItem("success_first_name",success_first_name1); 

 }
}


$.fn.serializeObject = function()
{
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  })
  return o;
};


var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope,$http) {
    //$scope.myTxt = "You have not yet clicked submit";


      $scope.submitMyForm = function () { 
          var data=$scope.fields;
          if ($scope.fields.middle_name== undefined)
          {
           $scope.fields.middle_name="";
          }



          $http.post('http://localhost:8080/ARS/api/user/register',data).then(successCallback,errorCallback)
     }

     $scope.submitMySearchForm = function () { 
      
      if(user_detail_userId === null)
      {
        showMessage("Please login before you search.");
      }
      else
      {
        var data=$scope.fields1;
        console.log(JSON.stringify(data));
        console.log(($('#radioReturnWay').is(':checked') && (data.arrival_date_model==undefined)));
        if(data==undefined || data.departureCity_model==undefined || data.departure_date_model==undefined || data.number_of_passengers_model==undefined || data.class_model==undefined || data.arrivalCity_model==undefined || ($('#radioReturnWay').is(':checked') && (data.arrival_date_model==undefined)) ){showMessage("Please Complete all Fields BEfore Searching"); return;}
        sessionStorage.setItem("search_departure_city",$scope.fields1.departureCity_model);
        sessionStorage.setItem("search_journey_type",$scope.fields1.type_model);
        sessionStorage.setItem("search_departure_date",$scope.fields1.departure_date_model);
        sessionStorage.setItem("search_arrival_date",$scope.fields1.arrival_date_model);
        sessionStorage.setItem("search_arrival_city",$scope.fields1.arrivalCity_model);
        sessionStorage.setItem("search_number_of_passengers",$scope.fields1.number_of_passengers_model);
        sessionStorage.setItem("search_class",$scope.fields1.class_model);
         // )

         $(location).attr("href", "Results.html");
     }

     }
 });

function successCallback(response)
{     
    $(location).attr("href", "index.html");            
}


function errorCallback(argument) {

}

function submitRegisterData()
{   
        //var urlbase = "10.0 ";    
        console.log("aad");
   //     alert($("#registerForm").text(JSON.stringify($('form').serializeObject())));   
        
      }

function showMessage(message)
{   
        
  $('#alertText').text(message);
  $("#modalButton").trigger( "click" );
}

$(document).ready(function(){

    $("#logOutButton").click(function(){
      sessionStorage.clear();
      $(location).attr("href", "index.html");        
    });

    $("#loginbutton").click(function(){
        var user={};
        user["email"]=$('#loginName').val();
        user["password"]=$('#loginPassword').val();
        var data = JSON.stringify(user);
        var count = 0;
        
        $.ajax({
          url: 'http://localhost:8080/ARS/api/user/login',
          type: "POST",
          data: data,
          dataType: "json",
          contentType: "application/json",
          success: function(result) {
            console.log("Response " + JSON.stringify(result));
            if(result.message == "Login Sucessful!")
            {
              var success_first_name = result.first_name;
              var success_user_id = result.user_id;
              var label1 = "Welcome,"+success_first_name;
               // alert(success_user_id);
               sessionStorage.setItem("success_user_id",success_user_id);
               sessionStorage.setItem("success_first_name",success_first_name);
               user_detail_userId = success_user_id;
               success_first_name1 = success_first_name;

               $('#signupButton').hide();
               $('#loginDiv').remove();
               $('#passwordDiv').remove();
               $('#loginbutton').remove();
               //$('#signInForm').html("<label style=" +' "background-color: red;" '+ ">"+label1+"</label>");
               $('#manageButton').show();
               $('#logOutButton').show();
               $('#manageButton').text(label1);
            }
            else
            {

              showMessage(result.message);
            }
           }
         });
    });
});    