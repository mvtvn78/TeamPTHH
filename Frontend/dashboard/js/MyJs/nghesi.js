// phần chạy chính
$(document).ready(function(){
    // mode : 0 , chế độ ban đầu , 1 : chế dộ thêm , 2 : chế độ sửa
    let mode = 0;
    //trạng thái ban đầu
    $(".btnsave").prop("disabled",true)
    //làm mờ form
    $(".maNS").prop("disabled",true)
    $(".tenNS").prop("disabled",true)
    $(".gioiTinh").prop("disabled",true)
    $(".cbQT").prop("disabled",true)
    $(".ngaySinh").prop("disabled",true)
    $(".file_anh").prop("disabled",true)
    $(".mota").prop("disabled",true)
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
}
// lấy danh sách người dùng
function show()
{
    queryDataGet("http://localhost:8001/api/v1/artists","",function(res){
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".nghesi_tb").html("không có dữ liệu");
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
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MANS+'</td>'+
                                '<td>'+obj.TenNS+'</td>'+
                                '<td>'+obj.MaQT+'</td>'+
                                '<td>'+hienthigioitinh+'</td>'+
                                '<td>'+hienthingaysinh+'</td>'+
                                '<td>'+obj.Anh+'</td>'+
                                '<td>'+obj.MoTa+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-ma ="'+obj.MANS+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span class="badge badge-danger nut_sua" data-ma ="'+
                                obj.MANS+
                                '" data-nghesi ="'+obj.TenNS+ 
                                '" data-qt ="'+obj.MaQT+ 
                                '" data-gt ="'+obj.GioiTinh+
                                '" data-date ="'+ConvertDate(ngaysinh.toLocaleDateString(),false)+
                                '" data-anh ="'+obj.Anh+
                                '" data-mota ="'+obj.MoTa+
                                '"> '+
                                '<i class="fa fa-edit"></i>&nbsp;Sửa</span></td>'+
                              '</tr>';
              }
            // chèn vào
            $(".nghesi_tb").html(htmls);
        }
    })  
}
// Tìm kiếm tên người dùng
function showSearch ()
{
    const keyseacrh = $(".txtsearch").val()
    console.log(keyseacrh);
   
    
    queryDataGet(`http://localhost:8001/api/v1/artists_search?maNS=${keyseacrh}&tenNS=${keyseacrh}`,"",function(res){
        console.log(res);
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".nghesi_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const index in data){
                const obj=data[index];
                const ngaysinh = new Date(obj.NgaySinh);
                const hienthingaysinh = ConvertDate(ngaysinh.toLocaleDateString())
                const hienthigioitinh = (obj.GioiTinh ==1 ) ? "Nam":"Nữ";
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MANS+'</td>'+
                                '<td>'+obj.TenNS+'</td>'+
                                '<td>'+obj.MaQT+'</td>'+
                                '<td>'+hienthigioitinh+'</td>'+
                                '<td>'+hienthingaysinh+'</td>'+
                                '<td>'+obj.Anh+'</td>'+
                                '<td>'+obj.MoTa+'</td>'+
                              '</tr>';
              }
            // chèn vào
            $(".nghesi_tb").html(htmls);
        }
    })  
} 
//Nhấn nút sửa
$(".nghesi_tb").on('click','.nut_sua',function()
{
    // thay đổi mode 
    mode = 2;
     //sáng trừ mã người dùng
     $(".maNS").prop("disabled",true)
    $(".tenNS").prop("disabled",false)
    $(".gioiTinh").prop("disabled",false)
    $(".cbQT").prop("disabled",false)
    $(".ngaySinh").prop("disabled",false)
    $(".file_anh").prop("disabled",false)
    $(".mota").prop("disabled",false)
    // mờ add , sáng save
    $(".btnadd").prop("disabled",true)
    $(".btnsave").prop("disabled",false)
    // lấy giá trị từ bản thân nó
    let MA = $(this).attr("data-ma")
    let TNS = $(this).attr("data-nghesi")
    let MAQT = $(this).attr("data-qt")
    let GT = $(this).attr("data-gt")
    let DaTe = $(this).attr("data-date")
    let anh = $(this).attr("data-anh")
    let MT = $(this).attr("data-mota")
    // lấy ảnh đưa lên
    $(".avatar-view").attr("src", domain + anh);
    console.log("CHECK",MA,TNS,MAQT,GT,DaTe,anh,MT);
    // đưa thông tin lên form
    $(".maNS").val(MA)
    $(".tenNS").val(TNS)
    $(".gioiTinh").val(GT)
    $(".cbQT").val(MAQT)
    $(".ngaySinh").val(DaTe)
    $(".mota").text(MT)
    $(".file_name").text(anh)
    //
    $(".tenNS").focus()  
})
// Nhấn nút xóa
$(".nghesi_tb").on('click','.nut_xoa',function()
{
  console.log("da click nut xoa")
  const ma = $(this).attr("data-ma")
  console.log(ma)
  bootbox.confirm('Bạn có chắc xóa '+ma+' mã  này ?',function(result)
  {
    if (result==true)
    {
        queryDataDelete("http://localhost:8001/api/v1/artists_remove",{maNS:ma},function(res)
        {
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
    $(".maNS").prop("disabled",false)
    $(".tenNS").prop("disabled",false)
    $(".gioiTinh").prop("disabled",false)
    $(".cbQT").prop("disabled",false)
    $(".ngaySinh").prop("disabled",false)
    $(".file_anh").prop("disabled",false)
    $(".mota").prop("disabled",false)
    $(".maNS").focus()
    //Xóa dữ liệu cũ
    $(".maNS").val('')
    $(".tenNS").val('')
    $(".gioiTinh").val('')
    $(".cbQT").val('')
    $(".ngaySinh").val('')
    $(".file_anh").val('')
    $(".mota").val('')
    
})
// Khi nhấn lưu
$(".btnsave").click(function()
{
    // mờ save , sáng add
    $(".btnadd").prop("disabled",false)
    $(".btnsave").prop("disabled",true)
    //Khi lưu xong
    $(".maNS").prop("disabled",true)
    $(".tenNS").prop("disabled",true)
    $(".gioiTinh").prop("disabled",true)
    $(".cbQT").prop("disabled",true)
    $(".ngaySinh").prop("disabled",true)
    $(".file_anh").prop("disabled",true)
    $(".mota").prop("disabled",true)
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
                                maNS : $(".maNS").val(),
                                maQT : $(".cbQT").val(),
                                tenNS : $(".tenNS").val(),
                                Anh : fileName,
                                gt : $(".gioiTinh").val(),
                                ngaysinh : $(".ngaySinh").val(),
                                mota :$(".mota").val(),
                            }
                            queryDataPut("http://localhost:8001/api/v1/artists_update",datasend,function(res)
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
                else{
                    bootbox.alert("Lưu thành công");
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
                                maNS : $(".maNS").val(),
                                maQT : $(".cbQT").val(),
                                tenNS : $(".tenNS").val(),
                                Anh :  $(".file_name").text(),
                                gt : $(".gioiTinh").val(),
                                ngaysinh : $(".ngaySinh").val(),
                                mota :$(".mota").val(),
            }
            return queryDataPut("http://localhost:8001/api/v1/artists_update",datasend,function(res)
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
                            maNS : $(".maNS").val(),
                            maQT : $(".cbQT").val(),
                            tenNS : $(".tenNS").val(),
                            Anh : fileName,
                            gt : $(".gioiTinh").val(),
                            ngaysinh : $(".ngaySinh").val(),
                            mota :$(".mota").val(),
                        }
                        queryDataPut("http://localhost:8001/api/v1/artists_update",datasend,function(res)
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
