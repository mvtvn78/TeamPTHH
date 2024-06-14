// phần chạy chính
$(document).ready(function(){
    // mode : 0 , chế độ ban đầu , 1 : chế dộ thêm , 2 : chế độ sửa
    let mode = 0;
    //trạng thái ban đầu
    $(".btnsave").prop("disabled",true)
    //làm mờ form
    $(".maNS").prop("disabled",true)
    $(".maBH").prop("disabled",true)
    comboBox()
    show()
});

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
// lấy dữ liệu combobox 
function comboBox()
{
    // load combobox cho mã quốc tịch
    queryDataGet("http://localhost:8001/api/v1/songs", "", function (res) {
        // lấy dữ liệu từ api
        const data = res.data;
        // lấy error code để check
        const code = res.ErrorCode;
        if (code != 0) {
          $(".maBH").html("không có dữ liệu");
        } else {
            let htmls = '';
        // lặp các element có trong data
            for (const  element in data) {
            const item = data[element];
            htmls = htmls + '<option value="' + item.MABH + '">' + item.TenBH + "</option>";
            }
            $(".maBH").html(htmls);
        }
      });
    // load combobox cho mã loại
    queryDataGet("http://localhost:8001/api/v1/artists", "", function (res) {
        // lấy dữ liệu từ api
        const data = res.data;
        // lấy error code để check
        const code = res.ErrorCode;
        if (code != 0) {
          $(".maNS").html("không có dữ liệu");
        } else {
            let htmls = '';
        // lặp các element có trong data
            for (const  element in data) {
            const item = data[element];
            htmls = htmls + '<option value="' + item.MANS + '">' + item.TenNS + "</option>";
            }
            $(".maNS").html(htmls);
        }
      });
}
// lấy danh sách người dùng
function show()
{
    queryDataGet("http://localhost:8001/api/v1/release_song","",function(res){
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
                const thoigian = new Date(obj.ThoiGian);
                        htmls=htmls+'<tr>'+
                                
                                '<td>'+obj.MANS+'</td>'+
                                '<td>'+obj.MABH+'</td>'+
                                '<td>'+DisplayDateTime(thoigian.toLocaleString())+'</td>'+
                                
                                '<td> <span class="badge badge-danger nut_xoa" data-ma1 ="'+obj.MANS+'"data-ma='+obj.MABH+'> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                
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
   
    
    queryDataGet(`http://localhost:8001/api/v1/release_song_search?maNS=${keyseacrh}&maBH=${keyseacrh}`,"",function(res){
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
                const thoigian = new Date(obj.ThoiGian);
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MANS+'</td>'+
                                '<td>'+obj.MABH+'</td>'+
                                '<td>'+DisplayDateTime(thoigian.toLocaleString())+'</td>'+
                              '</tr>';
              }
            // chèn vào
            $(".nguoidung_tb").html(htmls);
        }
    })  
}

// Khi tìm kiếm nhấn nút enter tìm kiếm dữ liệu
$(".txtsearch").keyup(function (e) {
    if (e.keyCode == 13) {
        showSearch();
    }
});

//Nhấn nút sửa
$(".nguoidung_tb").on('click','.nut_sua',function()
{
    // thay đổi mode 
    mode = 2;
     //sáng trừ mã người dùng
    
     $(".maNS").prop("disabled",false)
     $(".maBH").prop("disabled",false)
    // mờ add , sáng save
    $(".btnadd").prop("disabled",true)
    $(".btnsave").prop("disabled",false)
    // lấy giá trị từ bản thân nó
    let MA = $(this).attr("data-ma")
    let MANS = $(this).attr("data-loai")
    let MABH = $(this).attr("data-qt")
    
    // lấy ảnh đưa lên
    $(".avatar-view").attr("src", domain + anh);
    let tenND = $(this).attr("data-tend") 
    let matkhau = $(this).attr("data-mk") 
    console.log("CHECK",MA,MALOAI,MAQT,hoten,gioitinh,NS,email,anh,tenND,matkhau);
    // đưa thông tin lên form
  
    $(".maNS").val(MANS)
    $(".maBH").val(MABH)
    
    
})
// Nhấn nút xóa
$(".nguoidung_tb").on('click','.nut_xoa',function()
{
  console.log("da click nut xoa")
  const ma = $(this).attr("data-ma1")
  const ma2 = $(this).attr("data-ma")
  console.log(ma)
  console.log(ma2)
  bootbox.confirm('Bạn có chắc xóa '+ma+' mã  này ?',function(result)
  {
    if (result==true)
    {   
        queryDataDelete("http://localhost:8001/api/v1/release_song_remove",{maNS:ma,maBH:ma2},function(res)
        {
            console.log(res)
            if(res.ErrorCode ==0)
                bootbox.alert("Xóa thành công " + ma)
            else 
                bootbox.alert("Xóa không thành công")
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
})

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
    
    $(".maNS").prop("disabled",false)
    $(".maBH").prop("disabled",false)
    
    //Xóa dữ liệu cũ
    
    $(".maNS").val('')
    $(".maBH").val('')
   
})
// Khi nhấn lưu
$(".btnsave").click(function()
{
    // mờ save , sáng add
    $(".btnadd").prop("disabled",false)
    $(".btnsave").prop("disabled",true)
    //Khi lưu xong
  
    $(".maNS").prop("disabled",true)
    $(".maBH").prop("disabled",true)
    // thực hiện gọi API đăng ký
    if(mode ==1)
    {
        // gọi API đăng ký
        const datasend = {
            maNS : $(".maNS").val(),
            maBH : $(".maBH").val(),
            
           
        }
        console.log(datasend);
        queryDataPost("http://localhost:8001/api/v1/release_song_add",datasend,function(res)
        {
            console.log(res)
            if(res.ErrorCode ==0)
            {
                bootbox.alert("Lưu thành công");
            }
            else {
                bootbox.alert("Lưu thất bại");
            }

        })
    }
    // thực hiện gọi API sửa
    else {
        const datasend = {
            maTL: $(".maTL").val(),
            tenTL: $(".tenTL").val(),
        };
        console.log("CHẠY VÀO KHÔNG CÓ ẢNH");
        return queryDataPut("http://localhost:8001/api/v1/genre_update", datasend, function(res) {
            console.log(res);
            if (res.ErrorCode == 0) {
                bootbox.alert("Lưu thành công");
            } else {
                bootbox.alert("Lưu thất bại");
            }
        });
    }
    show();
});