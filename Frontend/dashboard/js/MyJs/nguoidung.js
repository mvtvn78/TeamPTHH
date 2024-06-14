// phần chạy chính
$(document).ready(function(){
    // mode : 0 , chế độ ban đầu , 1 : chế dộ thêm , 2 : chế độ sửa
    let mode = 0;
    //trạng thái ban đầu
    $(".btnsave").prop("disabled",true)
    //làm mờ form
    $(".maND").prop("disabled",true)
    $(".hoTen").prop("disabled",true)
    $(".gioiTinh").prop("disabled",true)
    $(".ngaySinh").prop("disabled",true)
    $(".email").prop("disabled",true)
    $(".pass").prop("disabled",true)
    $(".file_anh").prop("disabled",true)
    $(".tenND").prop("disabled",true)
    $(".cbMaLoai").prop("disabled",true)
    $(".cbQT").prop("disabled",true)
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
    queryDataGet("http://localhost:8001/api/v1/nations", "", function (res) {
        // lấy dữ liệu từ api
        const data = res.data;
        // lấy error code để check
        const code = res.ErrorCode;
        if (code != 0) {
          $(".cbQT").html("không có dữ liệu");
        } else {
            let htmls = '';
        // lặp các element có trong data
            for (const  element in data) {
            const item = data[element];
            htmls = htmls + '<option value="' + item.MaQT + '">' + item.TenQT + "</option>";
            }
            $(".cbQT").html(htmls);
        }
      });
    // load combobox cho mã loại
    queryDataGet("http://localhost:8001/api/v1/usertypes", "", function (res) {
        // lấy dữ liệu từ api
        const data = res.data;
        // lấy error code để check
        const code = res.ErrorCode;
        if (code != 0) {
          $(".cbMaLoai").html("không có dữ liệu");
        } else {
            let htmls = '';
        // lặp các element có trong data
            for (const  element in data) {
            const item = data[element];
            htmls = htmls + '<option value="' + item.MaLoai + '">' + item.TenQuyen + "</option>";
            }
            $(".cbMaLoai").html(htmls);
        }
      });
}
// lấy danh sách người dùng
function show()
{
    queryDataGet("http://localhost:8001/api/v1/users","",function(res){
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
                const ngaysinh = new Date(obj.NgaySinh);
                const hienthingaysinh = ConvertDate(ngaysinh.toLocaleDateString())
                const hienthigioitinh = (obj.GioiTinh ==1 ) ? "Nam":"Nữ";
                const ngaytao = new Date(obj.ThoiGianTao);
                const ngaysua = new Date(obj.ThoiGianSua);
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MAND+'</td>'+
                                '<td>'+obj.MaLoai+'</td>'+
                                '<td>'+obj.MaQT+'</td>'+
                                '<td>'+obj.HoTen+'</td>'+
                                '<td>'+hienthigioitinh+'</td>'+
                                '<td>'+hienthingaysinh+'</td>'+
                                '<td>'+obj.Email+'</td>'+
                                '<td>'+obj.Anh+'</td>'+
                                '<td>'+obj.TenND+'</td>'+
                                '<td>'+obj.MatKhau+'</td>'+
                                '<td>'+DisplayDateTime(ngaytao.toLocaleString())+'</td>'+
                                '<td>'+DisplayDateTime(ngaysua.toLocaleString())+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-ma ="'+obj.MAND+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span class="badge badge-danger nut_sua" data-ma ="'+
                                obj.MAND+
                                '" data-loai ="'+obj.MaLoai+ 
                                '" data-qt ="'+obj.MaQT+ 
                                '" data-ht ="'+obj.HoTen+
                                '" data-gt ="'+obj.GioiTinh+
                                '" data-date ="'+ConvertDate(ngaysinh.toLocaleDateString(),false)+
                                '" data-email ="'+obj.Email+
                                '" data-anh ="'+obj.Anh+
                                '" data-tend ="'+obj.TenND+
                                '" data-mk ="'+obj.MatKhau+
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
    queryDataGet("http://localhost:8001/api/v1/users?id="+keyseacrh,"",function(res){
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
                const ngaysinh = new Date(obj.NgaySinh);
                const hienthingaysinh = ConvertDate(ngaysinh.toLocaleDateString())
                const ngaytao = new Date(obj.ThoiGianTao);
                const ngaysua = new Date(obj.ThoiGianSua);
                const hienthigioitinh = (obj.GioiTinh ==1 ) ? "Nam":"Nữ";
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MAND+'</td>'+
                                '<td>'+obj.MaLoai+'</td>'+
                                '<td>'+obj.MaQT+'</td>'+
                                '<td>'+obj.HoTen+'</td>'+
                                '<td>'+hienthigioitinh+'</td>'+
                                '<td>'+hienthingaysinh+'</td>'+
                                '<td>'+obj.Email+'</td>'+
                                '<td>'+obj.Anh+'</td>'+
                                '<td>'+obj.TenND+'</td>'+
                                '<td>'+obj.MatKhau+'</td>'+
                                '<td>'+ConvertDateTime(ngaytao.toLocaleString())+'</td>'+
                                '<td>'+ConvertDateTime(ngaysua.toLocaleString())+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-ma ="'+obj.MAND+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span class="badge badge-danger nut_sua" data-ma ="'+
                                obj.MAND+
                                '" data-loai ="'+obj.MaLoai+ 
                                '" data-qt ="'+obj.MaQT+ 
                                '" data-ht ="'+obj.HoTen+
                                '" data-gt ="'+obj.GioiTinh+
                                '" data-date ="'+ConvertDate(ngaysinh.toLocaleDateString(),false)+
                                '" data-email ="'+obj.Email+
                                '" data-anh ="'+obj.Anh+
                                '" data-tend ="'+obj.TenND+
                                '" data-mk ="'+obj.MatKhau+
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
     $(".maND").prop("disabled",true)
     $(".hoTen").prop("disabled",false)
     $(".gioiTinh").prop("disabled",false)
     $(".ngaySinh").prop("disabled",false)
     $(".email").prop("disabled",false)
     $(".pass").prop("disabled",false)
     $(".file_anh").prop("disabled",false)
     $(".tenND").prop("disabled",false)
     $(".pass").prop("disabled",false)
     $(".cbMaLoai").prop("disabled",false)
     $(".cbQT").prop("disabled",false)
    // mờ add , sáng save
    $(".btnadd").prop("disabled",true)
    $(".btnsave").prop("disabled",false)
    // lấy giá trị từ bản thân nó
    let MA = $(this).attr("data-ma")
    let MALOAI = $(this).attr("data-loai")
    let MAQT = $(this).attr("data-qt")
    let hoten = $(this).attr("data-ht")
    let gioitinh = $(this).attr("data-gt")
    let NS = $(this).attr("data-date")
    let email = $(this).attr("data-email") 
    let anh = $(this).attr("data-anh") 
    // lấy ảnh đưa lên
    $(".avatar-view").attr("src", domain + anh);
    let tenND = $(this).attr("data-tend") 
    let matkhau = $(this).attr("data-mk") 
    console.log("CHECK",MA,MALOAI,MAQT,hoten,gioitinh,NS,email,anh,tenND,matkhau);
    // đưa thông tin lên form
    $(".maND").val(MA)
    $(".hoTen").val(hoten)
    $(".cbMaLoai").val(MALOAI)
    $(".cbQT").val(MAQT)
    $(".gioiTinh").val(gioitinh)
    $(".tenND").val(tenND)
    $(".email").val(email)
    $(".pass").val(matkhau)
    $(".ngaySinh").val(NS)
    $(".file_name").text(anh)
    $(".hoTen").focus()
    
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
        queryDataDelete("http://localhost:8001/api/v1/user_remove",{maND:ma},function(res)
        {
            if(res.ErrorCode ==0)
                bootbox.alert("Xóa thành công" + ma)
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
    $(".maND").prop("disabled",true)
    $(".hoTen").prop("disabled",false)
    $(".gioiTinh").prop("disabled",false)
    $(".ngaySinh").prop("disabled",false)
    $(".email").prop("disabled",false)
    $(".pass").prop("disabled",false)
    $(".file_anh").prop("disabled",true)
    $(".tenND").prop("disabled",true)
    $(".cbMaLoai").prop("disabled",true)
    $(".cbQT").prop("disabled",false)
    $(".hoTen").focus()
    //Xóa dữ liệu cũ
    $(".maND").val('')
    $(".hoTen").val('')
    $(".cbMaLoai").val('')
    $(".cbQT").val('')
    $(".gioiTinh").val('')
    $(".tenND").val('')
    $(".email").val('')
    $(".pass").val('')
    $(".ngaySinh").val('')
})
// Khi nhấn lưu
$(".btnsave").click(function()
{
    // mờ save , sáng add
    $(".btnadd").prop("disabled",false)
    $(".btnsave").prop("disabled",true)
    //Khi lưu xong
    $(".maND").prop("disabled",true)
    $(".hoTen").prop("disabled",true)
    $(".gioiTinh").prop("disabled",true)
    $(".ngaySinh").prop("disabled",true)
    $(".email").prop("disabled",true)
    $(".pass").prop("disabled",true)
    $(".file_anh").prop("disabled",true)
    $(".tenND").prop("disabled",true)
    $(".cbMaLoai").prop("disabled",true)
    $(".cbQT").prop("disabled",true)
    // thực hiện gọi API đăng ký
    if(mode ==1)
    {
        // gọi API đăng ký
        const datasend = {
            maQT : $(".cbQT").val(),
            hoTen : $(".hoTen").val(),
            gioiTinh : $(".gioiTinh").val(),
            ngaySinh : $(".ngaySinh").val(),
            email :$(".email").val(),
            pass :$(".pass").val(),
        }
        console.log(datasend);
        queryDataPost("http://localhost:8001/api/v1/register",datasend,function(res)
        {
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
                maND :  $(".maND").val(),
                hoTen :  $(".hoTen").val(),
                gioiTinh :  $(".gioiTinh").val(),
                ngaySinh : $(".ngaySinh").val(),
                email :$(".email").val(),
                pass :$(".pass").val(),
                Anh : $(".file_name").text(),
                tenND : $(".tenND").val(),
                maLoai :  $(".cbMaLoai").val(),
                maQT : $(".cbQT").val(),
            }
            console.log("CHẠY VÀO KHÔNG CÓ");
            return queryDataPut("http://localhost:8001/api/v1/user_update",datasend,function(res)
            {
                console.log(res);
                if(res.ErrorCode ==0)
                {
                    bootbox.alert("Lưu thành công");
                }
                else {
                    bootbox.alert("Lưu thất bại");
                }
            })
        }
        console.log("CHẠY VÀO CÓ ẢNH");
        // Thường hợp có ảnh
        formData.append('file',fileName)
        // gọi API UPLOAD
        $.ajax({
                url: "http://localhost:8001/upload",
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
                            maND :  $(".maND").val(),
                            hoTen :  $(".hoTen").val(),
                            gioiTinh :  $(".gioiTinh").val(),
                            ngaySinh : $(".ngaySinh").val(),
                            email :$(".email").val(),
                            pass :$(".pass").val(),
                            Anh : fileName,
                            tenND : $(".tenND").val(),
                            maLoai :  $(".cbMaLoai").val(),
                            maQT : $(".cbQT").val(),
                        }
                        queryDataPut("http://localhost:8001/api/v1/user_update",datasend,function(res)
                        {
                            console.log(res);
                            if(res.ErrorCode == 0)
                            {
                                bootbox.alert("Lưu thành công");
                            }
                            else {
                                bootbox.alert("Lưu thất bại");
                            }
                        })
                    }
                    else 
                    {
                        bootbox.alert("Upload ảnh thất bại");
                    }
                }
            }
        )
       
    }
    show()
})
