$(document).ready(function() {

    $("#button_mofify").click(function(check) {
        check.preventDefault();
        
        //alert('aa');
        if ($("#modifyPwd1").val() != $("#modifyPwd2").val()) {
            alert("两次密码不一致");
            $("#modifyPwd1").val("");  
            $("#modifyPwd2").val("");  
        } else {

          var newPwd = $("#modifyPwd1").val();
          var account_t = $("#account").val();
          var password_t = $("#password").val();
        
        //to get the _xsrf cookies.
          var xsrf_t = getCookie("_xsrf");
        
          $.post("/account/get_salt_value", {account: account_t, _xsrf: xsrf_t},
            function(data,status) {
              var salt = data;
              //debug
              //alert("salt  " + salt);

              if (salt != "") {
                password_t = $.md5(password_t + salt);
                newPwd = $.md5(newPwd + salt);
                $.post("/modify/password", {account: account_t, password:password_t, newPwd: newPwd, salt: salt, _xsrf: xsrf_t},
                  function(data,status){
                    var array = $.parseJSON(data);
                    if (array.status == 200) {
                      alert("密码修改成功");
                      window.location.href = "/" + array.id;
                    } else if(array.status == 500){
                      alert("密码错误");
                    } else {
                      alert("修改失败，重新修改");
                    }
                  });
              } else {
                //the salt is empty......
                alert("修改失败，请重新修改");
              }
            });
      }
    });
});

function getCookie(name) {
  
    var c = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return c ? c[1] : undefined;
}
