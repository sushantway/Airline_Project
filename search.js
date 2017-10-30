 function submitSearchdata()
{   
    console.log("Ajinkya");
    var firstName = $('#first_name').val();
    var lastName = $('#last_name').val();
    var passWord = $('#passWord').val();
    var gender = $('#email').val();
    var phoneA = $('#phone1').val();
    var phoneB = $('#phone2').val();
    var phoneC = $('#phone3').val();
    var gender = $('input[name="gender"]:checked').val();
    var urlbase = "http://10.0.0.192:8080/ARS/api/user";
    urlbase = 
    $.ajax({
            type: "GET",
            url: urlbase    ,
            dataType: "json",
            success: function (xml) { 
                result = xml.language;
                console.log(result);
                return true;
               // document.myform.result1.value = result;
            },
            error: function (xml) {
                return false;
            }
        });            

}
