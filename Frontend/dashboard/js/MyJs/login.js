$(document).ready(function(){
    $("#submitt").click(function(){
        var dataSend = {
            maQT:$(".maqt").val(),
            hoTen:$(".Username").val(),
            gioiTinh:$(".gioitinh").val(),
            ngaySinh:$(".ngaysinh").val(),
            email:$(".Email").val(),
            pass:$(".Password").val(),
        }
      console.log(dataSend)
      queryDataPost("http://localhost:8001/api/v1/register",dataSend,function(res){
        console.log(res)
        
      })
    });
    
  });


  $(document).ready(function(){
    $("#submit1").click(function(){
        var dataSend = {
            email:$(".usernamee").val(),
            pass:$(".passwordd").val(),
        }
      console.log(dataSend)
      queryDataPost("http://localhost:8001/api/v1/login",dataSend,function(res){
        console.log(res)
        
      })
    });

  });