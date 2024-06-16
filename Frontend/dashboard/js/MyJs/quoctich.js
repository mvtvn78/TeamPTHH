//image container
const arrImage = []
// phần chạy chính
$(document).ready(function(){
    
      // kiem tra cookie
      let token = getCookie("token");
      if(!token)
          token = 'NSTemp'
      queryDataGet(`http://localhost:1594/api/v1/users?token=${token}`,{},function(res)
          {
            if(res.ErrorCode !==0 || res.data[0].MaLoai != 'LOAI1')
                  window.location = "/TeamPTHH/Frontend/dashboard/login.html"
            else
              {
                  $(".profile_img").attr("src", domain + res.data[0].Anh);
                  $(".profile_name").text(res.data[0].HoTen)
              }
          } )
    // mode : 0 , chế độ ban đầu , 1 : chế dộ thêm , 2 : chế độ sửa
    let mode = 0;
    //trạng thái ban đầu
    $(".btnsave").prop("disabled",true)
    //làm mờ form
    $(".maqt").prop("disabled",true)
    $(".tenqt").prop("disabled",true)
    $(".file_anh").prop("disabled",true)
    show()
});
function ClearAndShow()  {
     // xóa dữ liệu cũ
     $(".maqt").val('')
     $(".tenqt").val('')
     $(".file_anh").val('')
     $(".file_name").text('default.jpg')
     $(".avatar-view").attr("src", domain + 'default.jpg');
    // Hiển thị lại dữ liệu
     show()
}
function show()
{
    queryDataGet("http://localhost:1594/api/v1/nations","",function(res){
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".quoctich_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const item in data){
                const obj=data[item];
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MaQT+'</td>'+
                                '<td>'+obj.TenQT+'</td>'+
                                '<td>'+obj.Anh+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-ma ="'+obj.MaQT+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span class="badge badge-danger nut_sua" data-ma ="'+
                                obj.MaQT+
                                '" data-tqt ="'+obj.TenQT+ 
                                '" data-anh ="'+obj.Anh+
                                '"> '+
                                '<i class="fa fa-edit"></i>&nbsp;Sửa</span></td>'+
                              '</tr>';
              }
            // chèn vào
            $(".quoctich_tb").html(htmls);
        }
    })  
}
    
