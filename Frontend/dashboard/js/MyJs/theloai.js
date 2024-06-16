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
    $(".maTL").prop("disabled",true)
    $(".tenTL").prop("disabled",true)

    show()
});
function ClearAndShow()  {
    // xóa dữ liệu cũ
    $(".maTL").val('')
    $(".tenTL").val('')
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
    queryDataGet("http://localhost:1594/api/v1/genre","",function(res){
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".nguoidung_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const item in data){
                const obj=data[item];
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MATL+'</td>'+
                                '<td>'+obj.TenTL+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-ma ="'+obj.MATL+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span class="badge badge-danger nut_sua" data-ma ="'+
                                obj.MATL+
                               
                                '" data-qt ="'+obj.TenTL+ 
                                '"> '+
                                '<i class="fa fa-edit"></i>&nbsp;Sửa</span></td>'+
                              '</tr>';
              }
            // chèn vào
            $(".nguoidung_tb").html(htmls);
        }
    })  
}
// Tìm kiếm tên người dùng
function showSearch ()
{
    const keyseacrh = $(".txtsearch").val()
    console.log(keyseacrh);
    const datasend ={
        maTL : keyseacrh,
        tenTL : keyseacrh,
    }
    console.log(datasend);
    queryDataGet("http://localhost:1594/api/v1/genre_search",datasend,function(res){
        console.log(res);
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".nguoidung_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const index in data){
                const obj=data[index];
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MATL+'</td>'+
                                '<td>'+obj.TenTL+'</td>'+
                                
                                '<td> <span class="badge badge-danger nut_xoa" data-ma ="'+obj.MATL+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span class="badge badge-danger nut_sua" data-ma ="'+
                                obj.MATL+
                                '" data-qt ="'+obj.TenTL+ 
                                
                                '"> '+
                                '<i class="fa fa-edit"></i>&nbsp;Sửa</span></td>'+
                              '</tr>';
              }
            // chèn vào
            $(".nguoidung_tb").html(htmls);
        }
    })  
} 
//Nhấn nút sửa
$(".nguoidung_tb").on('click','.nut_sua',function()
{
    // thay đổi mode 
    mode = 2;
     //sáng trừ mã người dùng
     $(".maTL").prop("disabled",true)
     $(".tenTL").prop("disabled",false)

    // mờ add , sáng save
    $(".btnadd").prop("disabled",true)
    $(".btnsave").prop("disabled",false)
    // lấy giá trị từ bản thân nó
    let MATL = $(this).attr("data-ma")
    let TenTL = $(this).attr("data-qt")
   
    console.log("CHECK",MATL,TenTL);
    // đưa thông tin lên form
    $(".maTL").val(MATL)
    $(".tenTL").val(TenTL)
    $(".tenTL").focus()
    
})
// Nhấn nút xóa
$(".nguoidung_tb").on('click','.nut_xoa',function()
{
  console.log("da click nut xoa")
  const ma = $(this).attr("data-ma")
  console.log(ma)
  bootbox.confirm('Bạn có chắc xóa '+ma+' mã  này ?',function(result)
  {
    if (result==true)
    {
        queryDataDelete("http://localhost:1594/api/v1/genre_remove",{maTL:ma},function(res)
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
    $(".maTL").prop("disabled",false)
    $(".tenTL").prop("disabled",false)
    //Xóa dữ liệu cũ
    $(".maTL").val('')
    $(".tenTL").val('')})
// Khi nhấn lưu
$(".btnsave").click(function()
{
    // mờ save , sáng add
    $(".btnadd").prop("disabled",false)
    $(".btnsave").prop("disabled",true)
    //Khi lưu xong
    $(".maTL").prop("disabled",true)
    $(".tenTL").prop("disabled",true)
    // thực hiện gọi API đăng ký
    if(mode ==1)
    {
        // gọi API đăng ký
        const datasend = {
            maTL : $(".maTL").val(),
            tenTL : $(".tenTL").val(),
        }
        console.log(datasend);
        queryDataPost("http://localhost:1594/api/v1/genre_add",datasend,function(res)
        {
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
    // thực hiện gọi API sửa
    else if (mode ==2) {
        const datasend = {
            maTL: $(".maTL").val(),
            tenTL: $(".tenTL").val(),
        };
        console.log("CHẠY VÀO KHÔNG CÓ ẢNH");
        return queryDataPut("http://localhost:1594/api/v1/genre_update", datasend, function(res) {
            console.log(res);
            if (res.ErrorCode == 0) {
                bootbox.alert("Lưu thành công");
            } else {
                bootbox.alert("Lưu thất bại");
            }
            ClearAndShow()
        });
    }
});