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
    $(".maAB").prop("disabled",true)
    $(".tenAB").prop("disabled",true)
    $(".file_anh").prop("disabled",true)
    $(".mota").prop("disabled",true)
    $(".tinhtrang").prop("disabled",true)
    show()
});
function ClearAndShow()  {
    // xóa dữ liệu cũ
    $(".maAB").val('')
    $(".tenAB").val('')
    $(".file_anh").val('')
    $(".mota").val('')
    $(".tinhtrang").val('')
    $(".file_name").text('default.jpg')
    $(".avatar-view").attr("src", domain + 'default.jpg');
   // Hiển thị lại dữ liệu
    show()
}
// Chuyển đổi dữ liệu để hiển thị 
function ConvertDate(date,mode = true)
{
    // mode 1 : dd/mm/yyyy , mode 2 : yyyy/mm/dd
    const datearray = date.split("/");
    // 
    for(let indx in datearray)
        if(datearray[indx]<10)
            datearray[indx] = "0"+datearray[indx]
    if(mode)
        return datearray[1] + '-' + datearray[0] + '-' + datearray[2];
    return datearray[2] + '-' + datearray[0] + '-' + datearray[1];
}
// Chuyển đổi dữ liệu để hiển thị theo thời gian và ngày
function DisplayDateTime(datetime)
{
    const datetimearray = datetime.split(",");
    const date= datetimearray[0]
    const time = datetimearray[1]
    const newdate = ConvertDate(date) + time
    return newdate
}
// lấy danh sách người dùng
function show()
{
    queryDataGet("http://localhost:1594/api/v1/albums","",function(res){
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".album_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const item in data){
                const obj=data[item];
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MAALB+'</td>'+
                                '<td>'+obj.TenALB+'</td>'+
                                '<td>'+obj.MoTa+'</td>'+
                                '<td>'+obj.HinhAnh+'</td>'+
                                '<td>'+obj.TinhTrang+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-ma ="'+obj.MAALB+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span class="badge badge-danger nut_sua" data-ma ="'+
                                obj.MAALB+
                                '" data-tenAB ="'+obj.TenALB+ 
                                '" data-mota ="'+obj.MoTa+ 
                                '" data-anh ="'+obj.HinhAnh+
                                '" data-tinhtrang ="'+obj.TinhTrang+
                                '"> '+
                                '<i class="fa fa-edit"></i>&nbsp;Sửa</span></td>'+
                              '</tr>';
              }
            // chèn vào
            $(".album_tb").html(htmls);
        }
    })  
}
// Tìm kiếm Album
function showSearch ()
{
    const keyseacrh = $(".txtsearch").val()
    console.log(keyseacrh);
   
    
    queryDataGet(`http://localhost:1594/api/v1/album_search?maALB=${keyseacrh}&tenALB=${keyseacrh}`,"",function(res){
        console.log(res);
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".album_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const index in data){
                const obj=data[index];
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MAALB+'</td>'+
                                '<td>'+obj.TenALB+'</td>'+
                                '<td>'+obj.MoTa+'</td>'+
                                '<td>'+obj.HinhAnh+'</td>'+
                                '<td>'+obj.TinhTrang+'</td>'+
                              '</tr>';
              }
            // chèn vào
            $(".album_tb").html(htmls);
        }
    })  
} 
//Nhấn nút sửa
$(".album_tb").on('click','.nut_sua',function()
{
    // thay đổi mode 
    mode = 2;
     //sáng trừ mã người dùng
    $(".maAB").prop("disabled",true)
    $(".tenAB").prop("disabled",false)
    $(".file_anh").prop("disabled",false)
    $(".mota").prop("disabled",false)
    $(".tinhtrang").prop("disabled",false)
    // mờ add , sáng save
    $(".btnadd").prop("disabled",true)
    $(".btnsave").prop("disabled",false)
    // lấy giá trị từ bản thân nó
    let MA = $(this).attr("data-ma")
    let TAB = $(this).attr("data-tenAB")
    let anh = $(this).attr("data-anh")
    let MT = $(this).attr("data-mota")
    let TT = $(this).attr("data-tinhtrang")
    
    
    // lấy ảnh đưa lên
    $(".avatar-view").attr("src", domain + anh);
    console.log("CHECK",MA,TAB,anh,MT,TT);
    // đưa thông tin lên form
    $(".maAB").val(MA)
    $(".tenAB").val(TAB)
    $(".file_name").text(anh)
    $(".mota").val(MT)
    $(".tinhtrang").val(TT)
    
    //
    $(".tenAB").focus()  
})
// Nhấn nút xóa
$(".album_tb").on('click','.nut_xoa',function()
{
  console.log("da click nut xoa")
  const ma = $(this).attr("data-ma")
  console.log(ma)
  bootbox.confirm('Bạn có chắc xóa '+ma+' mã  này ?',function(result)
  {
    if (result==true)
    {
        queryDataDelete("http://localhost:1594/api/v1/album_remove",{maALB:ma},function(res)
        {
            if(res.ErrorCode ==0)
                bootbox.alert("Xóa thành công " + ma)
            else 
                bootbox.alert("Xóa không thành công")
            ClearAndShow()
        })

    }
  } )
  // luôn cho mode :0
  mode = 0
  // Hiển thị lại dữ liệu
  show()
})
// Nhấn nút xóa thanh tìm kiếm
$(".rm_txtsearch").click(function(e){
    $(".txtsearch").val('')
    show()
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
    $(".maAB").prop("disabled",true)
    $(".tenAB").prop("disabled",false)
    $(".file_anh").prop("disabled",false)
    $(".mota").prop("disabled",false)
    $(".tinhtrang").prop("disabled",true)
    $(".tenAB").focus()
    //Xóa dữ liệu cũ
    $(".maAB").val('')
    $(".tenAB").val('')
    $(".file_anh").val('')
    $(".mota").val('')
    $(".tinhtrang").val('')
    
})
// Khi nhấn lưu
$(".btnsave").click(function()
{
    // mờ save , sáng add
    $(".btnadd").prop("disabled",false)
    $(".btnsave").prop("disabled",true)
    //Khi lưu xong
    $(".maAB").prop("disabled",true)
    $(".tenAB").prop("disabled",true)
    $(".file_anh").prop("disabled",true)
    $(".mota").prop("disabled",true)
    $(".tinhtrang").prop("disabled",true)
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
                        if(res.ErrorCode === 0)
                        {
                            console.log(res);
                            fileName = res.data
                            const datasend = {
                                tenALB : $(".tenAB").val(),
                                moTa : $(".mota").val(),
                                hinhanh : fileName,
                            }
                            queryDataPost("http://localhost:1594/api/v1/album_add",datasend,function(res)
                            {
                                console.log(res);
                                if(res.ErrorCode == 0)
                                {
                                    bootbox.alert("Lưu thành công");
                                }
                                else {
                                    bootbox.alert("Lưu thất bại");
                                }
                                ClearAndShow()
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
                        tenALB : $(".tenAB").val(),
                        moTa : $(".mota").val(),
                        hinhanh :  $(".file_name").text(),
                    }
                    queryDataPost("http://localhost:1594/api/v1/album_add",datasend,function(res)
                    {
                        console.log(res);
                        if(res.ErrorCode == 0)
                        {
                            bootbox.alert("Lưu thành công");
                        }
                        else {
                            bootbox.alert("Lưu thất bại");
                        }
                        ClearAndShow()
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
                                maALB : $(".maAB").val(),
                                tenALB : $(".tenAB").val(),
                                moTa : $(".mota").val(),
                                hinhanh :  $(".file_name").text(),
                                tinhTrang : $(".tinhtrang").val(),
            }
            return queryDataPut("http://localhost:1594/api/v1/album_update",datasend,function(res)
            {
                console.log(res);
                if(res.ErrorCode ==0)
                {
                    bootbox.alert("Lưu thành công");
                }
                else {
                    bootbox.alert("Lưu thất bại");
                }
                ClearAndShow()
            })
        }
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
                                maALB : $(".maAB").val(),
                                tenALB : $(".tenAB").val(),
                                moTa : $(".mota").val(),
                                hinhanh : fileName,
                                tinhTrang : $(".tinhtrang").val(),
                        }
                        queryDataPut("http://localhost:1594/api/v1/album_update",datasend,function(res)
                        {
                            console.log(res);
                            if(res.ErrorCode == 0)
                            {
                                bootbox.alert("Lưu thành công");
                            }
                            else {
                                bootbox.alert("Lưu thất bại");
                            }
                            ClearAndShow()
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