// Tìm kiếm quốc tịch
function showSearch ()
{
    const keyseacrh = $(".txtsearch").val()
    console.log(keyseacrh);
    const datasend ={
        maQG : keyseacrh,
        tenQG : keyseacrh,
    }
    console.log(datasend);
    queryDataGet("http://localhost:1594/api/v1/nations_search",datasend,function(res){
        console.log(res);
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".quoctich_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const index in data){
                const obj=data[index];
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MaQT+'</td>'+
                                '<td>'+obj.TenQT+'</td>'+
                                '<td>'+obj.Anh+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-ma ="'+obj.MaQT+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span class="badge badge-danger nut_sua" data-ma ="'+
                                obj.MaQT+
                                '" data-tqt ="'+obj.TenQT+ 
                                '" data-anh ="'+obj.Anh+
                                '"> '+
                                '<i class="fa fa-edit"></i>&nbsp;Sửa</span></td>'+
                              '</tr>';
              }
            // chèn vào
            $(".quoctich_tb").html(htmls);
        }
    })  
} 
//Nhấn nút sửa
$(".quoctich_tb").on('click','.nut_sua',function()
{
    // thay đổi mode 
    mode = 2;
     //sáng trừ mã người dùng
     $(".maqt").prop("disabled",true)
     $(".tenqt").prop("disabled",false)
     $(".file_anh").prop("disabled",false)
    
    // mờ add , sáng save
    $(".btnadd").prop("disabled",true)
    $(".btnsave").prop("disabled",false)
    // lấy giá trị từ bản thân nó
    let MaQT = $(this).attr("data-ma")
    let TenQT = $(this).attr("data-tqt")
    let anh = $(this).attr("data-anh") 
    // lấy ảnh đưa lên
    $(".avatar-view").attr("src", domain + anh);
    console.log("CHECK",MaQT,TenQT,anh);
    // đưa thông tin lên form
    $(".maqt").val(MaQT)
    $(".tenqt").val(TenQT)
    $(".file_name").text(anh)
    
})
// Nhấn nút xóa
$(".quoctich_tb").on('click','.nut_xoa',function()
{
  console.log("da click nut xoa")
  const ma = $(this).attr("data-ma")
  console.log(ma)
  bootbox.confirm('Bạn có chắc xóa '+ma+' mã  này ?',function(result)
  {
    if (result==true)
    {
        queryDataDelete("http://localhost:1594/api/v1/nation_remove",{maQT:ma},function(res)
        {
            if(res.ErrorCode ==0)
                bootbox.alert("Xóa thành công" + ma)
            else 
                bootbox.alert("Xóa không thành công")
            ClearAndShow()
        })

    }
  } )
  // luôn cho mode :0
  mode = 0
})
// Nhấn nút xóa thanh tìm kiếm
$(".rm_txtsearch").click(function(e){
    $(".txtsearch").val('')
    ClearAndShow()
})
// Khi tìm kiếm nhấn nút enter tìm kiếm dữ liệu
$(".txtsearch").keyup(function(e){
    if(e.keyCode == 13)
    {
        showSearch()
    }
});
// Khi nhấn thêm
$(".btnadd").click(function()
{
    //thay đổi mode sang add
    mode =1
    // mờ add , sáng save
    $(".btnadd").prop("disabled",true)
    $(".btnsave").prop("disabled",false)
    // thực hiện công việc
    //làm mờ form
    $(".maqt").prop("disabled",false)
    $(".tenqt").prop("disabled",false)
    $(".file_anh").prop("disabled",false)
    //Xóa dữ liệu cũ
    $(".maqt").val('')
    $(".tenqt").val('')
    
})
// Khi nhấn lưu
$(".btnsave").click(function()
{
    // mờ save , sáng add
    $(".btnadd").prop("disabled",false)
    $(".btnsave").prop("disabled",true)
    //làm mờ form
    $(".maqt").prop("disabled",true)
    $(".tenqt").prop("disabled",true)
    $(".file_anh").prop("disabled",true)
    // thực hiện gọi API đăng ký
    if(mode ==1)
    {
        // tạo chế độ form data
        const formData = new FormData();
        // lấy tệp tin
        let fileName = $(".file_anh")[0].files[0]
        //Trường hợp  có  ảnh
        if(fileName)
            {
                // Thường hợp có ảnh
        formData.append('file',fileName)
        // gọi API UPLOAD
        $.ajax({
                url: "http://localhost:1594/upload",
                type: 'POST',
                data: formData,
                contentType : false,
                processData : false,
                success: function(res)
                {
                    if(+res.ErrorCode === 0)
                    {
                        console.log("UPLOAD",res);
                        fileName = res.data
                        const datasend = {
                            maQT : $(".maqt").val(),
                            tenQT : $(".tenqt").val(),
                            anh : fileName,
                        }
                        queryDataPost("http://localhost:1594/api/v1/nation_add",datasend,function(res)
                        {
                            console.log(res);
                            if(res.ErrorCode == 0)
                            {
                                bootbox.alert("Lưu thành công");
                                ClearAndShow()
                            }
                            else {
                               
                                bootbox.alert("Lưu thất bại");
                                ClearAndShow()
                                
                            }
                        })
                    }
                    else 
                    {
                        bootbox.alert("Upload ảnh thất bại");
                        ClearAndShow()
                    }
                }
            }
        )
            }
            else{
                const datasend = {
                    maQT : $(".maqt").val(),
                    tenQT : $(".tenqt").val(),
                    anh : $(".file_name").text(),
                }
                queryDataPost("http://localhost:1594/api/v1/nation_add",datasend,function(res)
                {
                    console.log(res);
                    if(res.ErrorCode == 0)
                    {
                        bootbox.alert("Lưu thành công");
                        ClearAndShow()

                    }
                    else {
                        bootbox.alert("Lưu thất bại");
                        ClearAndShow()

                    }
                })
            }
       
    }
    // thực hiện gọi API sửa
    else
    {
        // tạo chế độ form data
        const formData = new FormData();
        // lấy tệp tin
        let fileName = $(".file_anh")[0].files[0]
        //Trường hợp không có cập nhật ảnh
        if(!fileName)
        {
            const datasend = {
                maQT : $(".maqt").val(),
                tenQT : $(".tenqt").val(),
                anh :  $(".file_name").text(),
            }
            console.log("CHẠY VÀO KHÔNG CÓ");
            return queryDataPut("http://localhost:1594/api/v1/nation_update",datasend,function(res)
            {
                console.log(res);
                if(res.ErrorCode ==0)
                {
                    bootbox.alert("Lưu thành công");
                    ClearAndShow()
                }
                else {
                    bootbox.alert("Lưu thất bại");
                    ClearAndShow()
                }
            })
        }
        console.log("CHẠY VÀO CÓ ẢNH");
        // Thường hợp có ảnh
        formData.append('file',fileName)
        // gọi API UPLOAD
        $.ajax({
                url: "http://localhost:1594/upload",
                type: 'POST',
                data: formData,
                contentType : false,
                processData : false,
                success: function(res)
                {
                    if(res.ErrorCode === 0)
                    {
                        console.log(res);
                        fileName = res.data
                        const datasend = {
                            maQT : $(".maqt").val(),
                            tenQT : $(".tenqt").val(),
                            anh : fileName,
                        }
                        queryDataPut("http://localhost:1594/api/v1/nation_update",datasend,function(res)
                        {
                            console.log(res);
                            if(res.ErrorCode == 0)
                            {
                                bootbox.alert("Lưu thành công");
                                ClearAndShow()
                            }
                            else {
                                bootbox.alert("Lưu thất bại");
                                ClearAndShow()
                            }
                        })
                    }
                    else 
                    {
                        bootbox.alert("Upload ảnh thất bại");
                        ClearAndShow()
                    }
                }
            }
        )
       
    }
   
})
// nhấn file upload 
$(".file_anh").change(function(){
    if(arrImage.length >0 )
    {
        for(let i = 0 ;i<arrImage.length ; ++i)
            URL.revokeObjectURL(arrImage[i])
    } 
    $(".file_name").text($(".file_anh")[0].files[0].name)
    const obj = URL.createObjectURL($(".file_anh")[0].files[0])
    arrImage.push(obj)
    // lấy ảnh đưa lên
    $(".avatar-view").attr("src", obj);
})