

function check() {

  var user_detail_userId = sessionStorage.getItem("success_user_id");
  var success_first_name1 = sessionStorage.getItem("success_first_name");
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
       {alert("ola"); 
     $scope.fields.middle_name="";}
     /* post to server*/
     alert(JSON.stringify(data));
     $http.post('http://10.0.0.192:8080/ARS/api/user/register',data).then(
      successCallback,errorCallback
      )
   }

   $scope.submitMySearchForm = function () { 
    var data=$scope.fields1;
    alert(JSON.stringify(data));
    sessionStorage.setItem("search_departure_city",$scope.fields1.departureCity_model);
    sessionStorage.setItem("search_journey_type",$scope.fields1.type_model);
    sessionStorage.setItem("search_departure_date",$scope.fields1.departure_date_model);
    sessionStorage.setItem("search_arrival_date",$scope.fields1.arrival_date_model);
    sessionStorage.setItem("search_arrival_city",$scope.fields1.arrivalCity_model);
    sessionStorage.setItem("search_number_of_passengers",$scope.fields1.number_of_passengers_model);
    sessionStorage.setItem("search_class",$scope.fields1.class_model);
     // )
   }
 });

function successCallback(response){
 alert(JSON.stringify(response));
// $('#registerModal').remove();
// $('#registerModal').innerHTML = " <div style="+ '"display: none;" class="alert alert-success">'+
  //                  "<strong>Success!</strong> This alert box could indicate a successful or positive action.</div>";
}
function errorCallback(argument) {

}

function submitRegisterData()
{   
        //var urlbase = "10.0 ";    
        console.log("aad");
        alert($("#registerForm").text(JSON.stringify($('form').serializeObject())));   
        
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
            url: 'http://10.0.0.192:8080/ARS/api/user/login',
            type: "POST",
            data: data,
            dataType: "json",
            contentType: "application/json",
            success: function(result) {
              console.log("Response " + JSON.stringify(result));
              var success_first_name = result.first_name;
              var success_user_id = result.user_id;
              var label1 = "Welcome,"+success_first_name;
               // alert(success_user_id);
               sessionStorage.setItem("success_user_id",success_user_id);
               sessionStorage.setItem("success_first_name",success_first_name);

               $('#signupButton').hide();
               $('#loginDiv').remove();
               $('#passwordDiv').remove();
               $('#loginbutton').remove();
               //$('#signInForm').html("<label style=" +' "background-color: red;" '+ ">"+label1+"</label>");
               $('#manageButton').show();
               $('#logOutButton').show();
               $('#manageButton').text(label1);
             }
           });
        });
      });    