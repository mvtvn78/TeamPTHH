$(document).ready(function(){
    $("#lg-btn").click(function(){
        var dataSend = {
            email:$(".login-un").val(),
            pass:$(".login-an").val(),
        }
      console.log(dataSend)
      queryDataPost("http://localhost:8001/api/v1/login",dataSend,function(res){
        console.log(res)
        
      })
    });

  });