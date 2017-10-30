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
