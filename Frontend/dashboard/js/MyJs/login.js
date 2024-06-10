$(document).ready(function(){
    $("#lg-btn").click(function(){
        var dataSend = {
            email:$(".login-un").val(),
            pass:$(".login-pw").val(),
        }
        console.log(dataSend)
        queryDataPost("http://localhost:6969/api/v1/login",dataSend,function(res){
        console.log(res)     
      })
    }); 
  });

  $(document).ready(function(){
    $("#reg-btn").click(function(){
        var dataSend = {
            email:$(".reg-email").val(),
            pass:$(".reg-pw").val(),
            gioiTinh:$(".reg-gender").val(),
            maQT:$(".reg-MaQT").val(),
            hoTen:$(".reg-un").val(),
            ngaySinh:$(".reg-birthd").val()
        }
        console.log(dataSend)
        queryDataPost("http://localhost:6969/api/v1/register",dataSend,function(res){
        console.log(res)     
      })
    }); 
  });