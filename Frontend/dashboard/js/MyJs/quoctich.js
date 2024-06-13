// phần chạy chính
$(document).ready(function(){
    // mode : 0 , chế độ ban đầu , 1 : chế dộ thêm , 2 : chế độ sửa
    let mode = 0;
    //trạng thái ban đầu
    $(".btnsave").prop("disabled",true)
    //làm mờ form
    $(".maqt").prop("disabled",true)
    $(".tenqt").prop("disabled",true)
    comboBox()
    show()
});



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
    queryDataGet("http://localhost:8001/api/v1/nations","",function(res){
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
    queryDataGet("http://localhost:8001/api/v1/nations_search",datasend,function(res){
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
                                '" ata-anh ="'+obj.Anh+
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
        queryDataDelete("http://localhost:8001/api/v1/nation_remove",{maQT:ma},function(res)
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
    //Khi lưu xong
    $(".maqt").prop("disabled",false)
    $(".tenqt").prop("disabled",false)
    $(".file_anh").prop("disabled",false)
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
                            maQT : $(".maqt").val(),
                            tenQT : $(".tenqt").val(),
                            anh : fileName,
                        }
                        queryDataPost("http://localhost:8001/api/v1/nation_add",datasend,function(res)
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
                maQT : $(".maqt").val(),
                tenQT : $(".tenqt").val(),
                anh : fileName,
            }
            console.log("CHẠY VÀO KHÔNG CÓ");
            return queryDataPut("http://localhost:8001/api/v1/nation_update",datasend,function(res)
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
                            maQT : $(".maqt").val(),
                            tenQT : $(".tenqt").val(),
                            anh : fileName,
                        }
                        queryDataPut("http://localhost:8001/api/v1/nation_update",datasend,function(res)
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
