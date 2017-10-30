
var app = angular.module("myApp1", []);
app.controller("myCtrl1", function($scope,$http) {
  var user_detail_userId = sessionStorage.getItem("success_user_id");
  var success_first_name1 = sessionStorage.getItem("success_first_name");
  var label2 = "Welcome,"+success_first_name1;
  if(user_detail_userId === null){
   $(location).attr("href", "index.html");        

 }
 else{
  $('#manageButton').show();   
  $('#manageButton').text(label2);
  $('#logOutButton').show();   


}
var url_updateUserDetails = 'http://10.0.0.192:8080/ARS/api/user/'+user_detail_userId;     	
    	//var data;
    	$http.get(url_updateUserDetails).then(
    		successCallback,errorCallback
    		)
    	function successCallback(response){
    		$scope.first_name = response.data.first_name;
    		$scope.middle_name = response.data.middle_name;
    		$scope.last_name = response.data.last_name;
        $scope.password = response.data.password;
        $scope.password_confirmation = response.data.password_confirmation;
    		$scope.email = response.data.email;
    		$scope.phone_primary = response.data.phone_primary;
    		$scope.age = response.data.age;
    		//alert(response.first_name);

    	}
    	function errorCallback(argument) {

    	}
    	$scope.updateMyDetails = function () { 
    		if ($scope.middle_name== undefined)
    		{ 
    			$scope.middle_name="";}	
    			var user_Details = {};
    			user_Details['first_name'] = $scope.first_name; 	
    			user_Details['middle_name'] = $scope.middle_name; 	
    			user_Details['last_name'] = $scope.last_name; 	
    			user_Details['email'] = $scope.email; 	
    			user_Details['password'] = $scope.password; 	
    			user_Details['phone_primary'] = $scope.phone_primary; 	
    			user_Details['age'] = $scope.age;
    			user_Details['user_id'] = user_detail_userId; 	 	

    			$http.post('http://10.0.0.192:8080/ARS/api/user/register/edit',user_Details).then(
    				successCallback_edit,errorCallback_edit
    				)



    		}	

    		function successCallback_edit(response){
          alert("Updated Successfully");
          $(location).attr("href", "index.html");        
          
        }
        function errorCallback_edit(argument) {

        }	



      });



$(document).ready(function(){
  $("#logOutButton").click(function(){
    sessionStorage.clear();
    $(location).attr("href", "index.html");        
  });
});   






















