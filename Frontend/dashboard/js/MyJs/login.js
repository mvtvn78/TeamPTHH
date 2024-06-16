
$(document).ready(function(){
    // kiem tra cookie
    let token = getCookie("token");
    // lấy được token hợp lệ thì quay về dashboard
    if(token != '')
        {
         queryDataGet(`http://localhost:1594/api/v1/users?token=${token}`,{},function(res)
         {
           if(res.ErrorCode !==0)
             return;
            const maLoai = res.data[0].MaLoai
           if(maLoai != 'LOAI1')
              return;
            window.location = "/TeamPTHH/Frontend/dashboard/"
         }  
        )
        }
   
 });
  // xử lý khi đăng nhập
  $("#log").click(function(){
    const email_text = $(".email").val()
    const pass_text = $(".matkhau").val()
    if(!email_text || !pass_text)
      {
        bootbox.alert("Vui lòng nhập thông tin đầy đủ")
        return;
      }
    const dataSend = {
        email:email_text,
        pass:pass_text,
    }
  console.log(dataSend)
  queryDataPost("http://localhost:1594/api/v1/login",dataSend,function(res){
    //console.log(res)
    if(res.ErrorCode ==0)
       {
        const token = res.data.token
        queryDataGet(`http://localhost:1594/api/v1/users?token=${token}`,{},function(res)
        {
          if(res.ErrorCode !==0)
            {
              bootbox.alert("Đăng nhập không thành công")
              return;
            }
           const maLoai = res.data[0].MaLoai
          if(maLoai != 'LOAI1')
            {
              bootbox.alert("Loại tài khoản của bạn không đủ quyền!Vui lòng liên hệ để nâng cấp")
              return;
            }
          // luu token trong cookie
          document.cookie = "token="+token; 
          // chuyen huong ve trang chu
          window.location = "/TeamPTHH/Frontend/dashboard/"
        }  
       )
       }
    else 
        bootbox.alert("Tài khoản hoặc mật khẩu không  chính xác")
  })
});
 // xử lý khi quên mật  khẩu
 $("#forgot").click(function(){
    const dataSend = {
        email:$(".emailforgot").val(),
    }
  queryDataPost("http://localhost:1594/api/v1/forgot",dataSend,function(res){
    //console.log(res)
    if(res.ErrorCode ==0)
        bootbox.alert("Vui lòng kiểm tra hòm thư.Thư đã gửi")
    else if(res.ErrorCode == -2)
        bootbox.alert("Email không hợp lệ vui lòng nhập lại")
    else
        bootbox.alert("Xảy ra lỗi vui lòng thử lại")
  })
});
